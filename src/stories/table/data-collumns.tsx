import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import { Checkbox } from "@/components/ui/selection-controls/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  ChartArea,
  Copy,
  Eye,
  MoreHorizontal,
  SquarePen,
  Trash,
} from "lucide-react";
import { SegmentData } from "./data";

export const columns: ColumnDef<SegmentData>[] = [
  {
    accessorKey: "index",
    header: "STT",
    size: 56,
    meta: {
      align: "center",
      hideActiionsButton: true,
    },
  },
  {
    accessorKey: "maSegment",
    header: "Mã Segment",
  },
  {
    accessorKey: "tenSegment",
    header: "Tên Segment",
  },
  {
    accessorKey: "loaiKichBan",
    header: "Loại kịch bản",
  },
  {
    accessorKey: "dichVu",
    header: "Dịch vụ",
  },
  {
    accessorKey: "quyMoUocTinh",
    header: "Quy mô ước tính",
  },
  {
    accessorKey: "tinhKhaDung",
    header: "Tính khả dụng",
    cell: ({ cell }) => {
      const tinhKhaDung = cell.getValue() as string;
      return (
        <div>
          <div className="space-y-1">
            <Badge
              variant={
                tinhKhaDung.startsWith("Đang tính toán") ? "blue" : "orange"
              }
            >
              {tinhKhaDung}
            </Badge>
            {tinhKhaDung.startsWith("Đang tính toán") && (
              <div className="text-xs font-medium text-muted-foreground">
                Còn khoảng 30p
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "trangThai",
    header: "Trạng thái",
    cell: ({ cell }) => {
      const trangThai = cell.getValue() as string;
      return (
        <div>
          <Badge
            variant={
              trangThai === "Đã tạo"
                ? "blue"
                : trangThai === "Hoạt động"
                  ? "green"
                  : trangThai === "Khóa"
                    ? "red"
                    : "secondary"
            }
          >
            {trangThai}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "ngayTao",
    header: "Ngày tạo",
  },
  {
    accessorKey: "hoanTat",
    header: "Hoàn tất",
  },
  {
    accessorKey: "nguoiDuyet",
    header: "Người duyệt",
  },
  {
    id: "select",
    size: 56,
    meta: {
      align: "center",
      hideActiionsButton: true,
    },
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    id: "actions-column",
    enableHiding: false,
    size: 56,
    meta: {
      align: "center",
      hideActiionsButton: true,
    },
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button iconOnly variant="outline">
              <span className="sr-only">Mở hành động</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy />
              Sao chép
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SquarePen />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash />
              Xoá
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ChartArea />
              Đối tượng
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
