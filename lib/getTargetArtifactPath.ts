import path from "node:path";
import { Project } from "@/app/project";
import { Job } from "bull";
import invariant from "tiny-invariant";

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

export function getTargetArtifactPath(job: Job<Project>) {
  const fileMap = {
    aab: "app-release.aab",
    apk: "app-release.apk",
    ipa: "Runner.ipa",
  };
  const file = fileMap[job.data.target];
  return path.join("/tmp", job.data.id, String(job.id), file);
}
