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

export type TableColumnDef = {
  key: string;
  label: string;
  render?: (row: Record<string, any>) => ReactNode;
};

export function RenderTable<TRow>(props: {
  columns: TableColumnDef[];
  data: TRow[];
}) {
  // console.table(props.columns);
  let index = 0;
  return (
    <Table aria-label="Example static collection table">
      <TableHeader columns={props.columns}>
        {(column: TableColumnDef) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody items={props.data ?? []} emptyContent={"No rows to display."}>
        {(item: TRow) => (
          <TableRow key={item.id ?? index++}>
            {(columnKey: string) => {
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
