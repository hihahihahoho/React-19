"use client"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import React, { useRef } from "react"
import { Button } from "../button"
import { EmptyState } from "../empty-state"
import { ScrollAreaTable } from "../scroll-area"
import { Skeleton } from "../skeleton"
import { DataTableCell } from "./data-table-cell"
import { useDataTable } from "./data-table-context"
import { FloatingHeader } from "./data-table-floating-header"
import { DataTableHeaderCell } from "./data-table-header-cell"
import { DataTablePagination } from "./data-table-pagination"
import { HeaderRefsProvider } from "./header-ref-context"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./table"

const tableVariants = cva("", {
  variants: {
    variant: {
      default: "border-b",
      rounded: "overflow-hidden rounded-t-xl border",
    },
  },
  defaultVariants: {
    variant: "rounded",
  },
})

interface DataTableProps {
  variant?: "default" | "rounded"
  fixedHeaderOffset?: string
  emptyState?: React.ReactNode
  showPagination?: boolean
  autoWidthTable?: boolean
  tableWrapperClassName?: string
}

export function DataTable({
  variant,
  fixedHeaderOffset,
  emptyState,
  showPagination = true,
  autoWidthTable = false,
  tableWrapperClassName,
}: DataTableProps) {
  const { table, totalNumber, isPending } = useDataTable()
  const tableRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLTableSectionElement>(null)
  const mainScrollRef = useRef<HTMLDivElement>(null)
  const [scrollBarContainer, setScrollBarContainer] =
    React.useState<HTMLDivElement | null>(null)

  // Don't show empty state during initial loading (server-side)
  if (table.getRowCount() <= 0 && !isPending)
    return (
      emptyState || (
        <EmptyState className="rounded">
          <Button>Tải lại</Button>
        </EmptyState>
      )
    )

  return (
    <HeaderRefsProvider>
      <div ref={tableRef}>
        <FloatingHeader
          mainScrollRef={mainScrollRef}
          tableRef={tableRef}
          headerRef={headerRef}
          fixedHeaderOffset={fixedHeaderOffset}
          autoWidthTable={autoWidthTable}
        />
        <div
          className={cn(
            tableVariants({ variant }),
            (totalNumber <= 10 || !showPagination) && "rounded-b-xl",
            autoWidthTable && "inline-flex max-w-full",
            tableWrapperClassName
          )}
        >
          {/* {variant === "rounded" && (
            <div className="pointer-events-none absolute top-0 left-0 z-50 h-full w-full rounded-3xl border"></div>
          )} */}
          <ScrollAreaTable
            type="always"
            scrollBarPortalContainer={scrollBarContainer}
            viewportRef={mainScrollRef}
            className="w-full"
          >
            <Table
              style={{
                minWidth: !autoWidthTable
                  ? table.getVisibleFlatColumns().length * 120
                  : undefined,
              }}
            >
              <TableHeader ref={headerRef}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    className="hover:bg-transparent"
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((header) => (
                      <DataTableHeaderCell key={header.id} header={header} />
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody
                className={cn(
                  "transition-opacity duration-200",
                  isPending && "pointer-events-none opacity-50"
                )}
              >
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <DataTableCell key={cell.id} cell={cell} />
                      ))}
                    </TableRow>
                  ))
                ) : isPending ? (
                  // Skeleton loading rows - use pageSize from table state
                  Array.from({
                    length: table.getState().pagination.pageSize,
                  }).map((_, rowIndex) => (
                    <TableRow key={`skeleton-${rowIndex}`}>
                      {table.getVisibleFlatColumns().map((column) => (
                        <TableCell key={column.id}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      <EmptyState iconOnly />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollAreaTable>
        </div>
        <div
          className={cn(
            "bg-background/80 sticky bottom-0 z-30 -mt-px rounded-b-2xl border backdrop-blur-sm",
            (totalNumber <= 10 || !showPagination) &&
              "opacity-0 has-data-[state=visible]:opacity-100"
          )}
        >
          <div ref={setScrollBarContainer} className="border-b-0" />
          {totalNumber > 10 && showPagination && <DataTablePagination />}
        </div>
      </div>
    </HeaderRefsProvider>
  )
}
