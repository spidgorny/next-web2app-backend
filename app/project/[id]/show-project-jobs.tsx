import { useSwrApi } from "@/app/use-swr-api";
import urlcat from "urlcat";
import { id } from "postcss-selector-parser";
import { RenderTable } from "@/app/render-table";
import Link from "next/link";
import { Project } from "@/app/project";
import { Spinner } from "@nextui-org/react";
import humanizeDuration from "humanize-duration";

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
          render: (row: Record<string, any>) => (
            <Link href={`/project/${props.project.id}/job/${row.id}`}>
              {row.name}
            </Link>
          ),
        },
        {
          key: "timestamp",
          label: "Timestamp",
        },
        {
          key: "status",
          label: "Status",
          render: (row: Record<string, any>) => {
            if (row.status === "active") {
              return <Spinner />;
            }
            return row.status;
          },
        },
        {
          key: "dur",
          label: "Dur",
          render: (row: Record<string, any>) => {
            return humanizeDuration(row.finishedOn - row.processedOn);
          },
        },
      ]}
      data={list.data}
    />
  );
}
