"use client"

/**
 * Mock version of DataTableProviderServer for Storybook
 * This uses local state instead of next/navigation
 */

import {
  DataTableContext,
  type DataTableContextProps,
} from "@/components/ui/table/data-table-context"
import {
  ColumnDef,
  ColumnPinningState,
  PaginationState,
  RowSelectionState,
  SortingState,
  TableOptions,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"

interface DataTableProviderServerMockProps<TData, TValue> {
  children?: ReactNode
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  rowCount: number
  defaultPageSize?: number
  defaultPinLeft?: string[]
  fixedPinRight?: string[]
  fixedPinLeft?: string[]
  defaultSelection?: RowSelectionState
  tableOptions?: Partial<Omit<TableOptions<TData>, "data" | "columns">>
  /** Callback when URL would change */
  onUrlChange?: (url: string) => void
}

export function DataTableProviderServerMock<TData, TValue>({
  children,
  columns,
  data,
  rowCount,
  defaultPageSize = 10,
  defaultPinLeft = [],
  fixedPinRight = ["actions-column"],
  fixedPinLeft = ["index"],
  defaultSelection = {},
  tableOptions,
  onUrlChange,
}: DataTableProviderServerMockProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [isPending, setIsPending] = useState(false)

  const buildUrl = useCallback(
    (pag: PaginationState, sort: SortingState) => {
      const params = new URLSearchParams()
      if (pag.pageIndex > 0) {
        params.set("page", String(pag.pageIndex + 1))
      }
      if (pag.pageSize !== defaultPageSize) {
        params.set("size", String(pag.pageSize))
      }
      if (sort.length > 0) {
        params.set("sort", sort[0].id)
        if (sort[0].desc) {
          params.set("order", "desc")
        }
      }
      const qs = params.toString()
      return qs ? `/table?${qs}` : "/table"
    },
    [defaultPageSize]
  )

  const handleSortingChange = useCallback(
    (updaterOrValue: SortingState | ((prev: SortingState) => SortingState)) => {
      setIsPending(true)
      const newSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue
      const resetPagination = { ...pagination, pageIndex: 0 }
      setTimeout(() => {
        setSorting(newSorting)
        setPagination(resetPagination)
        setIsPending(false)
        onUrlChange?.(buildUrl(resetPagination, newSorting))
      }, 50)
    },
    [sorting, pagination, buildUrl, onUrlChange]
  )

  const handlePaginationChange = useCallback(
    (
      updaterOrValue:
        | PaginationState
        | ((prev: PaginationState) => PaginationState)
    ) => {
      setIsPending(true)
      const newPagination =
        typeof updaterOrValue === "function"
          ? updaterOrValue(pagination)
          : updaterOrValue
      setTimeout(() => {
        setPagination(newPagination)
        setIsPending(false)
        onUrlChange?.(buildUrl(newPagination, sorting))
      }, 50)
    },
    [pagination, sorting, buildUrl, onUrlChange]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      handlePaginationChange({ ...pagination, pageIndex: page - 1 })
    },
    [pagination, handlePaginationChange]
  )

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [...defaultPinLeft, ...fixedPinLeft],
    right: [...fixedPinRight],
  })
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(defaultSelection)

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    rowCount,
    pageCount: Math.ceil(rowCount / pagination.pageSize),
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    defaultColumn: {
      minSize: 56,
      size: "auto" as unknown as number,
      maxSize: 200,
    },
    ...tableOptions,
    state: {
      sorting,
      pagination,
      columnPinning,
      rowSelection,
      ...tableOptions?.state,
    },
  })

  const currentPage = pagination.pageIndex + 1
  const totalPages = Math.ceil(rowCount / pagination.pageSize)

  const contextValue: DataTableContextProps<TData> = {
    table,
    sorting,
    setSorting: handleSortingChange as Dispatch<SetStateAction<SortingState>>,
    columnPinning,
    setColumnPinning,
    rowSelection,
    setRowSelection,
    currentPage,
    totalPages,
    handlePageChange,
    totalNumber: rowCount,
    isPending,
  }

  return (
    <DataTableContext.Provider
      value={contextValue as DataTableContextProps<unknown>}
    >
      {children}
    </DataTableContext.Provider>
  )
}

export { useMemo as usePaginationState, useState as useSortingState }
