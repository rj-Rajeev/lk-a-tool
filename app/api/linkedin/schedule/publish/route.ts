import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { postOnLinkedin } from "@/modules/post/post-publish/post-publish.service";

export async function GET(request: Request) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 2. Lock scheduled rows
    const [lockResult]: any = await connection.query(`
    UPDATE scheduled_posts
    SET status = 'processing'
    WHERE id IN (
        SELECT id FROM (
        SELECT sp.id
        FROM scheduled_posts sp
        JOIN post_drafts pd ON pd.id = sp.draft_id
        WHERE sp.status = 'pending'
            AND CONVERT_TZ(sp.scheduled_at, 'Asia/Kolkata', 'UTC') <= NOW()
            AND pd.status = 'scheduled'
        ORDER BY sp.scheduled_at ASC
        LIMIT 5
        ) AS t
    )
    `);

    console.log(lockResult);
    
    

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
    WHERE sp.status = 'processing'
    `);

    await connection.commit();

    let published = 0;
    let failed = 0;

    // 4. Publish posts (OUTSIDE transaction)
    for (const row of rows) {
      try {
        await postOnLinkedin(
          {
            id: row.draft_id,
            topic: row.topic,
            content: row.content,

          },
          row.user_id
        );



        // mark schedule done
        await db.query(
          `UPDATE scheduled_posts SET status='done' WHERE id=?`,
          [row.schedule_id]
        );

        published++;
      } catch (err) {
        console.error("Publish failed:", row.draft_id, err);

        await db.query(
          `UPDATE scheduled_posts SET status='failed' WHERE id=?`,
          [row.schedule_id]
        );

        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      published,
      failed,
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
