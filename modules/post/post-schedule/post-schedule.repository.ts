import { db } from "@/lib/db";
import { POST_STATUS } from "@/constants/post-status";
import type { RowDataPacket } from "mysql2";

export async function draftBelongsToUser(
  draftId: number,
  userId: number
) {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT id FROM post_drafts WHERE id = ? AND user_id = ? LIMIT 1`,
    [draftId, userId]
  );
  return rows.length > 0;
}

export async function upsertSchedule(
  draftId: number,
  scheduledAt: string,
  timezone: string
) {
  await db.query(
    `
    INSERT INTO scheduled_posts (draft_id, scheduled_at, timezone, status)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      scheduled_at = VALUES(scheduled_at),
      timezone = VALUES(timezone),
      status = ?
    `,
    [
      draftId,
      scheduledAt,
      timezone,
      POST_STATUS.PENDING,
      POST_STATUS.PENDING,
    ]
  );
}

export async function getScheduleByDraft(
  draftId: number,
  userId: number
) {
  const [rows] = await db.query<RowDataPacket[]>(
    `
    SELECT s.*
    FROM scheduled_posts s
    JOIN post_drafts d ON d.id = s.draft_id
    WHERE s.draft_id = ? AND d.user_id = ?
    `,
    [draftId, userId]
  );
  return rows[0] ?? null;
}

export async function getAllSchedules(userId: number) {
  const [rows] = await db.query<RowDataPacket[]>(
    `
    SELECT s.id, s.draft_id, s.scheduled_at, s.timezone, s.status, d.topic
    FROM scheduled_posts s
    JOIN post_drafts d ON d.id = s.draft_id
    WHERE d.user_id = ?
    ORDER BY s.scheduled_at ASC
    `,
    [userId]
  );
  return rows;
}

export async function updateSchedule(
  draftId: number,
  userId: number,
  scheduledAt: string,
  timezone: string
) {
  await db.query(
    `
    UPDATE scheduled_posts s
    JOIN post_drafts d ON d.id = s.draft_id
    SET s.scheduled_at = ?, s.timezone = ?, s.status = ?
    WHERE s.draft_id = ? AND d.user_id = ?
    `,
    [scheduledAt, timezone, POST_STATUS.PENDING, draftId, userId]
  );
}

export async function deleteSchedule(
  draftId: number,
  userId: number
) {
  await db.query(
    `
    DELETE s
    FROM scheduled_posts s
    JOIN post_drafts d ON d.id = s.draft_id
    WHERE s.draft_id = ? AND d.user_id = ?
    `,
    [draftId, userId]
  );
}
