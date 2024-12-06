import { useSwrApi } from "@/app/use-swr-api";
import urlcat from "urlcat";
import { id } from "postcss-selector-parser";
import { Job } from "bull";
import { Project } from "@/app/project";

export function useJobList(project: string) {
  const { list } = useSwrApi<ProjectJob>(
    urlcat(`/api/project/${id}/queue`, { project }),
    undefined,
    {
      refreshInterval: 3000,
    },
  );
  return list;
}

export type ProjectJob = Job<Project> & {
  status: "active" | "completed" | "failed";
};
