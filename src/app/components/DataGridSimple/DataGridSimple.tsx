import "./DataGridSimple.css";
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridValidRowModel,
} from "@mui/x-data-grid";

type BaseProps<R extends GridValidRowModel = any> = DataGridProps<R> &
  React.RefAttributes<HTMLDivElement>;

interface AdditionalColumnProps {
  multiline?: boolean;
  allowOverflow?: boolean;
}

export type GridSimpleColDef<R extends GridValidRowModel = any> =
  (GridColDef<R> & AdditionalColumnProps)[];

interface DataGridSimpleProps<R extends GridValidRowModel = any>
  extends Omit<BaseProps<R>, "columns"> {
  columns: GridSimpleColDef;
}

export function DataGridSimple<R extends GridValidRowModel = any>(
  props: DataGridSimpleProps<R>
) {
  return (
    <DataGrid
      columns={props.columns.map((x) => ({
        ...x,
        sortable: false,
        cellClassName:
          x.multiline && !x.allowOverflow
            ? "multiline"
            : !x.multiline && x.allowOverflow
            ? "allow-overflow"
            : x.multiline && x.allowOverflow
            ? "multiline-allow-overflow"
            : "",
      }))}
      rows={props.rows.map(
        (x, index) =>
          Object.fromEntries(
            Object.keys(x)
              .map((key) => [
                key,
                props.columns.find((col) => col.field === key)?.multiline
                  ? x[key] + "\n"
                  : x[key],
              ])
              .concat([["id", index]])
          ) as R
      )}
      hideFooter
      autoHeight
      getRowHeight={() => "auto"}
      disableColumnFilter
      disableColumnMenu
      disableColumnSelector
      style={props.style}
    />
  );
}
