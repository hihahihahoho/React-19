// Function to generate a random date within a range
function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function formatDate(date: Date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export interface SegmentData {
  index: number;
  maSegment: string;
  tenSegment: string;
  loaiKichBan: string;
  dichVu: string;
  quyMoUocTinh: number;
  tinhKhaDung: string;
  trangThai: string;
  ngayTao: string;
  hoanTat: string;
  nguoiDuyet: string;
}

export function getData(): SegmentData[] {
  const maSegments = [
    "LASTLOGIN_1211",
    "ANALYTICS_22",
    "INTEGRATIONS_45",
    "STATISTICS_78",
    "ACTIVITY_99",
    "ENGAGEMENT_100",
    "RETENTION_121",
    "REPORTS_145",
    "DASHBOARD_189",
    "SETTINGS_205",
  ];
  const tenSegments = [
    "Thời gian đăng nhập APP Ví cuối cùng >",
    "Đổi mật khẩu cho tài khoản Ví",
    "Chuyển khoản tới tài khoản khác",
    "Nạp tiền vào Ví điện tử",
    "Xem lịch sử giao dịch",
    "Khóa thẻ/tài khoản",
    "Xem số dư trong Ví",
    "Quản lý thông tin cá nhân",
    "Xác thực giao dịch",
    "Thay đổi thông tin liên hệ",
  ];
  const loaiKichBans = [
    "Chạy hàng ngày",
    "Chạy hàng tuần",
    "Chạy hàng tháng",
    "Chạy hàng quý",
    "Chạy hàng năm",
    "Chạy theo yêu cầu",
    "Chạy hàng lẻ",
    "Chạy hàng dịp đặc biệt",
    "Chạy hàng kỷ niệm",
    "Chạy theo lịch trình",
  ];
  const dichVus = [
    "Taxi",
    "Thức ăn",
    "Bánh mỳ",
    "Cà phê",
    "Trà sữa",
    "Quần áo",
    "Giày dép",
    "Điện thoại",
    "Máy tính",
    "Camera",
  ];
  const tinhKhaDungs = ["Đang tính toán", "Sẵn sàng"];
  const trangThais = ["Đã tạo", "Hoạt động", "Khóa", "Hết hạn"];
  const nguoiDuyets = [
    "hoant6",
    "devgirl",
    "designer123",
    "coder321",
    "artist99",
    "creative22",
    "builder007",
    "maker34",
    "innovator89",
    "dreamer456",
    "UXpert",
    "VisualGuru",
    "CraftyDesigner",
    "InnovativeArtist",
    "DigitalCreator",
    "MasterOfDesign",
  ];

  const data: SegmentData[] = [];
  const startDate = new Date(2024, 9, 29);
  const endDate = new Date(2025, 1, 5);

  for (let i = 0; i < 100; i++) {
    const randomIndex = i % maSegments.length;
    const ngayTaoDate = randomDate(startDate, endDate);
    const hoanTatDate = randomDate(
      ngayTaoDate,
      new Date(ngayTaoDate.getTime() + 5 * 24 * 60 * 60 * 1000)
    );

    data.push({
      index: i + 1,
      maSegment: maSegments[randomIndex],
      tenSegment: tenSegments[randomIndex],
      loaiKichBan: loaiKichBans[randomIndex],
      dichVu: dichVus[randomIndex],
      quyMoUocTinh: 100000 + Math.floor(Math.random() * 5000000),
      tinhKhaDung:
        tinhKhaDungs[Math.floor(Math.random() * tinhKhaDungs.length)],
      trangThai: trangThais[Math.floor(Math.random() * trangThais.length)],
      ngayTao: formatDate(ngayTaoDate),
      hoanTat: formatDate(hoanTatDate),
      nguoiDuyet: nguoiDuyets[Math.floor(Math.random() * nguoiDuyets.length)],
    });
  }

  return data;
}
