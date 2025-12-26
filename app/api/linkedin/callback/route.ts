import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { db } from "@/lib/db";
import { signToken } from "@/lib/auth";

type LinkedInTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  id_token: string;
};

const exchangeCodeForToken = async (
  code: string
): Promise<LinkedInTokenResponse> => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
  });

  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
};

export async function GET(request: Request) {
  const connection = await db.getConnection();

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }

    const tokenData = await exchangeCodeForToken(code);

    // ⚠️ In production, verify using LinkedIn public keys
    const decoded = jwt.decode(tokenData.id_token) as JwtPayload | null;

    if (!decoded || !decoded.email || !decoded.sub) {
      throw new Error("Invalid LinkedIn token payload");
    }

    const email = decoded.email as string;
    const name = decoded.name as string | null;
    const picture = decoded.picture as string | null;
    const providerUserId = decoded.sub as string;

    const accessTokenExpiresAt = new Date(
      Date.now() + tokenData.expires_in * 1000
    );

    const refreshTokenExpiresAt = tokenData.refresh_token_expires_in
      ? new Date(Date.now() + tokenData.refresh_token_expires_in * 1000)
      : null;

    await connection.beginTransaction();

    // 1️⃣ Find or create user
    let userId: number;

    const [users]: any = await connection.query(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      [email]
    );

    if (users.length > 0) {
      userId = users[0].id;

      await connection.query(
        `UPDATE users SET name = ?, picture = ? WHERE id = ?`,
        [name, picture, userId]
      );
    } else {
      const [result]: any = await connection.query(
        `INSERT INTO users (name, email, picture) VALUES (?, ?, ?)`,
        [name, email, picture]
      );
      userId = result.insertId;
    }

    // 2️⃣ Upsert OAuth account
    await connection.query(
      `
      INSERT INTO oauth_accounts (
        user_id,
        provider,
        provider_user_id,
        access_token,
        refresh_token,
        access_token_expires_in,
        refresh_token_expires_in
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        access_token = VALUES(access_token),
        refresh_token = VALUES(refresh_token),
        access_token_expires_in = VALUES(access_token_expires_in),
        refresh_token_expires_in = VALUES(refresh_token_expires_in),
        updated_at = CURRENT_TIMESTAMP
      `,
      [
        userId,
        "linkedin",
        providerUserId,
        tokenData.access_token,
        tokenData.refresh_token ?? null,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      ]
    );

    await connection.commit();

    // 3️⃣ Issue APP token (internal identity)
    const appToken = await signToken({
      userId,
      email,
    });

    const redirectUrl = new URL("/profile/linkedin", request.url);
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set("AppToken", appToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (err: any) {
    await connection.rollback();

    return NextResponse.json(
      { error: err.message || "LinkedIn authentication failed" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
