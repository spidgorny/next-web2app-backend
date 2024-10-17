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

export function RenderTable(props: { columns: TableColumnDef[]; data: any[] }) {
  return (
    <Table aria-label="Example static collection table">
      <TableHeader columns={props.columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={props.data ?? []} emptyContent={"No rows to display."}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => {
              let columnDef = props.columns.find((x) => x.key === columnKey);
              return (
                <TableCell>
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
