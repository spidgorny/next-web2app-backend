"use client";;
import { use } from "react";

import { useSwrApi } from "@/app/use-swr-api";
import { Job } from "bull";
import type { Project } from "@/app/project";
import { RenderTable } from "@/app/render-table";
import stripAnsi from "strip-ansi";
import Link from "next/link";

export interface JobWithLogs extends Job<Project> {
  logs: {
    count: number;
    logs: string[];
  };
}

export default function Project(
  props: {
    params: Promise<{ id: string; jobId: string }>;
  }
) {
  const params = use(props.params);
  const { item } = useSwrApi<JobWithLogs>(
    `/api/project/${params.id}/queue/job/`,
    params.jobId,
  );
  let { data: job, logs } = item.data ?? {};
  let logsTable = (logs?.logs?.map((x) => ({
    logLine: stripAnsi(x),
  })) ?? []) as { logLine: string }[];
  return (
    <div>
      <div className="text-2xl my-3">
        Project Id: <Link href={`/project/${params.id}`}>{params.id}</Link>
      </div>
      <div className="text-xl my-3">Job Id: {params.jobId}</div>
      <pre className="my-3">data: {JSON.stringify(job, null, 2)}</pre>
      {logs && (
        <RenderTable
          columns={[{ key: "logLine", label: "" }]}
          data={logsTable}
        />
      )}
    </div>
  );
}
