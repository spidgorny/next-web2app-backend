import Queue, { Job } from "bee-queue";
import { Logger } from "@/lib/splunk";

(async () => {
  const addQueue = new Queue("addition");

  const job = addQueue.createJob({ x: 2, y: 3 });
  await job.timeout(3000).retries(2).save();
  // job enqueued, job.id populated
  Logger.info("job added", {
    id: job.id,
    progress: job.progress,
    data: job.data,
    options: job.options,
    status: job.status,
  });

  addQueue.process(async (job: Job<{ x: number; y: number }>) => {
    Logger.info(`Processing job ${job.id}`);
    return job.data.x + job.data.y;
  });
})();
