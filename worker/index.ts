import { Worker } from "bullmq";
// import shared code from web
import { db } from "@web/lib/db";
import {redis} from "@web/lib/redis"
import { postOnLinkedin } from "@web/modules/post/post-publish/post-publish.service";
import { cronPublishJob } from "./worker.cron";


console.log("🚀 Worker started");

cronPublishJob.start();

new Worker(
  "linkedin-publish",
  async (job) => {
    console.log("🔥 Job received:", job.id, job.data);

    const { scheduleId, draftId, userId } = job.data;

    try {
          await db.query(
            `UPDATE scheduled_posts
              SET status='processing',
                  attempt_count = attempt_count + 1,
                  last_attempt_at = NOW()
              WHERE id=?`,
            [scheduleId]
          );
      await postOnLinkedin(draftId, userId);

      await db.query(
        `UPDATE scheduled_posts
         SET status='done'
         WHERE id=?`,
        [scheduleId]
      );

      console.log("✅ Published", scheduleId);
    } catch (err: any) {

      console.error("❌ Publish error:", err);

      
      await db.query(
        `UPDATE scheduled_posts
         SET status='failed', last_error=?
         WHERE id=?`,
        [err.message, scheduleId]
      );

      throw err; // allow BullMQ retry
    }
  },
  {
    connection: redis,
    concurrency: 5,
    limiter: {
      max: 1,
      duration: 15000, // 1 post / 15 sec
    },
  }
);
