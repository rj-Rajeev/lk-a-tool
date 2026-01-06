// app/api/automation/schedules/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = request.nextUrl.searchParams;

  const provider = query.get('provider');

  const [rows] = await db.query(
    `
    SELECT
      id,
      provider,
      rule_type,
      days,
      times,
      timezone,
      start_date,
      end_date,
      is_active,
      last_run_at,
      next_run_at,
      created_at
    FROM post_automation_schedules
    WHERE user_id = ?
    AND provider = ?
    ORDER BY created_at DESC
    `,
    [user.userId, provider]
  );

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const user = await getAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const {
    provider,
    rule_type,
    days,
    times,
    start_date,
    end_date,
  } = body;

  if (!provider || !rule_type || !times || !start_date) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (rule_type === "specific_days" && (!days || days.length === 0)) {
    return NextResponse.json(
      { error: "Days required for specific_days rule" },
      { status: 400 }
    );
  }

  const [result]: any = await db.query(
    `
    INSERT INTO post_automation_schedules (
      user_id,
      provider,
      rule_type,
      days,
      times,
      start_date,
      end_date,
      is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    ON DUPLICATE KEY UPDATE
      rule_type   = VALUES(rule_type),
      days        = VALUES(days),
      times       = VALUES(times),
      start_date  = VALUES(start_date),
      end_date    = VALUES(end_date),
      is_active   = 1,
      updated_at  = CURRENT_TIMESTAMP
    `,
    [
      user.userId,
      provider,
      rule_type,
      days ? JSON.stringify(days) : null,
      JSON.stringify(times),
      start_date,
      end_date || null,
    ]
  );

  return NextResponse.json({
    success: true,
    schedule_id: result.insertId || result.insertId === 0 ? result.insertId : null,
  });
}


