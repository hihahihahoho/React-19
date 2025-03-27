export function lowercaseFirstChar(str: string): string {
  if (!str) {
    return str // Handle empty string case
  }
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export function createRemoteFileProxy(
  url: string,
  size: number,
  mimeType = "image/jpeg"
) {
  // Create a special filename format that indicates this is a remote file
  // Format: "REMOTE_FILE::{URL}"
  const specialFileName = `REMOTE_FILE::${url}`

  // Create a minimal File object
  const blob = new Blob([new ArrayBuffer(size)], { type: mimeType })
  return new File([blob], specialFileName, { type: mimeType })
}