import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { signToken } from "@/lib/auth";

const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET!;

/**
 * Try silent LinkedIn auth using SessionHint
 * Returns AppToken string if successful, otherwise null
 */
export async function trySilentLinkedInAuth(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionHint = cookieStore.get("SessionHint")?.value;

  if (!sessionHint) return null;

  // 1️⃣ Load OAuth record for THIS user
  const [rows]: any = await db.query(
    `
    SELECT *
    FROM oauth_accounts
    WHERE provider = 'linkedin'
      AND user_id = ?
    LIMIT 1
    `,
    [Number(sessionHint)]
  );

  if (!rows.length) return null;

  const account = rows[0];

  // 2️⃣ Check refresh token expiry
  if (
    !account.refresh_token ||
    new Date(account.refresh_token_expires_at) < new Date()
  ) {
    return null;
  }

  // 3️⃣ Refresh access token
  const refreshed = await refreshLinkedInToken(account.refresh_token);
  if (!refreshed?.access_token) return null;

  // 4️⃣ Verify identity via profile
  const profile = await fetchLinkedInProfile(refreshed.access_token);
  if (!profile?.sub || profile.sub !== account.provider_user_id) {
    return null;
  }

  // 5️⃣ Update tokens
  await db.query(
    `
    UPDATE oauth_accounts
    SET access_token = ?,
        access_token_expires_at = ?
    WHERE id = ?
    `,
    [
      refreshed.access_token,
      refreshed.access_token_expires_at,
      account.id,
    ]
  );

  // 6️⃣ Issue new AppToken
  return signToken({
    userId: account.user_id,
    email: profile.email
  });
}

/* ---------------- helpers ---------------- */

async function refreshLinkedInToken(refreshToken: string) {
  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();

  return {
    access_token: data.access_token,
    access_token_expires_at: new Date(
      Date.now() + data.expires_in * 1000
    ),
  };
}

async function fetchLinkedInProfile(accessToken: string) {
  const res = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) return null;
  return res.json();
}
