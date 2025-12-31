"use client"

import { cn } from "@/lib/utils"
import { Column, flexRender, Header } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, Pin } from "lucide-react"
import React from "react"
import { Button } from "../button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu"
import { useDataTable } from "./data-table-context"
import { useHeaderRefs } from "./header-ref-context"
import { TableHead } from "./table"

interface DataTableHeaderCellProps<TData, TValue> {
  header: Header<TData, TValue>
  width?: number
  isRegisterHeaderRef?: boolean
}

// Sub-component for Sorting
function DataTableColumnSort<TData, TValue>({
  column,
}: {
  column: Column<TData, TValue>
}) {
  if (!column.getCanSort()) return null

  const sortState = column.getIsSorted()
  const currentSort =
    sortState === "asc" ? "asc" : sortState === "desc" ? "desc" : "no-sort"

  const handleSortChange = (value: string) => {
    if (value === "asc") {
      column.toggleSorting(false)
    } else if (value === "desc") {
      column.toggleSorting(true)
    } else {
      column.clearSorting()
    }
  }

  return (
    <>
      <DropdownMenuLabel>Sắp xếp</DropdownMenuLabel>
      <DropdownMenuRadioGroup
        value={currentSort}
        onValueChange={handleSortChange}
      >
        <DropdownMenuRadioItem value="asc">
          <div className="flex flex-1 items-center gap-1.5">
            <ArrowUp className="text-muted-foreground" />
            Tăng dần
          </div>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="desc">
          <div className="flex flex-1 items-center gap-1.5">
            <ArrowDown className="text-muted-foreground" />
            Giảm dần
          </div>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="no-sort">
          <div className="flex flex-1 items-center gap-1.5">
            <ArrowUpDown className="text-muted-foreground" />
            Bỏ sắp xếp
          </div>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </>
  )
}

// Sub-component for Pinning
function DataTableColumnPinning<TData, TValue>({
  column,
}: {
  column: Column<TData, TValue>
}) {
  const { table, setColumnPinning } = useDataTable()
  const meta = column.columnDef.meta
  const pinnable = meta?.pinnable !== false
  const pinnedLocked = meta?.pinnedLocked === true

  if (!pinnable || pinnedLocked) return null

  const isPinned = column.getIsPinned()
  const currentPin =
    isPinned === "left"
      ? "pin-left"
      : isPinned === "right"
        ? "pin-right"
        : "unpin"

  const handlePinChange = (value: string) => {
    // Don't allow pin changes if locked
    if (meta?.pinnedLocked) return

    const columnId = column.id

    setColumnPinning((prev) => {
      // Helper to check if a column is locked (system column)
      const isColumnLocked = (id: string) => {
        const col = table.getColumn(id)
        return col?.columnDef.meta?.pinnedLocked === true
      }

      const getColumnPinOrder = (id: string) => {
        const col = table.getColumn(id)
        return col?.columnDef.meta?.pinOrder ?? 0
      }

      // If unpinning, just remove current column
      if (value === "unpin") {
        return {
          left: prev.left?.filter((id) => id !== columnId) ?? [],
          right: prev.right?.filter((id) => id !== columnId) ?? [],
        }
      }

      // If pinning new column:
      // 1. Keep only locked (system) columns
      const newLeft = prev.left?.filter((id) => isColumnLocked(id)) ?? []
      const newRight = prev.right?.filter((id) => isColumnLocked(id)) ?? []

      // 2. Add new column to target side
      const targetSide = value === "pin-left" ? "left" : "right"
      if (targetSide === "left") {
        newLeft.push(columnId)
      } else {
        newRight.push(columnId)
      }

      // 3. Sort to ensure system columns stay at edges
      // Left pins: Add and sort descending (Higher order = Closer to left edge)
      newLeft.sort((a, b) => getColumnPinOrder(b) - getColumnPinOrder(a))
      // Right pins: Add and sort ascending (Higher order = Closer to right edge)
      newRight.sort((a, b) => getColumnPinOrder(a) - getColumnPinOrder(b))

      return { left: newLeft, right: newRight }
    })
  }

  return (
    <>
      <DropdownMenuLabel>Ghim cột</DropdownMenuLabel>
      <DropdownMenuRadioGroup
        value={currentPin}
        onValueChange={handlePinChange}
      >
        <DropdownMenuRadioItem value="pin-left">
          <div className="flex flex-1 items-center gap-1.5">
            <Pin className="text-muted-foreground -rotate-45" />
            Ghim trái
          </div>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="pin-right">
          <div className="flex flex-1 items-center gap-1.5">
            <Pin className="text-muted-foreground rotate-45" />
            Ghim phải
          </div>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="unpin">
          <div className="flex flex-1 items-center gap-1.5">
            <Pin className="text-muted-foreground" />
            Bỏ ghim
          </div>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </>
  )
}

