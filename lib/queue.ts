import Queue from "bull";
import { invariant } from "@/lib/invariant.ts";

invariant(process.env.REDIS, "REDIS env var missing");
const redisUrl = new URL(process.env.REDIS!);
export const queue = new Queue("build-android", {
  redis: {
    host: redisUrl.hostname,
    port: Number(redisUrl.port),
  },
});
