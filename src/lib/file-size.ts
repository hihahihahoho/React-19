export const formatFileSize = (size: number) => {
  if (size === 0) return "0 bytes"

  const units = ["bytes", "KB", "MB", "GB", "TB", "PB"]
  let unitIndex = 0

  while (size >= 1000 && unitIndex < units.length - 1) {
    size /= 1000
    unitIndex++
  }

  const maximumFractionDigits = unitIndex === 0 ? 0 : 2

  return (
    new Intl.NumberFormat(undefined, {
      maximumFractionDigits,
    }).format(size) + units[unitIndex]
  )
}

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(number)
}
