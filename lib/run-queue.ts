import Queue, { Job } from "bee-queue";
import { Logger } from "@/lib/splunk";
import spawn from "nano-spawn";

(async () => {
  const addQueue = new Queue("build-android");

  addQueue.process(1, async (job: Job<{ title: string }>) => {
    Logger.info(`Processing job ${job.id}`);
    const cwd = "/home/slawa/dev/flutter_site_container";
    const cmd = "flutter build appbundle";
    Logger.info(cwd, cmd);
    for await (const line of spawn(cmd.split(" ")[0], cmd.split(" ").slice(1), {
      cwd,
    })) {
      console.log(line);
      Logger.info(line);
    }
  });

  Logger.info("ready to process");
})();
