"use client";
import { use, useState } from "react";

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

export default function Project(props: {
  params: Promise<{ id: string; jobId: string }>;
}) {
  const params = use(props.params);
  const { item } = useSwrApi<JobWithLogs>(
    `/api/project/${params.id}/queue/job/`,
    params.jobId,
  );
  let { data: job, logs } = item.data ?? { data: null };
  let logsTable = (logs?.logs?.map((x) => ({
    logLine: stripAnsi(x),
  })) ?? []) as { logLine: string }[];

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const response = await fetch(
        `/api/project/${params.id}/job/${params.jobId}/download`,
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `artifact-${params.jobId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      // Handle error (maybe show a toast notification)
    } finally {
      setIsDownloading(false);
    }
  };

  const isComplete = (job: Job | null) => {
    return Boolean(job?.finishedOn);
  };

  return (
    <div>
      <div className="text-2xl my-3">
        Project Id: <Link href={`/project/${params.id}`}>{params.id}</Link>
      </div>
      <div className="text-xl my-3">Job Id: {params.jobId}</div>
      <pre className="my-3">data: {JSON.stringify(job, null, 2)}</pre>

      {isComplete(job) && (
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isDownloading ? "Downloading..." : "Download Artifact"}
        </button>
      )}

      {logs && (
        <RenderTable
          columns={[{ key: "logLine", label: "" }]}
          data={logsTable}
        />
      )}
    </div>
  );
}
