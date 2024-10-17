"use client";

import { useSwrApi } from "@/app/use-swr-api";
import { id } from "postcss-selector-parser";
import urlcat from "urlcat";
import { RenderTable } from "@/app/render-table";
import Link from "next/link";

export default function Project({ params }: { params: { id: string } }) {
  const { item } = useSwrApi(`/api/project`, params.id);
  return (
    <div>
      <div>ID: {params.id}</div>
      <pre>data: {JSON.stringify(item.data, null, 2)}</pre>
      {/*<form>*/}
      {/*  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">*/}
      {/*    <Input type="email" label="Email" />*/}
      {/*    <Input type="email" label="Email" placeholder="Enter your email" />*/}
      {/*  </div>*/}
      {/*</form>*/}
      {item.data && <ShowProjectJobs project={item.data} />}
    </div>
  );
}

export function ShowProjectJobs(props: { project: { id: string } }) {
  const { list } = useSwrApi(
    urlcat(`/api/project/${id}/queue`, { project: props.project.id }),
  );
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
