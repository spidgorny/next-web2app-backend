import { Job } from "bull";
import { Logger } from "@/lib/splunk";
import spawn from "nano-spawn";
import { queue } from "@/lib/queue";
import { Project } from "@/app/project";
import yaml from "yaml";
import * as fs from "node:fs";
import path from "node:path";
import { invariant } from "@/lib/invariant";
import mv from "mv";
import { promisify } from "node:util";
import {
  getSourceArtifactPath,
  getTargetArtifactPath,
} from "./getTargetArtifactPath";
import * as os from "node:os";

const mvAsync = promisify(mv);

const flutterProjectRoot = process.env.MOBILE_APP_FOLDER as string;
invariant(flutterProjectRoot);

(async () => {
  void queue.process(1, async (job: Job<Project>) => {
    try {
      Logger.info(`Processing job ${job.id}`);

      const steps = [
        generateConfigYamlFile,
        changeAppPackageName,
        renameProject,
        runBuild,
        storeBuildResult,
      ];

      for await (const step of steps) {
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

async function changeAppPackageName(job: Job<Project>) {
  const appId = job.data.name;
  await spawnAndLog(job, `dart run change_app_package_name:main ${appId}`);
}

async function renameProject(job: Job<Project>) {
  const appName = job.data.title;
  await spawnAndLog(
    job,
    `cmd /c C:\\Users\\depidsvy\\AppData\\Local\\Pub\\Cache\\bin\\rename.bat setAppName --value "${appName}" --targets ios,android,macos,windows,linux`,
  );
}

async function runBuild(job: Job<Project>) {
  const targetMap = {
    apk: "apk",
    aab: "bundle",
    ipa: "ipa",
  };
  const buildTarget = targetMap[job.data.target];
  await spawnAndLog(job, `flutter build ${buildTarget}`);
}

async function storeBuildResult(job: Job<Project>) {
  const androidFile = getSourceArtifactPath(job);
  const destination = getTargetArtifactPath(job);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  // @ts-ignore
  await mvAsync(androidFile, destination, { mkdirp: true });
  Logger.info("moved", androidFile, "to", destination);
}

async function spawnAndLog(job: Job<Project>, cmd: string) {
  if (os.platform() === "linux") {
    cmd = `script -c '${cmd}'`;
  }
  // if (os.platform() === "win32") {
  //   cmd = `cmd /c '${cmd}'`;
  // }
  Logger.info(flutterProjectRoot, cmd);
  for await (const line of spawn(cmd, {
    cwd: flutterProjectRoot,
    shell: true,
  })) {
    Logger.info(line);
    await job.log(line);
  }
}
