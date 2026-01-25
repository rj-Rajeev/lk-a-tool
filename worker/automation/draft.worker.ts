import { db } from "@/lib/db";
import { PROVIDERS } from "@/constants/providers";
import { getPromptConfigByUser } from "@/modules/prompt/prompt-config.repository";
import { generateLinkedInTopics } from "@/modules/ai/topic.service";
import { generateLinkedInPost } from "@/modules/ai/ai.service";
import { insertPostDraft } from "@/modules/post/post-draft/post-draft.repository";
import { notifyDraftCreated } from "@/lib/sendDraftCreatedNotification";

/**
 * Draft Automation Worker
 *
 * Status lifecycle:
 * PENDING → DRAFT_CREATED
 *        ↘ FAILED
 *
 * Notes:
 * - Cron-safe (no throws)
 * - Errors persisted in DB
 * - Idempotent & lock-safe
 */
export async function postAutomationWorker() {
  let runId: number | null = null;
  let step = "INIT";

  try {
    /* 1. Pick one eligible schedule */
    step = "PICK_SCHEDULE";
    const [schedules]: any = await db.query(`
      SELECT s.id, s.user_id
      FROM post_automation_schedules s
      LEFT JOIN post_automation_runs r
        ON r.schedule_id = s.id
       AND r.run_date = CURDATE()
      WHERE s.is_active = TRUE
        AND CURDATE() BETWEEN s.start_date AND IFNULL(s.end_date, CURDATE())
        AND CURTIME() >= CAST(JSON_UNQUOTE(JSON_EXTRACT(s.times, '$[0]')) AS TIME)
        AND (r.id IS NULL OR r.status IN ('PENDING','FAILED'))
        AND (r.in_progress IS NULL OR r.in_progress = FALSE)
      LIMIT 1
    `);

    if (!schedules.length) return;

    const schedule = schedules[0];

    /* 2. Ensure today's run exists */
    step = "ENSURE_RUN";
    await db.query(
      `
      INSERT IGNORE INTO post_automation_runs (schedule_id, run_date, status)
      VALUES (?, CURDATE(), 'PENDING')
      `,
      [schedule.id]
    );

    /* 3. Lock today's run */
    step = "LOCK_RUN";
    const [runs]: any = await db.query(
      `
      SELECT id
      FROM post_automation_runs
      WHERE schedule_id = ?
        AND run_date = CURDATE()
        AND status = 'PENDING'
        AND in_progress = FALSE
      LIMIT 1
      `,
      [schedule.id]
    );

    if (!runs.length) return;

    runId = runs[0].id;

    const [lock]: any = await db.query(
      `
      UPDATE post_automation_runs
      SET in_progress = TRUE
      WHERE id = ?
        AND in_progress = FALSE
      `,
      [runId]
    );

    if (lock.affectedRows !== 1) return;

    /* 4. Fetch prompt config */
    step = "FETCH_PROMPT_CONFIG";
    const config = await getPromptConfigByUser(
      schedule.user_id,
      PROVIDERS.LINKEDIN
    );

    /* 5. Generate topic */
    step = "GENERATE_TOPIC";
    const topics = await generateLinkedInTopics(config);
    if (!topics || !topics.length) {
      throw new Error("No topics generated");
    }

    const topic = topics[0];

    /* 6. Generate content */
    step = "GENERATE_CONTENT";
    const content = await generateLinkedInPost(topic, config);

    /* 7. Save draft */
    step = "SAVE_DRAFT";
    const draftId = await insertPostDraft(
      schedule.user_id,
      topic,
      content
    );

    /* 8. Finalize run */
    step = "FINALIZE_RUN";
    await db.query(
      `
      UPDATE post_automation_runs
      SET
        draft_created_at = NOW(),
        draft_id = ?,
        status = 'DRAFT_CREATED',
        in_progress = FALSE,
        error_step = NULL,
        error_code = NULL,
        error_message = NULL
      WHERE id = ?
      `,
      [draftId, runId]
    );

    /* 9. Fire-and-forget notification */
    notifyDraftCreated(schedule.user_id, draftId).catch(() => {});
  } catch (err: any) {
    if (runId) {
      await db.query(
        `
        UPDATE post_automation_runs
        SET
          status = 'FAILED',
          in_progress = FALSE,
          error_step = ?,
          error_code = ?,
          error_message = ?
        WHERE id = ?
        `,
        [
          step,
          err?.code || "UNEXPECTED_ERROR",
          err?.message || String(err),
          runId,
        ]
      );
    }

    // ❗ IMPORTANT:
    // Do NOT throw — cron/interval workers must not crash.
    return;
  }
}
