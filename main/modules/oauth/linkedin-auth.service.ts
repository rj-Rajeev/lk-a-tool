import { db } from "@/lib/db";
import { upsertUser } from "@/modules/user/user.repository";
import { upsertOAuthAccount } from "@/modules/user/oauth-account.repository";
import { PROVIDERS } from "@/constants/providers";

type LinkedInAuthInput = {
  email: string;
  name: string | null;
  picture: string | null;
  providerUserId: string;
  accessToken: string;
  refreshToken: string | null;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date | null;
};

export async function handleLinkedInDbAuth(input: LinkedInAuthInput) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const userId = await upsertUser(connection, {
      email: input.email,
      name: input.name,
      picture: input.picture,
    });

    await upsertOAuthAccount(connection, {
      userId,
      provider: PROVIDERS.LINKEDIN,
      providerUserId: input.providerUserId,
      accessToken: input.accessToken,
      refreshToken: input.refreshToken,
      accessTokenExpiresAt: input.accessTokenExpiresAt,
      refreshTokenExpiresAt: input.refreshTokenExpiresAt,
    });

    await connection.commit();
    return userId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
