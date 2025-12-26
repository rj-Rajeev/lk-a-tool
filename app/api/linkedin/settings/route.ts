import { getAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type PromptConfigInput = {
  motive: string;
  niche: string;
  tone: string;
  expertise_level: string;
  rules: string;
  provider: string; // linkedin, instagram, youtube
};

/**
 * GET prompt config for a provider
 * /api/prompt?provider=linkedin
 */
export async function GET(request: Request) {
  try {
    const user = await getAuth();
    const provider = 'linkedin'

    const [rows]: any = await db.query(
      `
      SELECT pc.*
      FROM provider_prompt_map ppm
      JOIN prompt_config pc ON pc.id = ppm.prompt_config_id
      WHERE ppm.user_id = ?
        AND ppm.provider = ?
      LIMIT 1
      `,
      [user.userId, provider]
    );

    return NextResponse.json({
      success: true,
      data: rows[0] || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch prompt config" },
      { status: err.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}

/**
 * CREATE / UPDATE prompt config + map to provider
 */
export async function POST(request: Request) {
  const connection = await db.getConnection();

  try {
    const user = await getAuth();
    const data: PromptConfigInput = await request.json();

    if (!data.provider) {
      return NextResponse.json(
        { error: "provider is required" },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    /**
     * 1️⃣ Insert prompt config
     */
    const [result]: any = await connection.query(
      `
      INSERT INTO prompt_config
        (user_id, motive, niche, tone, expertise_level, rules)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        user.userId,
        data.motive,
        data.niche,
        data.tone,
        data.expertise_level,
        data.rules,
      ]
    );

    const promptConfigId = result.insertId;

    /**
     * 2️⃣ Map prompt to provider (UPSERT)
     */
    await connection.query(
      `
      INSERT INTO provider_prompt_map
        (user_id, provider, prompt_config_id)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        prompt_config_id = VALUES(prompt_config_id)
      `,
      [user.userId, data.provider, promptConfigId]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      prompt_config_id: promptConfigId,
    });
  } catch (err: any) {
    await connection.rollback();

    return NextResponse.json(
      { error: err.message || "Failed to save prompt config" },
      { status: err.message.includes("Unauthorized") ? 401 : 500 }
    );
  } finally {
    connection.release();
  }
}
