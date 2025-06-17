import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/datepicker/datepicker"
import { Input } from "@/components/ui/input/input"
import { Select } from "@/components/ui/select/select"
import { DataTable } from "@/components/ui/table/data-table"
import { DataTableProvider } from "@/components/ui/table/data-table-context"
import { getData } from "@/stories/table/data"
import { columns } from "@/stories/table/data-collumns"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed/_playground/manage-acc-user")({
  component: RouteComponent,
  staticData: {
    title: "Quản lý tài khoản khách hàng",
  },
})

function RouteComponent() {
  const data = getData()
  return (
    <>
      <div className="bg-base-background border-base-border flex flex-wrap gap-4 self-stretch rounded-lg border-1 p-6 shadow-sm">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="">
            <Input
              formComposition={{
                label: "Số điện thoại",
              }}
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className="">
            <Input
              formComposition={{
                label: "Email",
              }}
              placeholder="Nhập email"
            />
          </div>
          <div className="">
            <Input
              formComposition={{
                label: "Mã số thuế",
              }}
              placeholder="Nhập mã số thuế"
            />
          </div>
          <div className="">
            <Select
              formComposition={{
                label: "Trạng thái",
              }}
              onValueChange={function xoe() {}}
              options={[
                {
                  label: "Apple",
                  value: "apple",
                },
                {
                  label: "Banana",
                  value: "banana",
                },
                {
                  label: "Orange",
                  value: "orange",
                },
                {
                  label: "Strawberry",
                  value: "strawberry",
                },
                {
                  label: "Grape",
                  value: "grape",
                },
                {
                  label: "Watermelon",
                  value: "watermelon",
                },
              ]}
              placeholder="Tất cả"
            />
          </div>
          <div className="">
            <DatePicker
              formComposition={{
                label: "Từ ngày",
              }}
              onValueChange={function xoe() {}}
              placeholder="Từ ngày"
            />
          </div>
          <div className="">
            <DatePicker
              formComposition={{
                label: "Tới ngày",
              }}
              onValueChange={function xoe() {}}
              placeholder="Tới ngày"
            />
          </div>
          <div className="">
            <Select
              formComposition={{
                label: "Tài khoản",
              }}
              onValueChange={function xoe() {}}
              options={[
                {
                  label: "Apple",
                  value: "apple",
                },
                {
                  label: "Banana",
                  value: "banana",
                },
                {
                  label: "Orange",
                  value: "orange",
                },
                {
                  label: "Strawberry",
                  value: "strawberry",
                },
                {
                  label: "Grape",
                  value: "grape",
                },
                {
                  label: "Watermelon",
                  value: "watermelon",
                },
              ]}
              placeholder="Tất cả"
            />
          </div>
          <div className="flex items-end justify-start gap-2">
            <Button variant="secondary">Tìm kiếm</Button>
            <Button variant="outline">Đặt lại</Button>
          </div>
        </div>
      </div>
      <DataTableProvider
        columns={columns}
        data={data}
        fixedPinRight={["select", "actions-column"]}
      >
        <DataTable fixedHeaderOffset="top-0" />
      </DataTableProvider>
    </>
  )
}
