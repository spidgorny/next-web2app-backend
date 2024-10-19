import { useSwrApi } from "@/app/use-swr-api";
import urlcat from "urlcat";
import { id } from "postcss-selector-parser";
import { RenderTable } from "@/app/render-table";
import Link from "next/link";
import { Project } from "@/app/project";
import { Spinner } from "@nextui-org/react";
import humanizeDuration from "humanize-duration";
import { Job } from "bull";
import humanize from "humanize";

export function useJobList(project: string) {
  const { list } = useSwrApi(
    urlcat(`/api/project/${id}/queue`, { project }),
    undefined,
    {
      refreshInterval: 3000,
    },
  );
  return list;
}

type ProjectJob = Job<Project> & { status: "active" | "completed" | "failed" };

export function ShowProjectJobs(props: { project: Project }) {
  const list = useJobList(props.project.id);
  return (
    <RenderTable
      columns={[
        {
          key: "id",
          label: "ID",
        },
        {
          key: "name",
          label: "Name",
          render: (row: ProjectJob) => (
            <Link href={`/project/${props.project.id}/job/${row.id}`}>
              {row.name}
            </Link>
          ),
        },
        {
          key: "timestamp",
          label: "Timestamp",
          render: (row: ProjectJob) =>
            humanize.date("Y-m-d H:i:s", row.timestamp / 1000),
        },
        {
          key: "status",
          label: "Status",
          render: (row: ProjectJob) => {
            if (row.status === "active") {
              return <Spinner />;
            }
            return row.status;
          },
        },
        {
          key: "dur",
          label: "Dur",
          render: (row: ProjectJob) => {
            return humanizeDuration(
              (row?.finishedOn ?? 0) - (row?.processedOn ?? 0),
            );
          },
        },
      ]}
      data={list.data}
    />
  );
}
