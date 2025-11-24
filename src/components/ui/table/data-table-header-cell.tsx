import { cn } from "@/lib/utils"
import { ColumnPinningState, flexRender, Header } from "@tanstack/react-table"
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
  setColumnPinning?: React.Dispatch<React.SetStateAction<ColumnPinningState>>
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
]

export function DataTableHeaderCell<TData, TValue>({
  header,
  isPin = false,
  width,
  isRegisterHeaderRef = true,
}: DataTableHeaderCellProps<TData, TValue>) {
  const { setColumnPinning, fixedPinLeft, fixedPinRight } = useDataTable()
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

    // Pinning logic
    if (selected === "pin") {
      if (selected.includes("pin")) {
        // Unpin
        setColumnPinning?.(() => ({
          left: [...fixedPinLeft],
          right: [...fixedPinRight],
        }))
      } else {
        // Pin this column to the left
        setColumnPinning?.(() => ({
          left: [...fixedPinLeft, header.column.id],
          right: [...fixedPinRight],
        }))
      }
    }
  }

  const filteredOptions = React.useMemo(() => {
    if (!header.column.getCanSort()) {
      return toolbarOptions.filter((group) => group.value !== "sort-group")
    }
    return toolbarOptions
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
  React.useEffect(() => {
    if (isPinned) {
      setSelected((prev) => [...prev.filter((v) => v !== "pin"), "pin"])
    } else {
      setSelected((prev) => prev.filter((v) => v !== "pin"))
    }
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
                  {header.column.getCanSort() && (
                    <span className="text-muted-foreground">
                      {sortState === "asc" && <ArrowUp />}
                      {sortState === "desc" && <ArrowDown />}
                      {sortState === false && <></>}
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
