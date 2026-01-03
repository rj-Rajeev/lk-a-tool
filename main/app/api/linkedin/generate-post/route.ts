import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { PROVIDERS } from "@/constants/providers";
import { getPromptConfigByUser } from "@/modules/prompt/prompt-config.repository";
import { generateLinkedInPost } from "@/modules/ai/ai.service";

export async function POST(request: Request) {
  try {
    const auth = await getAuth();
    if(!auth){
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
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

    const content = await generateLinkedInPost(topic, config);

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
