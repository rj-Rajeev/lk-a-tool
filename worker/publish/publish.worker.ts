import { Worker } from "bullmq";
import { QueueEvents } from "bullmq";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { postOnLinkedin } from "@/modules/post/post-publish/post-publish.service";
import { PUBLISH_QUEUE_NAME } from "@/lib/queues/publish.queue";

console.log("🚀 Publish Worker started");
console.log("🟢 Queue Redis:", redis.options);

const events = new QueueEvents(PUBLISH_QUEUE_NAME, { connection: redis });

events.on("waiting", ({ jobId }) => {
  console.log("⏳ Job waiting", jobId);
});

events.on("active", ({ jobId }) => {
  console.log("⚙️ Job active", jobId);
});

events.on("completed", ({ jobId }) => {
  console.log("✅ Job completed", jobId);
});

events.on("failed", ({ jobId, failedReason }) => {
  console.log("❌ Job failed", jobId, failedReason);
});


new Worker(
  PUBLISH_QUEUE_NAME,
  async (job) => {
    console.log("🔥 Publish job received", job.id, job.data);

    const { runId, draftId, userId } = job.data;

    try {
      await db.query(
        `
        UPDATE post_automation_runs
        SET status = 'PUBLISHING',
            in_progress = TRUE
        WHERE id = ?
        `,
        [runId]
      );

      await postOnLinkedin(draftId, userId);

      await db.query(
        `
        UPDATE post_automation_runs
        SET status = 'PUBLISHED',
            published_at = NOW(),
            in_progress = FALSE
        WHERE id = ?
        `,
        [runId]
      );

      console.log("✅ Published run", runId);
    } catch (err: any) {
      await db.query(
        `
        UPDATE post_automation_runs
        SET status = 'PUBLISH_FAILED',
            last_error = ?,
            in_progress = FALSE
        WHERE id = ?
        `,
        [err.message, runId]
      );

      throw err; // BullMQ retry
    }
  },
  {
    connection: redis,
    concurrency: 2,
    limiter: { max: 1, duration: 15000 },
  }
);
