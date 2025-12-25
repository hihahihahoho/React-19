/**
 * Mock for next/navigation in Storybook
 * This file provides mock implementations of Next.js navigation hooks
 * for use in Storybook where the real Next.js router context isn't available.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

// ============================================================================
// Types
// ============================================================================

interface NavigationContextValue {
  searchParams: URLSearchParams
  pathname: string
  setUrl: (url: string) => void
}

// ============================================================================
// Context
// ============================================================================

const NavigationContext = createContext<NavigationContextValue | null>(null)

// ============================================================================
// Provider (use this in Storybook preview.tsx)
// ============================================================================

export function NextNavigationMockProvider({
  children,
  initialUrl = "/storybook",
}: {
  children: React.ReactNode
  initialUrl?: string
}) {
  const [url, setUrl] = useState(initialUrl)

  const searchParams = useMemo(() => {
    try {
      const urlObj = new URL(url, "http://localhost")
      return urlObj.searchParams
    } catch {
      return new URLSearchParams()
    }
  }, [url])

  const pathname = useMemo(() => {
    try {
      const urlObj = new URL(url, "http://localhost")
      return urlObj.pathname
    } catch {
      return "/storybook"
    }
  }, [url])

  return (
    <NavigationContext.Provider value={{ searchParams, pathname, setUrl }}>
      {children}
    </NavigationContext.Provider>
  )
}

// ============================================================================
// Hooks (these match next/navigation API)
// ============================================================================

export function useSearchParams(): URLSearchParams {
  const context = useContext(NavigationContext)
  if (!context) {
    // Fallback when used outside provider
    return new URLSearchParams()
  }
  return context.searchParams
}

export function usePathname(): string {
  const context = useContext(NavigationContext)
  if (!context) {
    return "/storybook"
  }
  return context.pathname
}

export function useRouter() {
  const context = useContext(NavigationContext)

  const push = useCallback(
    (url: string, _options?: { scroll?: boolean }) => {
      if (context) {
        context.setUrl(url)
      }
    },
    [context]
  )

  const replace = useCallback(
    (url: string, _options?: { scroll?: boolean }) => {
      if (context) {
        context.setUrl(url)
      }
    },
    [context]
  )

  return {
    push,
    replace,
    back: () => {},
    forward: () => {},
    refresh: () => {},
    prefetch: () => Promise.resolve(),
  }
}

// ReadonlyURLSearchParams type (matches Next.js)
export type ReadonlyURLSearchParams = URLSearchParams
