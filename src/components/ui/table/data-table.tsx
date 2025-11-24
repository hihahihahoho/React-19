"use client"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import React, { useRef } from "react"
import { Button } from "../button"
import { EmptyState } from "../empty-state"
import { ScrollAreaTable } from "../scroll-area"
import { DataTableCell } from "./data-table-cell"
import { useDataTable } from "./data-table-context"
import { FloatingHeader } from "./data-table-floating-header"
import { MemoizedDataTableHeaderCell } from "./data-table-header-cell"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableSelection } from "./data-table-selection"
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
  extendActions?: React.ReactNode
}

export function DataTable({
  variant,
  fixedHeaderOffset,
  emptyState,
  showPagination = true,
  autoWidthTable = false,
  tableWrapperClassName,
  extendActions,
}: DataTableProps) {
  const { table } = useDataTable()
  const tableRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLTableSectionElement>(null)
  const mainScrollRef = useRef<HTMLDivElement>(null)
  const [scrollBarContainer, setScrollBarContainer] =
    React.useState<HTMLDivElement | null>(null)

  if (table.getRowCount() <= 0)
    return (
      emptyState || (
        <EmptyState className="rounded">
          <Button>Tải lại</Button>
        </EmptyState>
      )
    )

  return (
    <HeaderRefsProvider>
      <div className="" ref={tableRef}>
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
            (table.getRowCount() <= 10 || !showPagination) && "rounded-b-xl",
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
                      <MemoizedDataTableHeaderCell
                        key={header.id}
                        header={header}
                      />
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
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
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      Không có dữ liệu.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollAreaTable>
        </div>
        <DataTableSelection extendActions={extendActions} />

        <div
          className={cn(
            "bg-background/80 sticky bottom-0 z-30 -mt-px rounded-b-2xl border backdrop-blur-sm",
            (table.getRowCount() <= 10 || !showPagination) &&
              "opacity-0 has-data-[state=visible]:opacity-100"
          )}
        >
          <div ref={setScrollBarContainer} className="border-b-0" />
          {table.getRowCount() > 10 && showPagination && (
            <DataTablePagination />
          )}
        </div>
      </div>
    </HeaderRefsProvider>
  )
}
