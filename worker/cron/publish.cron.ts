import { CronJob } from "cron";
import { postAutomationWorker } from "../automation/draft.worker";
import { automationPublishSelector } from "../automation/publish.selector";

export const publishCron = new CronJob(
  "*/10 * * * * *",
  async () => {
    try {
      await postAutomationWorker();       // draft phase
    } catch (err) {
      // draft worker already persisted error
      console.error("Draft automation error:", err);
    }

    try {
      await automationPublishSelector();  // enqueue phase
    } catch (err) {
      console.error("Publish selector error:", err);
    }
  },
  null,
  false,
  "UTC"
);
