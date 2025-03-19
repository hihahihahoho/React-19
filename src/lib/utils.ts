import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSubdomain(host: string): string {
  const parts = host.split(".")
  return parts[0]
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const matches = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`
    )
  )
  return matches ? decodeURIComponent(matches[1]) : null
}

export function lowercaseFirstChar(str: string): string {
  if (!str) {
    return str // Handle empty string case
  }
  return str.charAt(0).toLowerCase() + str.slice(1)
}


export function createRemoteFileProxy(url: string, size: number, mimeType = "image/jpeg") {
  // Create a special filename format that indicates this is a remote file
  // Format: "REMOTE_FILE::{URL}"
  const specialFileName = `REMOTE_FILE::${url}`;

  // Create a minimal File object
  const blob = new Blob([new ArrayBuffer(size)], { type: mimeType });
  return new File([blob], specialFileName, { type: mimeType });
}