export function DataTableHeaderCell<TData, TValue>({
  header,
  width,
  isRegisterHeaderRef = true,
}: DataTableHeaderCellProps<TData, TValue>) {
  const ref = React.useRef<HTMLTableCellElement>(null)
  const { registerHeaderRef, unregisterHeaderRef } = useHeaderRefs()
  const [open, setOpen] = React.useState(false)

  const triggerContent = flexRender(
    header.column.columnDef.header,
    header.getContext()
  )

  // Use derived state for rendering logic
  const showSort = header.column.getCanSort()
  const meta = header.column.columnDef.meta
  const showPin = meta?.pinnable !== false && meta?.pinnedLocked !== true

  const isPinned = header.column.getIsPinned?.()
  const isLastPinned = header.column.getIsLastColumn("left")
  const isFirstPinnedRight = header.column.getIsFirstColumn("right")

  const pinnedClasses = isPinned
    ? isPinned === "left"
      ? "sticky z-20"
      : "sticky z-20"
    : ""

  const sortState = header.column.getIsSorted()

  React.useEffect(() => {
    if (isRegisterHeaderRef) {
      if (ref.current) {
        registerHeaderRef(header.column.id, ref.current)
      }
      return () => {
        unregisterHeaderRef(header.column.id)
      }
    }
  }, [
    header.column.id,
    registerHeaderRef,
    unregisterHeaderRef,
    isRegisterHeaderRef,
  ])

  return (
    <TableHead
      key={header.id}
      ref={ref}
      className={cn(
        "h-12",
        header.column.columnDef.meta?.align === "right" && "text-right",
        header.column.columnDef.meta?.align === "center" && "text-center",
        "whitespace-nowrap",
        pinnedClasses,
        header.column.columnDef.meta?.headerClassName
      )}
      style={{
        width:
          width ||
          (isNaN(header.getSize()) || header.getSize() === 0
            ? "auto"
            : header.getSize() - 16),
        left:
          isPinned === "left"
            ? `${header.column.getStart("left")}px`
            : undefined,
        right:
          isPinned === "right"
            ? `${header.column.getAfter("right")}px`
            : undefined,
        minWidth: header.column.columnDef.minSize,
      }}
    >
      <div
        className={cn(
          "flex items-center",
          header.column.columnDef.meta?.align === "right" && "justify-end",
          header.column.columnDef.meta?.align === "center" && "justify-center",
          pinnedClasses
        )}
      >
        {header.isPlaceholder || triggerContent === null ? null : header.column
            .columnDef.meta?.hideActionsButton ? (
          triggerContent
        ) : (
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size={"sm"}
                className={cn(
                  "txt-body-default-medium my-2 -ml-2 gap-1 px-2 text-left font-[Inter] normal-case",
                  header.column.columnDef.meta?.align === "right" && "ml-auto",
                  header.column.columnDef.meta?.align === "center" && "mx-auto",
                  pinnedClasses
                )}
              >
                <div className="flex items-center gap-2.5">
                  {header.column.getIsPinned() && <Pin />}
                  {triggerContent}
                  {header.column.getCanSort() && sortState && (
                    <span className="text-muted-foreground">
                      {sortState === "asc" && <ArrowUp />}
                      {sortState === "desc" && <ArrowDown />}
                    </span>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-50" align="start">
              {showSort && <DataTableColumnSort column={header.column} />}
              {showSort && showPin && <DropdownMenuSeparator />}
              {showPin && <DataTableColumnPinning column={header.column} />}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {isPinned &&
        (isPinned === "left" && isLastPinned ? (
          <div className="column-left-shadow" />
        ) : (
          isFirstPinnedRight &&
          isPinned === "right" && <div className="column-right-shadow" />
        ))}
      {isPinned && <div className="column-pin-backdrop" />}
    </TableHead>
  )
}
