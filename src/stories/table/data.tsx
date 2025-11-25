import { faker } from "@faker-js/faker"

// Set locale to Vietnamese for more relevant data
faker.setDefaultRefDate(new Date("2025-01-15"))

export interface SegmentData {
  index: number
  maSegment: string
  tenSegment: string
  loaiKichBan: string
  dichVu: string
  quyMoUocTinh: number
  tinhKhaDung: string
  trangThai: string
  ngayTao: string
  hoanTat: string
  nguoiDuyet: string
}

const loaiKichBanOptions = [
  "Chạy hàng ngày",
  "Chạy hàng tuần",
  "Chạy hàng tháng",
  "Chạy hàng quý",
  "Chạy hàng năm",
  "Chạy theo yêu cầu",
]

const dichVuOptions = [
  "Taxi",
  "Thức ăn",
  "Cà phê",
  "Trà sữa",
  "Quần áo",
  "Giày dép",
  "Điện thoại",
  "Máy tính",
  "Camera",
  "Sách",
]

const tinhKhaDungOptions = ["Đang tính toán", "Sẵn sàng"]
const trangThaiOptions = ["Đã tạo", "Hoạt động", "Khóa", "Hết hạn"]

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function getData(count: number = 100): SegmentData[] {
  return Array.from({ length: count }, (_, i) => {
    const ngayTaoDate = faker.date.between({
      from: new Date(2024, 9, 1),
      to: new Date(2025, 1, 15),
    })
    const hoanTatDate = faker.date.between({
      from: ngayTaoDate,
      to: new Date(ngayTaoDate.getTime() + 7 * 24 * 60 * 60 * 1000),
    })

    return {
      index: i + 1,
      maSegment: `${faker.string.alpha({ length: 4, casing: "upper" })}_${faker.number.int({ min: 100, max: 9999 })}`,
      tenSegment: faker.lorem.sentence({ min: 3, max: 6 }),
      loaiKichBan: faker.helpers.arrayElement(loaiKichBanOptions),
      dichVu: faker.helpers.arrayElement(dichVuOptions),
      quyMoUocTinh: faker.number.int({ min: 100000, max: 5000000 }),
      tinhKhaDung: faker.helpers.arrayElement(tinhKhaDungOptions),
      trangThai: faker.helpers.arrayElement(trangThaiOptions),
      ngayTao: formatDate(ngayTaoDate),
      hoanTat: formatDate(hoanTatDate),
      nguoiDuyet: faker.internet.username().toLowerCase(),
    }
  })
}
