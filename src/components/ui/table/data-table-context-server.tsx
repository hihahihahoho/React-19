"use client"

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
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  useCallback,
  useMemo,
  useState,
  useTransition,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"
import {
  DataTableContext,
  useDataTable,
  type DataTableContextProps,
} from "./data-table-context"

export interface TableUrlParamKeys {
  page?: string
  pageSize?: string
  sort?: string
  order?: string
}

interface DataTableProviderServerProps<TData, TValue> {
  children?: ReactNode
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  rowCount: number
  defaultPageSize?: number
  paramKeys?: TableUrlParamKeys
  defaultPinLeft?: string[]
  fixedPinRight?: string[]
  fixedPinLeft?: string[]
  defaultSelection?: RowSelectionState
  tableOptions?: Partial<Omit<TableOptions<TData>, "data" | "columns">>
}

const DEFAULT_PARAM_KEYS: Required<TableUrlParamKeys> = {
  page: "page",
  pageSize: "size",
  sort: "sort",
  order: "order",
}

function DataTableProviderServer<TData, TValue>({
  children,
  columns,
  data,
  rowCount,
  defaultPageSize = 10,
  paramKeys,
  defaultPinLeft = [],
  fixedPinRight = ["actions-column"],
  fixedPinLeft = ["index"],
  defaultSelection = {},
  tableOptions,
}: DataTableProviderServerProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const keys = useMemo(
    () => ({ ...DEFAULT_PARAM_KEYS, ...paramKeys }),
    [paramKeys]
  )

  const pagination = useMemo((): PaginationState => {
    const pageParam = searchParams.get(keys.page)
    const sizeParam = searchParams.get(keys.pageSize)
    const pageIndex = pageParam ? Math.max(0, parseInt(pageParam, 10) - 1) : 0
    const pageSize = sizeParam ? parseInt(sizeParam, 10) : defaultPageSize
    return {
      pageIndex: isNaN(pageIndex) ? 0 : pageIndex,
      pageSize: isNaN(pageSize) ? defaultPageSize : pageSize,
    }
  }, [searchParams, keys.page, keys.pageSize, defaultPageSize])

  const sorting = useMemo((): SortingState => {
    const sortParam = searchParams.get(keys.sort)
    const orderParam = searchParams.get(keys.order)
    if (!sortParam) return []
    return [{ id: sortParam, desc: orderParam === "desc" }]
  }, [searchParams, keys.sort, keys.order])

  const updateUrl = useCallback(
    (newPagination: PaginationState, newSorting: SortingState) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(keys.page)
      params.delete(keys.pageSize)
      params.delete(keys.sort)
      params.delete(keys.order)

      if (newPagination.pageIndex > 0) {
        params.set(keys.page, String(newPagination.pageIndex + 1))
      }
      if (newPagination.pageSize !== defaultPageSize) {
        params.set(keys.pageSize, String(newPagination.pageSize))
      }
      if (newSorting.length > 0) {
        params.set(keys.sort, newSorting[0].id)
        if (newSorting[0].desc) {
          params.set(keys.order, "desc")
        }
      }

      const queryString = params.toString()
      const url = queryString ? `${pathname}?${queryString}` : pathname

      startTransition(() => {
        router.push(url, { scroll: false })
      })
    },
    [searchParams, pathname, router, keys, defaultPageSize]
  )

  const handleSortingChange = useCallback(
    (updaterOrValue: SortingState | ((prev: SortingState) => SortingState)) => {
      const newSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue
      const resetPagination = { ...pagination, pageIndex: 0 }
      updateUrl(resetPagination, newSorting)
    },
    [sorting, pagination, updateUrl]
  )

  const handlePaginationChange = useCallback(
    (
      updaterOrValue:
        | PaginationState
        | ((prev: PaginationState) => PaginationState)
    ) => {
      const newPagination =
        typeof updaterOrValue === "function"
          ? updaterOrValue(pagination)
          : updaterOrValue
      updateUrl(newPagination, sorting)
    },
    [pagination, sorting, updateUrl]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      const newPagination = { ...pagination, pageIndex: page - 1 }
      updateUrl(newPagination, sorting)
    },
    [pagination, sorting, updateUrl]
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

const useDataTableServer = useDataTable

export { DataTableProviderServer, useDataTableServer }
