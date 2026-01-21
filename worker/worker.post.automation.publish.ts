import { db } from "@/lib/db";
import { publishQueue } from "@/lib/queues/publish.queue";

export async function automationPublishWorker() {
  try {
    console.log("[AutomationPublishWorker] Looking for approved drafts");

    /**
     * 1️⃣ Select run IDs eligible for publish
     */
    const [toLock]: any = await db.query(`
      SELECT r.id
      FROM post_automation_runs r
      JOIN post_automation_schedules s ON s.id = r.schedule_id
      JOIN post_drafts d ON d.id = r.draft_id
      WHERE r.run_date = CURDATE()
        AND r.status = 'DRAFT_CREATED'
        AND r.published_at IS NULL
        AND r.in_progress = FALSE
        AND d.is_approved = TRUE
        AND CURTIME() >= CAST(
          JSON_UNQUOTE(JSON_EXTRACT(s.times, '$[0]')) AS TIME
        )
      ORDER BY r.id
      LIMIT 5
    `);

    if (!toLock.length) {
      console.log("[AutomationPublishWorker] Nothing to publish");
      return;
    }

    const runIds = toLock.map((r: any) => r.id);

    /**
     * 2️⃣ Lock runs (no status change)
     */
    await db.query(
      `
      UPDATE post_automation_runs
      SET in_progress = TRUE
      WHERE id IN (?)
      `,
      [runIds]
    );

    /**
     * 3️⃣ Fetch locked runs
     */
    const [rows]: any = await db.query(
      `
      SELECT
        r.id AS run_id,
        r.draft_id,
        s.user_id
      FROM post_automation_runs r
      JOIN post_automation_schedules s ON s.id = r.schedule_id
      WHERE r.id IN (?)
      `,
      [runIds]
    );

    /**
     * 4️⃣ Enqueue publish jobs
     */
    for (const row of rows) {
      await publishQueue.add(
        "publish",
        {
          runId: row.run_id,
          draftId: row.draft_id,
          userId: row.user_id,
        },
        {
          jobId: `automation_publish_${row.run_id}`,
          attempts: 5,
          backoff: { type: "exponential", delay: 30_000 },
          removeOnComplete: true,
          removeOnFail: false,
        }
      );
    }

    /**
     * 5️⃣ Release lock
     */
    await db.query(
      `
      UPDATE post_automation_runs
      SET in_progress = FALSE
      WHERE id IN (?)
      `,
      [runIds]
    );

    console.log(
      `[AutomationPublishWorker] Enqueued ${rows.length} drafts`
    );

  } catch (error) {
    console.error("[AutomationPublishWorker] Failed", error);
  }
}

console.log("[AutomationPublishWorker] Loaded");
