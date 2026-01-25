import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

// Global safety net (production-safe)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1); // crash fast, let supervisor restart
});

// Start BullMQ workers
import "./publish/publish.worker";

// Start cron
import { publishCron } from "./cron/publish.cron";

console.log("🚀 Worker booted");

publishCron.start();
