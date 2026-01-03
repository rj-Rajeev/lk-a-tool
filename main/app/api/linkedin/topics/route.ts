import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { PROVIDERS } from "@/constants/providers";
import { getPromptConfigByUser } from "@/modules/prompt/prompt-config.repository";
import { generateLinkedInTopics } from "@/modules/ai/topic.service";

export async function GET() {
  try {
    const auth = await getAuth();
    if(!auth){
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const config = await getPromptConfigByUser(
      auth.userId,
      PROVIDERS.LINKEDIN
    );

    if (!config) {
      return NextResponse.json(
        { error: "LinkedIn prompt settings not found" },
        { status: 400 }
      );
    }

    const topics = await generateLinkedInTopics(config);

    return NextResponse.json({
      success: true,
      topics,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to generate topics" },
      { status: 500 }
    );
  }
}
