import { Worker } from "bullmq";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { postOnLinkedin } from "@/modules/post/post-publish/post-publish.service";
import { PUBLISH_QUEUE_NAME } from "@/lib/queues/publish.queue";

new Worker(
  PUBLISH_QUEUE_NAME,
  async (job) => {
    const { runId, draftId, userId } = job.data;

    if (!runId || !draftId || !userId) {
      throw new Error("Invalid job payload");
    }

    // STEP 1: acquire lock + transition
    const [lock]: any = await db.query(
      `
      UPDATE post_automation_runs
      SET
        status = 'PENDING',
        in_progress = TRUE
      WHERE id = ?
        AND status = 'DRAFT_CREATED'
        AND in_progress = FALSE
      `,
      [runId]
    );

    // Another worker already took it or already processed
    if (lock.affectedRows !== 1) return;

    try {
      // STEP 2: publish (must throw on failure)
      await Promise.race([
        postOnLinkedin(draftId, userId),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("PUBLISH_TIMEOUT")), 15000)
        ),
      ]);

      // STEP 3: mark success
      await db.query(
        `
        UPDATE post_automation_runs
        SET
          status = 'PUBLISHED',
          published_at = NOW(),
          in_progress = FALSE,
          error_step = NULL,
          error_code = NULL,
          error_message = NULL
        WHERE id = ?
        `,
        [runId]
      );
    } catch (err: any) {
      
      console.log('--------------------', err);
      
      // STEP 4: persist failure context (THIS WAS MISSING)
      await db.query(
        `
        UPDATE post_automation_runs
        SET
          status = 'FAILED',
          in_progress = FALSE,
          error_step = 'PUBLISH_LINKEDIN',
          error_code = ?,
          error_message = ?
        WHERE id = ?
        `,
        [
          err?.code || "LINKEDIN_PUBLISH_ERROR",
          err?.message || String(err),
          runId,
        ]
      );

      throw err; // BullMQ retry
    }
  },
  {
    connection: redis,
    concurrency: 1,
    limiter: { max: 1, duration: 15000 },
  }
);
