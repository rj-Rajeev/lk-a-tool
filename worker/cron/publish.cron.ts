import { CronJob } from "cron";
import { postAutomationWorker } from "../automation/draft.worker";
import { automationPublishSelector } from "../automation/publish.selector";

export const publishCron = new CronJob(
  "*/10 * * * * *",
  async () => {
    console.log("⏰ Cron tick at", new Date());

    await postAutomationWorker();       // create drafts
    await automationPublishSelector();  // enqueue approved drafts
  },
  null,
  false,
  "UTC"
);
