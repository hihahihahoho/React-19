import { create } from "zustand"
import { persist } from "zustand/middleware"

type ThemeState = {
  theme: "light" | "dark"
  toggleTheme: () => void
  setTheme: (theme: "light" | "dark") => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
    }
  )
)

// Optional: Initialize theme based on system preference
export const initializeTheme = () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  useThemeStore.getState().setTheme(prefersDark ? "dark" : "light")
}
