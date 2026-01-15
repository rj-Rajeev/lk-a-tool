import { getAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendPushToTokens } from "@/lib/notifications";
import { getUserFcmTokens } from "@/modules/fcm/fcm.repository";
import { NextResponse } from "next/server";

export async function POST(request: Request){
    try {
        const user = await getAuth();
        const { token, deviceType } = await request.json();
        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }

        const query = `
            INSERT INTO user_fcm_tokens (user_id, fcm_token, device_type, last_seen)
            VALUES (?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE 
            last_seen = NOW(), 
            user_id = VALUES(user_id)
            `;

            await db.execute(query, [user?.userId, token, deviceType || 'web']);

            return NextResponse.json({ message: "Token saved successfully" }, { status: 200 });
        } catch (error) {
            console.error("Database error:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = await getAuth();
    const title = searchParams.get('title');
    const body = searchParams.get('body');

    if (!userId || !title || !body) {
      return NextResponse.json(
        { success: false, message: 'Missing userId, title, or body' },
        { status: 400 }
      );
    }

    // 1. Get tokens
    const tokens = await getUserFcmTokens(userId.userId);

    if (tokens.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No FCM tokens found for user',
      });
    }

    // 2. Send push
    const result = await sendPushToTokens(tokens, {
      title,
      body,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error('Send notification error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}