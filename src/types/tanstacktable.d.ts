import "@tanstack/react-table"

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: "left" | "right" | center
    hideActionsButton?: boolean
    cellClassName?: string
    headerClassName?: string
    hideActionsButton?: boolean,
    link?: (row: TData) => LinkProps
  }
}
