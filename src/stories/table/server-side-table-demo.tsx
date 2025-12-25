"use client"

import { DataTable } from "@/components/ui/table/data-table"
import {
  DataTableContext,
  useDataTable,
  type DataTableContextProps,
} from "@/components/ui/table/data-table-context"
import { ShowHideColumnButton } from "@/components/ui/table/show-hide-collumn-button"
import {
  ColumnDef,
  ColumnPinningState,
  getCoreRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"
import { getData, SegmentData } from "./data"
import { columns } from "./data-collumns"

// Simulate a full dataset on "server"
const FULL_DATA = getData(500)

interface ServerResponse {
  data: SegmentData[]
  totalCount: number
}

async function fetchFromServer(
  pagination: PaginationState,
  sorting: SortingState
): Promise<ServerResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const result = [...FULL_DATA]

  if (sorting.length > 0) {
    const { id, desc } = sorting[0]
    result.sort((a, b) => {
      const aValue = a[id as keyof SegmentData]
      const bValue = b[id as keyof SegmentData]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return desc ? bValue - aValue : aValue - bValue
      }

      const aStr = String(aValue)
      const bStr = String(bValue)
      return desc ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr)
    })
  }

  const start = pagination.pageIndex * pagination.pageSize
  const paginatedData = result.slice(start, start + pagination.pageSize)

  return {
    data: paginatedData,
    totalCount: FULL_DATA.length,
  }
}

function TableInfo() {
  const { currentPage, totalPages, sorting, totalNumber, isPending } =
    useDataTable()

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="text-muted-foreground text-sm">
        {isPending ? (
          <span className="animate-pulse">⏳ Loading data...</span>
        ) : (
          <span>
            Total: <strong>{totalNumber.toLocaleString()}</strong> records |
            Page {currentPage} of {totalPages} |{" "}
            {sorting.length > 0
              ? `Sort: ${sorting[0].id} (${sorting[0].desc ? "desc" : "asc"})`
              : "No sort"}
          </span>
        )}
      </div>
      <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
        Server Mode (Mock)
      </span>
    </div>
  )
}

interface ServerSideProviderProps {
  children: React.ReactNode
  columns: ColumnDef<SegmentData, unknown>[]
  fixedPinRight?: string[]
  onUrlChange?: (url: string) => void
}

function ServerSideProvider({
  children,
  columns,
  fixedPinRight = ["actions-column"],
  onUrlChange,
}: ServerSideProviderProps) {
  const defaultPageSize = 10
  const defaultPinLeft: string[] = []
  const fixedPinLeft = ["index"]

  // Table state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [isPending, setIsPending] = useState(true)

  // Server data
  const [data, setData] = useState<SegmentData[]>([])
  const [rowCount, setRowCount] = useState(0)

  // Fetch data when pagination/sorting changes
  const fetchData = useCallback(async () => {
    setIsPending(true)
    try {
      const response = await fetchFromServer(pagination, sorting)
      setData(response.data)
      setRowCount(response.totalCount)
    } finally {
      setIsPending(false)
    }
  }, [pagination, sorting])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Build URL for display
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

  // Notify URL change
  useEffect(() => {
    onUrlChange?.(buildUrl(pagination, sorting))
  }, [pagination, sorting, buildUrl, onUrlChange])

  const handleSortingChange = useCallback(
    (updaterOrValue: SortingState | ((prev: SortingState) => SortingState)) => {
      const newSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue
      setSorting(newSorting)
      // Reset to page 1 when sorting changes
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    },
    [sorting]
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
      setPagination(newPagination)
    },
    [pagination]
  )

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))
  }, [])

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [...defaultPinLeft, ...fixedPinLeft],
    right: [...fixedPinRight],
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<SegmentData>({
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
    state: {
      sorting,
      pagination,
      columnPinning,
      rowSelection,
    },
  })

  const currentPage = pagination.pageIndex + 1
  const totalPages = Math.ceil(rowCount / pagination.pageSize) || 1

  const contextValue: DataTableContextProps<SegmentData> = {
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

export default function ServerSideTableDemo() {
  const [currentUrl, setCurrentUrl] = useState("/table")
  const tableColumns = useMemo(() => columns, [])

  return (
    <div className="space-y-4">
      {/* URL Display */}
      <div className="bg-muted/50 rounded-lg border p-3">
        <div className="text-muted-foreground mb-1 text-xs font-medium">
          Simulated URL (synced with table state)
        </div>
        <code className="text-primary font-mono text-sm break-all">
          {currentUrl}
        </code>
      </div>

      <ServerSideProvider
        columns={tableColumns}
        fixedPinRight={["tinhKhaDung", "select", "actions-column"]}
        onUrlChange={setCurrentUrl}
      >
        <div className="space-y-4">
          <TableInfo />
          <div className="flex justify-end">
            <ShowHideColumnButton />
          </div>
          <DataTable variant="rounded" />
        </div>
      </ServerSideProvider>

      {/* Usage Info */}
      <div className="bg-muted/30 rounded-lg border p-4 text-sm">
        <div className="mb-2 font-medium">💡 Real Next.js Usage:</div>
        <pre className="bg-background overflow-x-auto rounded border p-3 text-xs">
          {`// app/users/page.tsx
import { DataTableProviderServer } from "@/components/ui/table/data-table-context-server"

export default async function UsersPage({ searchParams }) {
  const params = await searchParams
  const { data, totalCount } = await fetchUsers(params)

  return (
    <DataTableProviderServer
      columns={columns}
      data={data}
      rowCount={totalCount}
    >
      <DataTable />
    </DataTableProviderServer>
  )
}`}
        </pre>
      </div>
    </div>
  )
}
