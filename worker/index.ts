import { Worker } from "bullmq";
import IORedis from "ioredis";

// import shared code from web
import { db } from "@web/lib/db";
import { postOnLinkedin } from "@web/modules/post/post-publish/post-publish.service";

console.log("🚀 Worker started");

// Redis connection (MUST match web)
const redis = new IORedis({
  host: process.env.REDIS_HOST || "redis",
  port: 6379,
  maxRetriesPerRequest: null,
});

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
