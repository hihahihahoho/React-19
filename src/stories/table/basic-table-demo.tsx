import { DataTable } from "@/components/ui/table/data-table"
import { DataTableProvider } from "@/components/ui/table/data-table-context"
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
      <DataTable fixedHeaderOffset="top-0" />
    </DataTableProvider>
  )
}
