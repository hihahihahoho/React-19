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
      `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1")}=([^;]*)`
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
