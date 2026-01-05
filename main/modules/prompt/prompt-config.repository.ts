import { db } from "../../lib/db";

export async function getPromptConfigByUser(
  userId: number,
  provider: string
) {
  const [rows]: any = await db.query(
    `
    SELECT pc.*
    FROM provider_prompt_map ppm
    JOIN prompt_config pc ON pc.id = ppm.prompt_config_id
    WHERE ppm.user_id = ? AND ppm.provider = ?
    LIMIT 1
    `,
    [userId, provider]
  );

  return rows[0] ?? null;
}

export async function insertPromptConfig(
  connection: any,
  userId: number,
  data: {
    motive: string;
    niche: string;
    tone: string;
    expertise_level: string;
    rules: string;
  }
) {
  const [result]: any = await connection.query(
    `
    INSERT INTO prompt_config
      (user_id, motive, niche, tone, expertise_level, rules)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      data.motive,
      data.niche,
      data.tone,
      data.expertise_level,
      data.rules,
    ]
  );

  return result.insertId;
}

export async function mapPromptToProvider(
  connection: any,
  userId: number,
  provider: string,
  promptConfigId: number
) {
  await connection.query(
    `
    INSERT INTO provider_prompt_map
      (user_id, provider, prompt_config_id)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      prompt_config_id = VALUES(prompt_config_id)
    `,
    [userId, provider, promptConfigId]
  );
}
