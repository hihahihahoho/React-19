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
  useMemo,
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
  totalNumber: number
  handlePageChange: (page: number) => void
  isPending?: boolean
}

const DataTableContext = createContext<DataTableContextProps<unknown> | null>(
  null
)

interface DataTableProviderProps<TData, TValue> {
  children?: ReactNode
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSize?: number
  defaultSelection?: RowSelectionState
  /** Extend or override table options */
  tableOptions?: Partial<Omit<TableOptions<TData>, "data" | "columns">>
}

/** Helper to derive initial pin state from column definitions */
function getInitialPinningFromColumns<TData, TValue>(
  columns: ColumnDef<TData, TValue>[]
): ColumnPinningState {
  const left: string[] = []
  const right: string[] = []

  columns.forEach((col) => {
    const id =
      (col as { id?: string; accessorKey?: string }).id ??
      (col as { accessorKey?: string }).accessorKey
    if (!id) return

    const meta = col.meta
    if (meta?.pinned === "left") {
      left.push(id)
    } else if (meta?.pinned === "right") {
      right.push(id)
    }
  })

  return { left, right }
}

function DataTableProvider<TData, TValue>({
  children,
  columns,
  data,
  defaultSelection = {},
  pageSize = 10,
  tableOptions,
}: DataTableProviderProps<TData, TValue>) {
  // Derive initial pinning from column meta
  const initialPinning = useMemo(
    () => getInitialPinningFromColumns(columns),
    // Only compute once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnPinning, setColumnPinning] =
    useState<ColumnPinningState>(initialPinning)
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(defaultSelection)

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

export { DataTableContext, DataTableProvider, useDataTable }
export type { DataTableContextProps }
