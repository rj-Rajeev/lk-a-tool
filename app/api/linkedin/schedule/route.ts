import { getAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export async function POST(request: Request) {
  const user = await getAuth();
  const { draftId, scheduledAt, timezone } = await request.json();

  if (!draftId || !scheduledAt || !timezone) {
    return new Response(
      JSON.stringify({ message: "Missing required fields" }),
      { status: 400 }
    );
  }

  // Ensure draft belongs to user
  const [draft] = await db.query<RowDataPacket[]>(
    `SELECT id FROM post_drafts WHERE id = ? AND user_id = ?`,
    [draftId, user.userId]
  );

  if (!draft || draft.length === 0) {
    return new Response(
      JSON.stringify({ message: "Draft not found" }),
      { status: 404 }
    );
  }

  await db.query(
    `
    INSERT INTO scheduled_posts (draft_id, scheduled_at, timezone)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      scheduled_at = VALUES(scheduled_at),
      timezone = VALUES(timezone),
      status = 'pending'
    `,
    [draftId, scheduledAt, timezone]
  );

  return new Response(
    JSON.stringify({ message: "Post scheduled successfully" }),
    { status: 201 }
  );
}


// GET:

export async function GET(request: Request) {
  const user = await getAuth();
  const { searchParams } = new URL(request.url);
  const draftId = searchParams.get("draftId");

  if (draftId) {
    // Single draft schedule
    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT s.*
      FROM scheduled_posts s
      JOIN post_drafts d ON d.id = s.draft_id
      WHERE s.draft_id = ? AND d.user_id = ?
      `,
      [draftId, user.userId]
    );

    return new Response(JSON.stringify(rows[0] || null), { status: 200 });
  }

  // All schedules
  const [rows] = await db.query<RowDataPacket[]>(
    `
    SELECT s.id, s.draft_id, s.scheduled_at, s.timezone, s.status, d.topic
    FROM scheduled_posts s
    JOIN post_drafts d ON d.id = s.draft_id
    WHERE d.user_id = ?
    ORDER BY s.scheduled_at ASC
    `,
    [user.userId]
  );

  return new Response(JSON.stringify(rows), { status: 200 });
}


// PUT: 

export async function PUT(request: Request) {
  const user = await getAuth();
  const { draftId, scheduledAt, timezone } = await request.json();

  if (!draftId || !scheduledAt || !timezone) {
    return new Response(
      JSON.stringify({ message: "Missing required fields" }),
      { status: 400 }
    );
  }

  await db.query(
    `
    UPDATE scheduled_posts s
    JOIN post_drafts d ON d.id = s.draft_id
    SET s.scheduled_at = ?, s.timezone = ?, s.status = 'pending'
    WHERE s.draft_id = ? AND d.user_id = ?
    `,
    [scheduledAt, timezone, draftId, user.userId]
  );

  return new Response(
    JSON.stringify({ message: "Schedule updated" }),
    { status: 200 }
  );
}


// DELETE: 
export async function DELETE(request: Request) {
  const user = await getAuth();
  const { draftId } = await request.json();

  if (!draftId) {
    return new Response(
      JSON.stringify({ message: "Draft ID required" }),
      { status: 400 }
    );
  }

  await db.query(
    `
    DELETE s
    FROM scheduled_posts s
    JOIN post_drafts d ON d.id = s.draft_id
    WHERE s.draft_id = ? AND d.user_id = ?
    `,
    [draftId, user.userId]
  );

  return new Response(
    JSON.stringify({ message: "Schedule cancelled" }),
    { status: 200 }
  );
}
