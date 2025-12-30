import { db } from "@/lib/db";

type UpsertOAuthAccountInput = {
  userId: number;
  provider: "linkedin";
  providerUserId: string;
  accessToken: string;
  refreshToken: string | null;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date | null;
};

export async function upsertOAuthAccount(
  connection: any,
  data: UpsertOAuthAccountInput
) {
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
      data.userId,
      data.provider,
      data.providerUserId,
      data.accessToken,
      data.refreshToken,
      data.accessTokenExpiresAt,
      data.refreshTokenExpiresAt,
    ]
  );
}

export async function getLinkedinAccessToken(user_id: number) {
  const res: any = await db.query(
    `SELECT access_token, provider_user_id 
     FROM oauth_accounts 
     WHERE provider = 'linkedin' AND user_id = ?`,
    [user_id]
  );
  return res;
}

