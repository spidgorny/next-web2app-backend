import { redis } from "@/lib/json-store";

(async () => {
  const keys = await redis.keys("*");
  console.table(keys);
})();
