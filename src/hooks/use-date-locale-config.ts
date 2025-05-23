import { generateLocaleDateConfig } from "@/lib/locale-date"
import React from "react"

/**
 * Hook for handling locale detection and configuration
 *
 * @param locale The locale string or undefined to use browser's locale
 * @returns The locale configuration for date formatting
 */

export function useLocaleDateConfig(locale?: string) {
  // Detect user's browser locale if not provided
  const effectiveLocale = React.useMemo(() => {
    if (!locale) {
      return navigator.language || "en"
    }
    return locale
  }, [locale])

  // Generate the locale configuration
  const localeConfig = React.useMemo(() => {
    return generateLocaleDateConfig(effectiveLocale)
  }, [effectiveLocale])

  return localeConfig
}
