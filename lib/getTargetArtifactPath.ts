import { Project } from "@/app/project";
import { Job } from "bull";
import path from "node:path";
import { invariant } from "@/lib/invariant";

const flutterProjectRoot = process.env.MOBILE_APP_FOLDER as string;
invariant(flutterProjectRoot);

export function getSourceArtifactPath(job: Job<Project>) {
  const fileMap = {
    aab: "build/app/outputs/bundle/release/app-release.aab",
    apk: "build/app/outputs/flutter-apk/app-release.apk",
    ipa: "build/ios/ipa/Runner.ipa",
  };
  const file = fileMap[job.data.target];
  return path.join(flutterProjectRoot, file);
}

export function getTargetArtifactPathServer(job: Job<Project>) {
  return `/tmp/web2app/project-${job.data.id}/job-${job.id}/app-release.aab`;
}

export function getTargetArtifactPath(job: Job<Project>) {
  const fileMap = {
    aab: "app-release.aab",
    apk: "app-release.apk",
    ipa: "Runner.ipa",
  };
  const file = fileMap[job.data.target];
  return path.join("/tmp", job.data.id, String(job.id), file);
}
