import { db } from "@/lib/db";
import { PROVIDERS } from "@/constants/providers";
import { getPromptConfigByUser } from "@/modules/prompt/prompt-config.repository";
import { generateLinkedInTopics } from "@/modules/ai/topic.service";
import { generateLinkedInPost } from "@/modules/ai/ai.service";
import { insertPostDraft } from "@/modules/post/post-draft/post-draft.repository";
import { notifyDraftCreated } from "@/lib/sendDraftCreatedNotification";

export async function postAutomationWorker() {
  let schedule: any;
  let run: any;

  try {
    console.log("[Worker] Looking for eligible automation schedule");

    // 1️⃣ Pick ONE eligible schedule whose draft is NOT created today
    const [schedules]: any = await db.query(`
      SELECT s.*
      FROM post_automation_schedules s
      LEFT JOIN post_automation_runs r
        ON r.schedule_id = s.id
       AND r.run_date = CURDATE()
      WHERE s.is_active = TRUE
        AND CURDATE() BETWEEN s.start_date AND IFNULL(s.end_date, CURDATE())
        AND CURTIME() >= DATE_SUB(
          CAST(JSON_UNQUOTE(JSON_EXTRACT(s.times, '$[0]')) AS TIME),
          INTERVAL 1 HOUR
        )
        AND (r.id IS NULL OR r.status = 'PENDING')
        AND (r.in_progress IS NULL OR r.in_progress = FALSE)
      LIMIT 1;
    `);

    if (!schedules.length) {
      console.log("[Worker] No eligible schedule found");
      return;
    }

    schedule = schedules[0];
    console.log(
      `[Worker] Picked schedule id=${schedule.id}, user=${schedule.user_id}`
    );

    // 2️⃣ Ensure TODAY'S run row exists (idempotent)
    await db.query(
      `
      INSERT IGNORE INTO post_automation_runs (schedule_id, run_date, status)
      VALUES (?, CURDATE(), 'PENDING')
      `,
      [schedule.id]
    );

    // 3️⃣ Lock today's run
    const [runs]: any = await db.query(
      `
      SELECT *
      FROM post_automation_runs
      WHERE schedule_id = ?
        AND run_date = CURDATE()
        AND status = 'PENDING'
        AND in_progress = FALSE
      LIMIT 1
      `,
      [schedule.id]
    );

    if (!runs.length) {
      console.log("[Worker] Run already processed or locked");
      return;
    }

    run = runs[0];

    await db.query(
      `
      UPDATE post_automation_runs
      SET in_progress = TRUE
      WHERE id = ?
      `,
      [run.id]
    );

    console.log(`[Worker] Locked run id=${run.id}`);

    // 4️⃣ Fetch prompt config
    const config = await getPromptConfigByUser(
      schedule.user_id,
      PROVIDERS.LINKEDIN
    );

    // 5️⃣ Generate topic
    const topics = await generateLinkedInTopics(config);
    if (!topics?.length) {
      throw new Error("No topics generated");
    }

    const topic = topics[0];
    console.log("[Worker] Topic selected", topic);

    // 6️⃣ Generate content
    const content = await generateLinkedInPost(topic, config);

    // 7️⃣ Save draft
    const draftId = await insertPostDraft(
      schedule.user_id,
      topic,
      content
    );

    console.log(`[Worker] Draft saved id=${draftId}`);

    // 8️⃣ Update run (draft created)
    await db.query(
      `
      UPDATE post_automation_runs
      SET
        draft_created_at = NOW(),
        draft_id = ?,
        status = 'DRAFT_CREATED',
        in_progress = FALSE
      WHERE id = ?
      `,
      [draftId, run.id]
    );

    // 9️⃣ Notify user (NON-BLOCKING)
    notifyDraftCreated(schedule.user_id, draftId)
      .then(() =>
        console.log(`[Worker] Notification sent for draft=${draftId}`)
      )
      .catch(err =>
        console.error(
          `[Worker] Notification failed for draft=${draftId}`,
          err
        )
      );

    console.log(
      `[Worker] Draft phase completed for schedule=${schedule.id}, run=${run.id}`
    );

  } catch (error) {
    console.error("[Worker] Draft automation failed", {
      scheduleId: schedule?.id,
      runId: run?.id,
      error,
    });

    if (run?.id) {
      await db.query(
        `
        UPDATE post_automation_runs
        SET in_progress = FALSE,
            status = 'FAILED'
        WHERE id = ?
        `,
        [run.id]
      );
    }
  }
}

console.log("[Worker] Post Automation Draft Worker loaded");
