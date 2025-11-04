import { DataTable } from "@/components/ui/table/data-table"
import { DataTableProvider } from "@/components/ui/table/data-table-context"
import { ShowHideColumnButton } from "@/components/ui/table/show-hide-collumn-button"
import { getData } from "./data"
import { columns } from "./data-collumns"

export default function DemoTableBasic() {
  const data = getData()

  return (
    <DataTableProvider
      columns={columns}
      data={data}
      fixedPinRight={["select", "actions-column"]}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <ShowHideColumnButton />
        </div>
        <DataTable variant="rounded" />
      </div>
    </DataTableProvider>
  )
}
