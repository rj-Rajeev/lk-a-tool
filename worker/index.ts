// Start BullMQ workers
import "./publish/publish.worker";

// Start cron
import { publishCron } from "./cron/publish.cron";

console.log("🚀 Worker booted");

publishCron.start();
