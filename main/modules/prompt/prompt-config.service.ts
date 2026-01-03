import { db } from "@/lib/db";
import {
  getPromptConfigByUser,
  insertPromptConfig,
  mapPromptToProvider,
} from "./prompt-config.repository";

export async function getPromptConfig(
  userId: number,
  provider: string
) {
  return getPromptConfigByUser(userId, provider);
}

export async function savePromptConfig(
  userId: number,
  provider: string,
  data: {
    motive: string;
    niche: string;
    tone: string;
    expertise_level: string;
    rules: string;
  }
) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const promptConfigId = await insertPromptConfig(
      connection,
      userId,
      data
    );

    await mapPromptToProvider(
      connection,
      userId,
      provider,
      promptConfigId
    );

    await connection.commit();
    return promptConfigId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}
