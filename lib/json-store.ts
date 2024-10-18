import Redis from "ioredis";
import JSONStore from "redis-json";

export const redis = new Redis();
export const store = new JSONStore(redis);
