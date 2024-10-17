"use client";

import { useSwrApi } from "@/app/use-swr-api";

export default function Project({
  params,
}: {
  params: { id: string; jobId: string };
}) {
  const { item } = useSwrApi(
    `/api/project/${params.id}/queue/job/`,
    params.jobId,
  );
  return (
    <div>
      <div>ID: {params.jobId}</div>
      <pre>data: {JSON.stringify(item.data, null, 2)}</pre>
    </div>
  );
}
