import { Job } from "bull";
import { Logger } from "@/lib/splunk";
import spawn from "nano-spawn";
import { queue } from "@/lib/queue";

(async () => {
  void queue.process(1, async (job: Job<{ title: string }>) => {
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
    Logger.info("processing job", job.id, "done");
  });

  Logger.info("ready to process");
})();
