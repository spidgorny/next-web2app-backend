import Redis from "ioredis";
import JSONStore from "redis-json";

export const redis = new Redis({
  host: "localhost",
  port: 6380,
});
export const store = new JSONStore(redis);
