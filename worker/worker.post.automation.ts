import { db } from "@/lib/db";
import { PROVIDERS } from "@/constants/providers";
import { getPromptConfigByUser } from "@/modules/prompt/prompt-config.repository";
import { generateLinkedInTopics } from "@/modules/ai/topic.service";
import { generateLinkedInPost } from "@/modules/ai/ai.service";
import { insertPostDraft } from "@/modules/post/post-draft/post-draft.repository";
import { notifyDraftCreated } from "@/lib/sendDraftCreatedNotification";


export async function postAutomationWorker() {
  let schedule: any;

  try {
    console.log('[Worker] Looking for eligible automation schedule');

    // 1️⃣ Pick ONE schedule
    const [rows]: any = await db.query(`
      SELECT *
      FROM post_automation_schedules
      WHERE is_active = TRUE
        AND in_progress = FALSE
        AND CURDATE() BETWEEN start_date AND IFNULL(end_date, CURDATE())
        AND CURTIME() >= CAST(JSON_UNQUOTE(JSON_EXTRACT(times, '$[0]')) AS TIME)
        AND (last_run_at IS NULL OR DATE(last_run_at) < CURDATE())
      LIMIT 1;
    `);

    if (!rows?.length) {
      console.log('[Worker] No eligible schedule found');
      return;
    }

    schedule = rows[0];
    console.log(
      `[Worker] Picked schedule id=${schedule.id}, user=${schedule.user_id}`
    );

    // 2️⃣ LOCK it
    console.log(`[Worker] Locking schedule id=${schedule.id}`);
    await db.query(
      `UPDATE post_automation_schedules
       SET in_progress = TRUE
       WHERE id = ?`,
      [schedule.id]
    );

    // 3️⃣ Freeze inputs
    console.log(
      `[Worker] Fetching prompt config for user=${schedule.user_id}`
    );
    const config = await getPromptConfigByUser(
      schedule.user_id,
      PROVIDERS.LINKEDIN
    );

    console.log(`[Worker] Generating topics (schedule=${schedule.id})`);
    const topics = await generateLinkedInTopics(config);
    if (!topics?.length) {
      throw new Error('No topics generated');
    }


    const topic = topics[0];
    console.log(`--->>[Worker] Topic selected`, topic);

    // 4️⃣ Generate post
    console.log(`[Worker] Generating post content`);
    const content = await generateLinkedInPost(topic, config);

    // 5️⃣ Save draft
    console.log(
      `[Worker] Saving draft for user=${schedule.user_id}, schedule=${schedule.id} --->>\n`,content
    );
    const draftId = await insertPostDraft(
      schedule.user_id,
      topic,
      content
    );

    console.log(
      `[Worker] Draft saved id=${draftId}, notifying user`
    );

    // 6️⃣ Notify user (NON-BLOCKING)
    const notification = await notifyDraftCreated(schedule.user_id, draftId)
      .then(() =>
        console.log(
          `[Worker] Notification sent for draft=${draftId}`
        )
      )
      .catch(err =>
        console.error(
          `[Worker] Notification failed for draft=${draftId}`,
          err
        )
      );

    console.log('----------notification1------>>',notification);
    
    // 7️⃣ Mark success
    console.log(`[Worker] Marking schedule completed id=${schedule.id}`);
    await db.query(
      `UPDATE post_automation_schedules
       SET last_run_at = NOW(),
           in_progress = FALSE
       WHERE id = ?`,
      [schedule.id]
    );

    console.log(
      `[Worker] Completed automation for schedule=${schedule.id}`
    );

  } catch (error) {
    console.error(
      `[Worker] Automation failed`,
      {
        scheduleId: schedule?.id,
        userId: schedule?.user_id,
        error,
      }
    );

    // 8️⃣ Always release lock on failure
    if (schedule?.id) {
      console.log(
        `[Worker] Releasing lock for schedule=${schedule.id}`
      );
      await db.query(
        `UPDATE post_automation_schedules
         SET in_progress = FALSE
         WHERE id = ?`,
        [schedule.id]
      );
    }
  }
}

console.log('[Worker] Post Automation Worker loaded');

