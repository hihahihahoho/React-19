import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion/accordion"
import {
  DataRow,
  DataRowLabel,
  DataRowValue,
  DataRowWrapper,
} from "@/components/ui/data-row"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed/_playground/detail-account")({
  component: RouteComponent,
  staticData: {
    title: "Chi tiết thông tin tài khoản",
  },
})

function RouteComponent() {
  return (
    <>
      <Accordion
        type="multiple"
        defaultValue={["account-info", "access-history", "change-history"]}
        className="w-full"
      >
        <AccordionItem value="account-info">
          <AccordionTrigger>Thông tin tài khoản</AccordionTrigger>
          <AccordionContent data-state="open">
            <DataRowWrapper>
              <DataRow>
                <DataRowLabel>userId ID</DataRowLabel>
                <DataRowValue>3857348678/657</DataRowValue>
              </DataRow>
              <DataRow>
                <DataRowLabel>Email</DataRowLabel>
                <DataRowValue>abc@gmail.com</DataRowValue>
              </DataRow>
              <DataRow>
                <DataRowLabel>Số điện thoại</DataRowLabel>
                <DataRowValue>0968668787</DataRowValue>
              </DataRow>
              <DataRow>
                <DataRowLabel>Mã số thuế</DataRowLabel>
                <DataRowValue>35635367</DataRowValue>
              </DataRow>
            </DataRowWrapper>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="access-history">
          <AccordionTrigger>Tài khoản liên kết</AccordionTrigger>
          <AccordionContent data-state="open">
            <DataRowWrapper>
              <DataRow>
                <DataRowLabel>Trạng thái liên kết tài khoản</DataRowLabel>
                <DataRowValue>Đang hoạt động</DataRowValue>
              </DataRow>
              <DataRow>
                <DataRowLabel>Ngày kích hoạt</DataRowLabel>
                <DataRowValue>05/01/2023 10:00:00</DataRowValue>
              </DataRow>
              <DataRow>
                <DataRowLabel>Ngày hết hạn</DataRowLabel>
                <DataRowValue>05/01/2024 10:00:00</DataRowValue>
              </DataRow>
              <DataRow>
                <DataRowLabel>Người tạo</DataRowLabel>
                <DataRowValue>ADMIN</DataRowValue>
              </DataRow>
            </DataRowWrapper>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="change-history">
          <AccordionTrigger>Lịch sử thay đổi</AccordionTrigger>
          <AccordionContent data-state="open">
            <DataRowWrapper>
              <DataRow>
                <DataRowLabel>Ngày tạo</DataRowLabel>
                <DataRowValue>24/01/2023</DataRowValue>
              </DataRow>
              <DataRow>
                <DataRowLabel>Người tạo</DataRowLabel>
                <DataRowValue>ADMIN</DataRowValue>
              </DataRow>
              <DataRow>
                <DataRowLabel>Trạng thái thay đổi lần cuối</DataRowLabel>
                <DataRowValue>Cập nhật</DataRowValue>
              </DataRow>
              <DataRow>
                <DataRowLabel>Thời gian thay đổi</DataRowLabel>
                <DataRowValue>24/01/2023 10:00:00</DataRowValue>
              </DataRow>
            </DataRowWrapper>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
