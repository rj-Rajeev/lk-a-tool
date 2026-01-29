import { setGlobalDispatcher, Agent } from "undici";

setGlobalDispatcher(
  new Agent({
    connect: {
      family: 4, // force IPv4
    },
  })
);

// Start BullMQ workers


import "./publish/publish.worker";

// Start cron
import { publishCron } from "./cron/publish.cron";

console.log("🚀 Worker booted");

publishCron.start();
