import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import "./publish/publish.worker";
import { publishCron } from "./cron/publish.cron";
import { publishQueue } from "@/lib/queues/publish.queue";

console.log("🚀 Worker booted");

setTimeout(async () => {
  console.log("🧪 Manual publish test");
  await publishQueue.add("publish", {
    runId: 999,
    draftId: 999,
    userId: 1,
  });
}, 3000);

publishCron.start();
