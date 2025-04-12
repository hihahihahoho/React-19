import { CombinedPagination } from "../pagination"
import { Select } from "../select/select"
import { useDataTable } from "./data-table-context"
export function DataTablePagination() {
  const { table } = useDataTable()
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()

  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-4 max-sm:px-2 md:gap-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="max-sm:hidden">Hiển thị</span>
        <div className="w-18 md:w-20">
          <Select
            formComposition={{ inputClear: false }}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
            options={[
              { label: "10", value: "10" },
              { label: "20", value: "20" },
              { label: "50", value: "50" },
              { label: "100", value: "100" },
            ]}
            value={table.getState().pagination.pageSize.toString()}
          />
        </div>
        <span className="max-sm:hidden">Bản ghi / trang</span>
      </div>

      <CombinedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="m-0"
      />
    </div>
  )
}
