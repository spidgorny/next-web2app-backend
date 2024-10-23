import { ReactNode } from "react";
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

export type TableColumnDef<T extends Record<string, any>> = {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
};

export function RenderTable<TRow extends Record<string, any>>(props: {
  columns: TableColumnDef<TRow>[];
  data: TRow[];
}) {
  // console.table(props.columns);
  let index = 0;
  return (
    <Table aria-label="Example static collection table">
      <TableHeader columns={props.columns}>
        {(column: TableColumnDef<TRow>) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody items={props.data ?? []} emptyContent={"No rows to display."}>
        {(item: TRow) => (
          <TableRow key={item.id ?? index++}>
            {(columnKey: string | number) => {
              let columnDef = props.columns.find((x) => x.key === columnKey);
              return (
                <TableCell key={columnKey}>
                  {typeof columnDef?.render === "function"
                    ? columnDef?.render(item)
                    : getKeyValue(item, columnKey)}
                </TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
