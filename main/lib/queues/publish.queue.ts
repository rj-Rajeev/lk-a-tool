import { Queue } from "bullmq";
import { redis } from "../redis";

export const PUBLISH_QUEUE_NAME = "linkedin-publish";

console.log("🟢 [PublishQueue] Redis options:", {
  host: redis.options.host,
  port: redis.options.port,
  db: redis.options.db,
});

export const publishQueue = new Queue("linkedin-publish", {
  connection: redis,
});