import { cn } from "@/lib/utils";
import { Cell, flexRender } from "@tanstack/react-table";
import { TableCell } from "./table";

interface DataTableCellProps<TData, TValue> {
  cell: Cell<TData, TValue>;
}

export function DataTableCell<TData, TValue>({
  cell,
}: DataTableCellProps<TData, TValue>) {
  const pinnedPosition = cell.column.getIsPinned();
  const isPinnedLeft = pinnedPosition === "left";
  const isPinnedRight = pinnedPosition === "right";
  const isLastPinned = cell.column.getIsLastColumn("left");
  const isFirstPinnedRight = cell.column.getIsFirstColumn("right");
  return (
    <TableCell
      style={{
        textAlign: cell.column.columnDef.meta?.align,
        left: isPinnedLeft ? `${cell.column.getStart("left")}px` : undefined,
        right: isPinnedRight ? `${cell.column.getAfter("right")}px` : undefined,
      }}
      className={cn(
        pinnedPosition && isPinnedLeft && "sticky left-0 z-20",
        pinnedPosition && isPinnedRight && "sticky right-0 z-20",
        cell.column.columnDef.meta?.cellClassName
      )}
    >
      {pinnedPosition && (
        <>
          <div className="column-pin-backdrop" />
          {isPinnedLeft && isLastPinned && (
            <div className="column-left-shadow" />
          )}
          {isPinnedRight && isFirstPinnedRight && (
            <div className="column-right-shadow" />
          )}
        </>
      )}
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
}
