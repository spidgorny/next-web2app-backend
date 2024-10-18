"use client";
import Link from "next/link";
import { RenderTable, TableColumnDef } from "@/app/render-table";
import { useSwrApi } from "@/app/use-swr-api";
import { Button, Spinner } from "@nextui-org/react";
import { Project } from "@/app/page";

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

export function ListProjects() {
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
