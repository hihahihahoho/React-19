import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/table/data-table"
import { DataTableProvider } from "@/components/ui/table/data-table-context"
import { DataTableSelection } from "@/components/ui/table/data-table-selection"
import { ShowHideColumnButton } from "@/components/ui/table/show-hide-collumn-button"
import { Download, Trash } from "lucide-react"
import { getData } from "./data"
import { columns } from "./data-collumns"

export default function DemoTableBasic() {
  const data = getData()

  return (
    <DataTableProvider columns={columns} data={data}>
      <div className="space-y-4">
        <div className="flex justify-end">
          <ShowHideColumnButton />
        </div>
        <DataTable variant="rounded" />
        <DataTableSelection>
          <Button variant="outline" isRounded>
            <Download />
            Tải xuống
          </Button>
          <Button variant="destructive" isRounded>
            <Trash />
            Xoá
          </Button>
        </DataTableSelection>
      </div>
    </DataTableProvider>
  )
}
