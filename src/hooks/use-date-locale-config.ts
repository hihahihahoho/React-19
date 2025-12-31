"use client"

import { generateLocaleDateConfig } from "@/lib/locale-date"
import React from "react"

/**
 * Hook for handling locale detection and configuration
 *
 * @param locale The locale string or undefined to use browser's locale
 * @returns The locale configuration for date formatting
 */

export function useLocaleDateConfig(locale?: string) {
  // Default to provided locale or "vi-VN" (VNPAY context) for server-side consistency
  const [effectiveLocale, setEffectiveLocale] = React.useState(locale || "vi-VN")

  React.useEffect(() => {
    // Only detect browser locale on client side if no locale is provided
    if (!locale && typeof window !== "undefined") {
      setEffectiveLocale(navigator.language || "vi-VN")
    }
  }, [locale])

  // Generate the locale configuration
  const localeConfig = React.useMemo(() => {
    return generateLocaleDateConfig(effectiveLocale)
  }, [effectiveLocale])

  return localeConfig
}
