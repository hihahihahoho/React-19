// data-table-context.tsx
"use client"

import {
  ColumnDef,
  ColumnPinningState,
  RowSelectionState,
  SortingState,
  Table,
  TableOptions,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"

interface DataTableContextProps<TData> {
  table: Table<TData>
  sorting: SortingState
  setSorting: Dispatch<SetStateAction<SortingState>>
  columnPinning: ColumnPinningState
  setColumnPinning: Dispatch<SetStateAction<ColumnPinningState>>
  rowSelection: Record<string, boolean>
  setRowSelection: Dispatch<SetStateAction<Record<string, boolean>>>
  currentPage: number
  totalPages: number
  defaultPinLeft: string[]
  fixedPinRight: string[]
  fixedPinLeft: string[]
  totalNumber: number
  handlePageChange: (page: number) => void
}

const DataTableContext = createContext<DataTableContextProps<unknown> | null>(
  null
)

interface DataTableProviderProps<TData, TValue> {
  children?: ReactNode
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  defaultPinLeft?: string[]
  fixedPinRight?: string[]
  fixedPinLeft?: string[]
  pageSize?: number
  defaultSelection?: RowSelectionState
  /** Extend or override table options */
  tableOptions?: Partial<Omit<TableOptions<TData>, "data" | "columns">>
}

function DataTableProvider<TData, TValue>({
  children,
  columns,
  data,
  defaultPinLeft = [],
  fixedPinRight = ["actions-column"],
  fixedPinLeft = ["index"],
  defaultSelection = {},
  pageSize = 10,
  tableOptions,
}: DataTableProviderProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
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
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    defaultColumn: {
      minSize: 56,
      size: "auto" as unknown as number,
      maxSize: 200,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
      ...tableOptions?.initialState,
    },
    ...tableOptions,
    // Merge state - tableOptions.state extends our managed state
    state: {
      sorting,
      columnPinning,
      rowSelection,
      ...tableOptions?.state,
    },
  })

  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()

  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1)
  }

  const contextValue: DataTableContextProps<TData> = {
    table,
    sorting,
    setSorting,
    columnPinning,
    setColumnPinning,
    rowSelection,
    setRowSelection,
    currentPage,
    totalPages,
    handlePageChange,
    defaultPinLeft,
    fixedPinRight,
    fixedPinLeft,
    totalNumber: data?.length || 0,
  }

  return (
    <DataTableContext.Provider
      value={contextValue as DataTableContextProps<unknown>}
    >
      {children}
    </DataTableContext.Provider>
  )
}

function useDataTable<TData>() {
  const context = useContext(DataTableContext)
  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider")
  }
  return context as DataTableContextProps<TData>
}

export { DataTableProvider, useDataTable }
