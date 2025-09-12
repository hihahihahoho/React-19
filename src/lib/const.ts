const MAX_FILE_SIZE = 700000 // 500KB
const FORMAT_DATE = "dd/MM/yyyy"
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
]

const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
]
const ACCEPTED_PDF_TYPES = ["application/pdf"]

const ACCEPTED_EXCEL_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]

export { ACCEPTED_EXCEL_TYPES, ACCEPTED_IMAGE_TYPES, ACCEPTED_PDF_TYPES, ACCEPTED_VIDEO_TYPES, FORMAT_DATE, MAX_FILE_SIZE }

