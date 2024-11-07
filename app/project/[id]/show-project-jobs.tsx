import { RenderTable } from "@/app/render-table";
import Link from "next/link";
import { Project } from "@/app/project";
import { Spinner } from "@nextui-org/react";
import humanizeDuration from "humanize-duration";
import humanize from "humanize";
import { ProjectJob, useJobList } from "@/app/project/[id]/project-job";

export function ShowProjectJobs(props: { project: Project }) {
  const list = useJobList(props.project.id);
  return (
    <RenderTable<ProjectJob>
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
              (row?.finishedOn ?? Date.now()) - (row?.processedOn ?? 0),
            );
          },
        },
      ]}
      data={list.data}
    />
  );
}
