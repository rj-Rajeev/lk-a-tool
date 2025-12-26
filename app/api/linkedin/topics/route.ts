import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { db } from "@/lib/db";


import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY!,
});


const PROVIDER = "linkedin";

export async function GET() {
  try {
    const auth = await getAuth();

    const [rows]: any = await db.query(
      `
      SELECT pc.*
      FROM provider_prompt_map ppm
      JOIN prompt_config pc ON pc.id = ppm.prompt_config_id
      WHERE ppm.user_id = ?
        AND ppm.provider = ?
      LIMIT 1
      `,
      [auth.userId, PROVIDER]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "LinkedIn prompt settings not found" },
        { status: 400 }
      );
    }

    const config = rows[0];

    const systemPrompt = `
You are an expert LinkedIn content strategist.

Generate 5 trending, high-virality LinkedIn post topics.

Rules:
- Topics must strictly relate to: ${config.niche || "anything"}
- motive: ${config.motive || "anything"}
- Audience level: ${config.expertise_level || "anything"}
- Focus on latest trends, real-world impact, and curiosity
- No emojis
- No explanations
- No numbering text like "Topic 1"
- Output as a clean numbered list
`;

// console.log('systemPrompt-------\n',systemPrompt);


    const response = await openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages: [
            { role: "system", content: systemPrompt},
            {
                role: "user",
                content: "provide without any extra instructions or unrelated content",
            },
        ],
    });
    

    const content = response.choices[0]?.message?.content || "";

    // ✅ Split into topics safely
    const topics = content.split("\n-").filter(Boolean);


    return NextResponse.json({
      success: true,
      topics,
    });
  } catch (err: any) {
    console.error("/api/linkedin/topics error:", err);
    const status = err?.status || err?.response?.status || 500;
    const body = err?.response?.data || err?.message || "Failed to generate topics";
    return NextResponse.json({ error: typeof body === "string" ? body : JSON.stringify(body) }, { status });
  }
}
