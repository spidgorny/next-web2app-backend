import { Job } from "bull";
import { Logger } from "@/lib/splunk";
import spawn from "nano-spawn";
import { queue } from "@/lib/queue";
import { Project } from "@/app/project";
import yaml from "yaml";
import * as fs from "node:fs";
import path from "node:path";
import invariant from "tiny-invariant";
import mv from "mv";
import { promisify } from "node:util";
import { getTargetArtifactPath } from "./getTargetArtifactPath";

const mvAsync = promisify(mv);

const flutterProjectRoot = process.env.MOBILE_APP_FOLDER as string;
invariant(flutterProjectRoot);

(async () => {
  void queue.process(1, async (job: Job<Project>) => {
    try {
      Logger.info(`Processing job ${job.id}`);

      const steps = [generateConfigYamlFile, runBuild, storeBuildResult];

      for await (let step of steps) {
        Logger.info(step.name);
        await step(job);
        await job.progress(1);
      }

      Logger.info("processing job", job.id, "done");
    } catch (e) {
      Logger.error(e);
      invariant(e instanceof Error, "e must be an Error");
      await job.moveToFailed(e);
    }
  });

  Logger.info("ready to process");
})();

async function generateConfigYamlFile(job: Job<Project>) {
  const yamlText = yaml.stringify(job.data);
  console.log(yamlText);
  fs.writeFileSync(
    path.join(flutterProjectRoot, "assets/config.yaml"),
    yamlText,
  );
}

async function runBuild(job: Job<Project>) {
  const cmd = "script -c 'flutter build appbundle'";
  Logger.info(flutterProjectRoot, cmd);
  for await (const line of spawn(cmd, {
    cwd: flutterProjectRoot,
    shell: true,
  })) {
    Logger.info(line);
    await job.log(line);
  }
}

async function storeBuildResult(job: Job<Project>) {
  const androidFile = path.join(
    flutterProjectRoot,
    "build/app/outputs/bundle/release/app-release.aab",
  );
  const destination = getTargetArtifactPath(job);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  // @ts-ignore
  await mvAsync(androidFile, destination, { mkdirp: true });
  Logger.info("moved", androidFile, "to", destination);
}
