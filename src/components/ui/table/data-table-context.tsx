// data-table-context.tsx
"use client"

import {
  ColumnDef,
  ColumnPinningState,
  RowSelectionState,
  SortingState,
  Table,
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

const DataTableContext = createContext<DataTableContextProps<any>>(
  {} as DataTableContextProps<any>
)

function DataTableProvider<TData, TValue>({
  children,
  columns,
  data,
  defaultPinLeft = [],
  fixedPinRight = ["actions-column"],
  fixedPinLeft = ["index"],
  defaultSelection = {},
  pageSize = 10,
}: {
  children?: ReactNode
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  defaultPinLeft?: string[]
  fixedPinRight?: string[]
  fixedPinLeft?: string[]
  pageSize?: number
  defaultSelection?: RowSelectionState
}) {
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
    state: {
      sorting,
      columnPinning,
      rowSelection,
    },
    defaultColumn: {
      minSize: 56,
      size: "auto" as unknown as number,
      maxSize: 200,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  })

  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()

  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1)
  }

  return (
    <DataTableContext.Provider
      value={{
        table: table as Table<TData>,
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
      }}
    >
      {children}
    </DataTableContext.Provider>
  )
}

const useDataTable = () => useContext(DataTableContext)

export { DataTableProvider, useDataTable }
