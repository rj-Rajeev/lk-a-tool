import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { PROVIDERS } from "@/constants/providers";
import {
  getPromptConfig,
  savePromptConfig,
} from "@/modules/prompt/prompt-config.service";

export async function GET() {
  try {
    const user = await getAuth();
    if(!user){
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const config = await getPromptConfig(
      user.userId,
      PROVIDERS.LINKEDIN
    );

    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch prompt config" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuth();
    if(!user){
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const data = await request.json();

    const promptConfigId = await savePromptConfig(
      user.userId,
      PROVIDERS.LINKEDIN,
      data
    );

    return NextResponse.json({
      success: true,
      prompt_config_id: promptConfigId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save prompt config" },
      { status: 500 }
    );
  }
}
