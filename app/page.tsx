"use client";

import { Button, Spinner } from "@nextui-org/react";
import { useSwrApi } from "@/app/use-swr-api";
import { RenderTable, TableColumnDef } from "@/app/render-table";
import Link from "next/link";

const columns = [
  {
    key: "name",
    label: "NAME",
    render: (row: Record<string, any>) => (
      <Link href={`/project/${row.id}`}>{row.name}</Link>
    ),
  },
  {
    key: "status",
    label: "STATUS",
  },
] as TableColumnDef[];

export type Project = {
  id: string;
  name: string;
  status: string;
};

export default function Home() {
  const { list } = useSwrApi("/api/project");
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl mb-3">
          Projects ({list.isLoading ? <Spinner /> : list.data?.length})
        </h1>
        <div>
          <Link href="/project/new">
            <Button>New Project</Button>
          </Link>
        </div>
      </div>
      <RenderTable<Project> columns={columns} data={list.data} />
    </div>
  );
}
