import { Queue } from "bullmq";
import { redis } from "../redis";

export const PUBLISH_QUEUE_NAME = "linkedin-publish";

export const publishQueue = new Queue("linkedin-publish", {
  connection: redis,
});