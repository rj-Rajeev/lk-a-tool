import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { postOnLinkedin } from "@/modules/post/post-publish/post-publish.service";
import { publishQueue } from "@/lib/queues/publish.queue";



export async function GET(request: Request) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 2. Lock scheduled rows
    const [lockResult]: any = await connection.query(`
    UPDATE scheduled_posts
    SET status = 'queued'
    WHERE id IN (
        SELECT id FROM (
        SELECT sp.id
        FROM scheduled_posts sp
        JOIN post_drafts pd ON pd.id = sp.draft_id
        WHERE sp.status = 'pending'
            AND sp.scheduled_at <= NOW()
            AND pd.status = 'scheduled'
        ORDER BY sp.scheduled_at ASC
        LIMIT 5
        ) AS t
    )
    `);
    

    if (lockResult.affectedRows === 0) {
      await connection.commit();
      return NextResponse.json({
        success: true,
        message: "No scheduled posts to publish",
      });
    }

    // 3. Fetch locked posts
    const [rows]: any = await connection.query(`
    SELECT
        sp.id AS schedule_id,
        pd.id AS draft_id,
        pd.user_id,
        pd.topic,
        pd.content
    FROM scheduled_posts sp
    JOIN post_drafts pd ON pd.id = sp.draft_id
    WHERE sp.status = 'queued'
    `);

    await connection.commit();

    // 4. Queued posts (OUTSIDE transaction)
    for (const row of rows) {
      await publishQueue.add(
        "publish",
        {
          scheduleId: row.schedule_id,
          draftId: row.draft_id,
          userId: row.user_id,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 30_000, // 30s
          },
          removeOnComplete: true,
        }
      );
    }

    return NextResponse.json({
      success: true,
      enqueued: rows.length,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Scheduler API error:", err);

    return NextResponse.json(
      { error: "Scheduler failed" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}