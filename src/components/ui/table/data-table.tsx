"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { useRef } from "react";
import { Button } from "../button";
import { EmptyState } from "../empty-state/empty-state";
import { ScrollAreaTable } from "../scroll-area";
import { DataTableCell } from "./data-table-cell";
import { useDataTable } from "./data-table-context";
import { FloatingHeader } from "./data-table-floating-header";
import { DataTableHeaderCell } from "./data-table-header-cell";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableSelection } from "./data-table-selection";
import { HeaderRefsProvider } from "./header-ref-context";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./table";

const tableVariants = cva("", {
  variants: {
    variant: {
      default: "border-b",
      rounded: "rounded-md border",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface DataTableProps {
  variant?: "default" | "rounded";
  fixedHeaderOffset?: string;
  emptyState?: React.ReactNode;
}

export function DataTable({
  variant,
  fixedHeaderOffset,
  emptyState,
}: DataTableProps) {
  const { table } = useDataTable();
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const scrollBarAreaRef = useRef<HTMLDivElement>(null);

  if (table.getRowModel().rows?.length <= 0)
    return (
      emptyState || (
        <EmptyState className="rounded">
          <Button>Tải lại</Button>
        </EmptyState>
      )
    );

  return (
    <HeaderRefsProvider>
      <div className="w-full" ref={tableRef}>
        <FloatingHeader
          mainScrollRef={mainScrollRef}
          tableRef={tableRef}
          headerRef={headerRef}
          fixedHeaderOffset={fixedHeaderOffset}
        />

        <div className={cn(tableVariants({ variant }))}>
          <ScrollAreaTable
            type="always"
            srcollBarPortalRef={scrollBarAreaRef}
            viewportRef={mainScrollRef}
            className="w-full"
          >
            <Table
              style={{ minWidth: table.getVisibleFlatColumns().length * 120 }}
            >
              <TableHeader ref={headerRef}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <DataTableHeaderCell key={header.id} header={header} />
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
        <div className="sticky bottom-0 z-30 border-t mt-[-1px] bg-card/90 backdrop-blur">
          <div ref={scrollBarAreaRef} />
          {table.getRowModel().rows?.length > 0 && <DataTablePagination />}
        </div>
        <DataTableSelection />
      </div>
    </HeaderRefsProvider>
  );
}
