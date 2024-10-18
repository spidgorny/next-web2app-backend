import { useSwrApi } from "@/app/use-swr-api";
import urlcat from "urlcat";
import { id } from "postcss-selector-parser";
import { RenderTable } from "@/app/render-table";
import Link from "next/link";
import { Project } from "@/app/project";

export function useJobList(project: string) {
  const { list } = useSwrApi(urlcat(`/api/project/${id}/queue`, { project }));
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
        },
      ]}
      data={list.data}
    />
  );
}
