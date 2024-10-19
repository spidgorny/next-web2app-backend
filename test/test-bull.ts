import { Job } from "bull";
import { Logger } from "@/lib/splunk";
import { queue } from "@/lib/queue";

(async () => {
  const job = await queue.add({ x: 2, y: 3 });
  // job enqueued, job.id populated
  Logger.info("job added", job.toJSON());

  void queue.process(1, async (job: Job<{ x: number; y: number }>) => {
    Logger.info(`Processing job ${job.id}`);
    return job.data.x + job.data.y;
  });
})();
