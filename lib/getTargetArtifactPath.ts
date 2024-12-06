import { Project } from "@/app/project";
import { Job } from "bull";

export function getTargetArtifactPath(job: Job<Project>) {
  return `/tmp/web2app/project-${job.data.id}/job-${job.id}/app-release.aab`;
}
