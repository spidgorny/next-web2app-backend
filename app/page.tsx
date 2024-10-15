"use client";

import {
  getKeyValue,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useSwrApi } from "@/app/use-swr-api";
import Link from "next/link";

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "status",
    label: "STATUS",
  },
];

export default function Home() {
  const { list } = useSwrApi("/api/project");
  return (
    <div>
      <h1 className="text-2xl mb-3">
        Projects ({list.isLoading ? <Spinner /> : list.data?.length})
      </h1>

      <Table aria-label="Example static collection table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={list.data ?? []} emptyContent={"No rows to display."}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>
                  <Link href={`/project/${item.id}`}>
                    {getKeyValue(item, columnKey)}
                  </Link>
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
