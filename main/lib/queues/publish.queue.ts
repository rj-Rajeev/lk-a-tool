import { Queue } from "bullmq";
import { redis } from "../redis";

export const publishQueue = new Queue("linkedin-publish", {
  connection: redis,
});