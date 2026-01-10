import { getAuth } from "@/lib/auth";
import { db } from "@/lib/db";
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