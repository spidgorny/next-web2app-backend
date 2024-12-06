import Redis from "ioredis";
import JSONStore from "redis-json";
import { invariant } from "@/lib/invariant.ts";

invariant(process.env.REDIS, "REDIS env var missing");
const redisUrl = new URL(process.env.REDIS!);
export const redis = new Redis({
  host: redisUrl.hostname,
  port: Number(redisUrl.port),
});
export const store = new JSONStore(redis);
