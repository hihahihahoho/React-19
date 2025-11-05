import React from "react"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { GripVertical } from "lucide-react"
import { Button } from "../button"
import { ScrollAreaTable } from "../scroll-area"
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "../sortable"
import { DataTableCell } from "./data-table-cell"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./table"

// Cell Component for drag handle
const RowDragHandleCell = () => {
  return (
    <SortableItemHandle asChild>
      <Button variant="ghost" size="sm" className="size-8 p-0">
        <GripVertical className="size-4" />
      </Button>
    </SortableItemHandle>
  )
}

// Table Component
function SortableTable<TData extends { uid: string }>({
  columns,
  data,
  onDataChange,
}: {
  columns: ColumnDef<TData>[]
  data: TData[]
  onDataChange?: (data: TData[]) => void
}) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.uid,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  const [scrollBarContainer, setScrollBarContainer] =
    React.useState<HTMLDivElement | null>(null)

  const sortableProps = {
    value: data,
    onValueChange: onDataChange,
    getItemValue: (item: TData) => item.uid,
  } as const

  return (
    // @ts-expect-error - Sortable type inference issue with conditional types
    <Sortable<TData> {...sortableProps}>
      <div className="overflow-hidden rounded-xl border">
        <ScrollAreaTable
          type="always"
          scrollBarPortalContainer={scrollBarContainer}
          className="w-full"
        >
          <Table
            style={{ minWidth: table.getVisibleFlatColumns().length * 120 }}
            className="w-full table-auto"
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      style={{
                        width:
                          isNaN(header.getSize()) || header.getSize() === 0
                            ? "auto"
                            : header.getSize() - 16,
                        minWidth: header.column.columnDef.minSize,
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <SortableContent asChild>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <SortableItem key={row.id} value={row.original.uid} asChild>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => (
                        <DataTableCell key={cell.id} cell={cell} />
                      ))}
                    </TableRow>
                  </SortableItem>
                ))}
              </TableBody>
            </SortableContent>
          </Table>
        </ScrollAreaTable>
        <div
          className={cn(
            "bg-background/80 sticky bottom-0 z-30 -mt-px rounded-b-2xl backdrop-blur-sm",
            table.getRowCount() <= 10 &&
              "opacity-0 has-data-[state=visible]:opacity-100"
          )}
        >
          <div ref={setScrollBarContainer} className="border-b-0" />
        </div>
      </div>
      <SortableOverlay>
        <div className="bg-primary/2 size-full rounded-2xl" />
      </SortableOverlay>
    </Sortable>
  )
}

export { RowDragHandleCell, SortableTable }
