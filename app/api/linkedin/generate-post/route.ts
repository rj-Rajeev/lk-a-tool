import { getAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY!,
});

const PROVIDER = 'linkedin'

export async function POST(request: Request){
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

        const { topic } = await request.json();

        const prompt = `
            You are an AI assistant that helps to generate viral friendly content for ${PROVIDER} Follow these rules:
            1. Today's topic is: ${topic}
            2. Motive: ${config.motive}
            3. niche: ${config.niche}
            4. tone: ${config.tone}
            5. expertise_level: ${config.expertise_level}
            User Defined RULES:
                ${config.rules}

            explain provided topic properly, in around 100-150 words.
        `
        const response = await openai.chat.completions.create({
                    model: "openai/gpt-3.5-turbo",
            messages: [
                { role: "system", content: prompt},
                {
                    role: "user",
                    content: "provide without any extra instructions or unrelated content",
                },
            ],
        })

        

        return NextResponse.json({
            success: true,
            content: response?.choices[0]?.message?.content
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: (error as Error).message
        })
    }
}