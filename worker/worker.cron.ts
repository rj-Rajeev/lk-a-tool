import { db } from "../main/lib/db";
import { publishQueue } from "@/lib/queues/publish.queue";
import { CronJob } from "cron";
import { postAutomationWorker } from "worker.post.automation";

export async function schedulerWorker() {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    /**
     * 1. Lock eligible rows (UTC-safe, crash-safe)
     */
        const [lockResult]: any = await connection.query(`
    UPDATE scheduled_posts
    SET status = 'queued'
    WHERE id IN (
        SELECT id FROM (
        SELECT sp.id
        FROM scheduled_posts sp
        JOIN post_drafts pd ON pd.id = sp.draft_id
        WHERE sp.status = 'pending'
            AND sp.scheduled_at <= NOW()
            AND pd.status = 'scheduled'
        ORDER BY sp.scheduled_at ASC
        LIMIT 5
        ) AS t
    )
    `);

    if (lockResult.affectedRows === 0) {
        console.log("Scheduled Not Found At", new Date().toLocaleString());
        
      await connection.commit();
      return;
    }

    /**
     * 2. Fetch only rows locked by THIS worker
     */
    const [rows]: any = await connection.query(
      `
        SELECT
            sp.id AS schedule_id,
            pd.id AS draft_id,
            pd.user_id,
            pd.topic,
            pd.content
        FROM scheduled_posts sp
        JOIN post_drafts pd ON pd.id = sp.draft_id
        WHERE sp.status = 'queued'
      `,
    );

    await connection.commit();

    /**
     * 3. Enqueue jobs (outside transaction)
     */
    for (const row of rows) {
      await publishQueue.add(
        "publish",
        {
          scheduleId: row.schedule_id,
          draftId: row.draft_id,
          userId: row.user_id,
        },
        {
          jobId: `publish_${row.schedule_id}`, // idempotent
          attempts: 5,
          backoff: {
            type: "exponential",
            delay: 30_000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        }
      );
    }

    console.log(
      `Enqueued ${rows.length} scheduled posts`
    );
  } catch (err) {
    await connection.rollback();
    console.error(`Scheduler error`, err);
  } finally {
    connection.release();
  }
}

export const cronPublishJob = new CronJob(
  "*/10 * * * * *",
  async () => {
    console.log('schedule cron hits');
    await schedulerWorker();

    console.log('automation cron hits');
    
    await postAutomationWorker();
  },
  null,
  false,
  "UTC"
);

