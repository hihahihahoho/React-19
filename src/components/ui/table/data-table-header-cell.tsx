"use client"

import { cn } from "@/lib/utils"
import { flexRender, Header } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, Pin } from "lucide-react"
import React from "react"
import { Button } from "../button"
import { SelectCommand } from "../select/select-command"
import { SelectGroup, SelectItems } from "../select/select-interface"
import { SelectPopover } from "../select/select-popover"
import { useDataTable } from "./data-table-context"
import { useHeaderRefs } from "./header-ref-context"
import { TableHead } from "./table"

interface DataTableHeaderCellProps<TData, TValue> {
  header: Header<TData, TValue>
  isPin?: boolean
  width?: number
  isRegisterHeaderRef?: boolean
}

const toolbarOptions: SelectGroup[] = [
  {
    heading: "Sắp xếp",
    value: "sort-group",
    options: [
      {
        value: "asc",
        label: (
          <div className="flex flex-1 items-center gap-1.5 [&_svg]:size-4">
            <ArrowUp />
            Tăng dần
          </div>
        ),
      },
      {
        value: "desc",
        label: (
          <div className="flex flex-1 items-center gap-1.5 [&_svg]:size-4">
            <ArrowDown />
            Giảm dần
          </div>
        ),
      },
      {
        value: "no-sort",
        label: (
          <div className="flex flex-1 items-center gap-1.5 [&_svg]:size-4">
            <ArrowUpDown />
            Bỏ sắp xếp
          </div>
        ),
      },
    ],
  },
  {
    heading: "Ghim cột",
    value: "pin-group",
    options: [
      {
        value: "pin-left",
        label: (
          <div className="flex flex-1 items-center gap-1.5 [&_svg]:size-4">
            <Pin className="-rotate-45" />
            Ghim trái
          </div>
        ),
      },
      {
        value: "pin-right",
        label: (
          <div className="flex flex-1 items-center gap-1.5 [&_svg]:size-4">
            <Pin className="rotate-45" />
            Ghim phải
          </div>
        ),
      },
      {
        value: "unpin",
        label: (
          <div className="flex flex-1 items-center gap-1.5 [&_svg]:size-4">
            <Pin className="text-muted-foreground" />
            Bỏ ghim
          </div>
        ),
      },
    ],
  },
]

export function DataTableHeaderCell<TData, TValue>({
  header,
  isPin = false,
  width,
  isRegisterHeaderRef = true,
}: DataTableHeaderCellProps<TData, TValue>) {
  const { table, setColumnPinning } = useDataTable()
  const sortState = header.column.getIsSorted()
  const ref = React.useRef<HTMLTableCellElement>(null)
  const initialSelected = ["no-sort"]
  if (isPin) initialSelected.push("pin")
  const { registerHeaderRef, unregisterHeaderRef } = useHeaderRefs()

  const [selected, setSelected] = React.useState<string[]>(initialSelected)
  const [open, setOpen] = React.useState(false)

  const triggerContent = flexRender(
    header.column.columnDef.header,
    header.getContext()
  )

  const handleOnSelect = (newSelected: SelectItems) => {
    const selected = newSelected.value

    // Handle sorting actions
    if (["asc", "desc", "no-sort"].includes(selected)) {
      if (selected === "asc") {
        header.column.toggleSorting(false)
      } else if (selected === "desc") {
        header.column.toggleSorting(true)
      } else {
        header.column.clearSorting()
      }

      // Update the selected state for sorting without affecting pinning
      setSelected((prev) => {
        const withoutSort = prev.filter(
          (val) => !["asc", "desc", "no-sort"].includes(val)
        )
        return [...withoutSort, selected]
      })
    }

    // Handle pinning actions with ordering support
    if (["pin-left", "pin-right", "unpin"].includes(selected)) {
      const meta = header.column.columnDef.meta
      // Don't allow pin changes if locked
      if (meta?.pinnedLocked) return

      const columnId = header.column.id

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
        if (selected === "unpin") {
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
        const targetSide = selected === "pin-left" ? "left" : "right"
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
  }

  const filteredOptions = React.useMemo(() => {
    const meta = header.column.columnDef.meta
    let options = [...toolbarOptions]

    // Filter out sort group if column can't sort
    if (!header.column.getCanSort()) {
      options = options.filter((group) => group.value !== "sort-group")
    }

    // Filter out pin group if column is not pinnable or is locked
    const pinnable = meta?.pinnable !== false
    const pinnedLocked = meta?.pinnedLocked === true
    if (!pinnable || pinnedLocked) {
      options = options.filter((group) => group.value !== "pin-group")
    }

    return options
  }, [header.column])

  // Determine pin classes based on pinned state
  const isPinned = header.column.getIsPinned?.()
  const isLastPinned = header.column.getIsLastColumn("left")
  const isFirstPinnedRight = header.column.getIsFirstColumn("right")
  const pinnedClasses = isPinned
    ? isPinned === "left"
      ? "sticky z-20"
      : "sticky z-20"
    : ""
  // Update selected state when pin state changes
  React.useEffect(() => {
    setSelected((prev) => {
      const withoutPin = prev.filter(
        (val) => !["pin-left", "pin-right", "unpin"].includes(val)
      )
      if (isPinned === "left") {
        return [...withoutPin, "pin-left"]
      } else if (isPinned === "right") {
        return [...withoutPin, "pin-right"]
      } else {
        return [...withoutPin, "unpin"]
      }
    })
  }, [isPinned])

  React.useEffect(() => {
    setSelected((prev) => {
      const withoutSort = prev.filter(
        (val) => !["asc", "desc", "no-sort"].includes(val)
      )

      if (sortState === "asc") {
        return [...withoutSort, "asc"]
      } else if (sortState === "desc") {
        return [...withoutSort, "desc"]
      } else {
        return [...withoutSort, "no-sort"]
      }
    })
  }, [sortState])

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
          header.column.columnDef.meta?.align === "right" && "justify-right",
          header.column.columnDef.meta?.align === "center" && "justify-center",
          pinnedClasses
        )}
      >
        {header.isPlaceholder || triggerContent === null ? null : header.column
            .columnDef.meta?.hideActionsButton ? (
          triggerContent
        ) : (
          <SelectPopover
            open={open}
            setOpen={setOpen}
            triggerContent={
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
            }
            label={triggerContent}
          >
            <SelectCommand
              items={filteredOptions}
              selected={selected}
              onSelect={handleOnSelect}
            />
          </SelectPopover>
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
