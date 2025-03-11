import { initializeTheme, useThemeStore } from "@/stores/use-theme-store"
import React from "react"

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()

  React.useEffect(() => {
    initializeTheme()
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return children
}

export { ThemeProvider }
