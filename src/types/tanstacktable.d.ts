import "@tanstack/react-table"
import type { LinkProps } from "next/link"

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Text alignment for header and cells */
    align?: "left" | "right" | "center"
    /** Hide the actions dropdown button in header */
    hideActionsButton?: boolean
    /** Custom className for cells */
    cellClassName?: string
    /** Custom className for header */
    headerClassName?: string
    /** Link props generator for cell content */
    link?: (row: TData) => LinkProps

    // ===== Pinning Configuration =====
    /** Default pin position when table initializes */
    pinned?: "left" | "right"
    /** If true, user cannot change the pin state (locked/fixed) */
    pinnedLocked?: boolean
    /** If false, this column cannot be pinned at all. Default: true */
    pinnable?: boolean
    /** Pin order priority. Higher number = closer to edge (left edge for left pins, right edge for right pins). Default: 0 */
    pinOrder?: number
  }
}
