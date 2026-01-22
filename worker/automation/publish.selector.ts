import { db } from "@/lib/db";
import { publishQueue } from "@/lib/queues/publish.queue";


export async function automationPublishSelector() {
  console.log("[AutomationPublishSelector] Checking approved drafts");
  
    const counts = await publishQueue.getJobCounts();
    console.log("[PublishQueue counts]", counts);

  const [runs]: any = await db.query(`
    SELECT r.id, r.draft_id, s.user_id
    FROM post_automation_runs r
    JOIN post_automation_schedules s ON s.id = r.schedule_id
    JOIN post_drafts d ON d.id = r.draft_id
    WHERE r.status = 'DRAFT_CREATED'
      AND r.in_progress = FALSE
      AND r.published_at IS NULL
      AND d.is_approved = TRUE
      AND r.run_date = CURDATE()
    LIMIT 5
  `);

  if (!runs.length) return;

  const runIds = runs.map((r: any) => r.id);

  await db.query(
    `
    UPDATE post_automation_runs
    SET in_progress = TRUE
    WHERE id IN (?)
    `,
    [runIds]
  );

  for (const run of runs) {
    await publishQueue.add(
      "publish",
      {
        runId: run.id,
        draftId: run.draft_id,
        userId: run.user_id,
      },
      {
        jobId: `automation_publish_${run.id}`,
        attempts: 10,
        backoff: { type: "exponential", delay: 30000 },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
  }

  console.log(`[AutomationPublishSelector] Enqueued ${runs.length}`);
}
