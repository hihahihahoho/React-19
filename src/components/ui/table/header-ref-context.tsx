"use client"

import React from "react"

type HeaderRefsContextType = {
  headerRefs: React.MutableRefObject<Map<string, HTMLElement>>
  registerHeaderRef: (columnId: string, ref: HTMLElement) => void
  unregisterHeaderRef: (columnId: string) => void
}

const HeaderRefsContext = React.createContext<HeaderRefsContextType>({
  headerRefs: { current: new Map() },
  registerHeaderRef: () => {},
  unregisterHeaderRef: () => {},
})

const useHeaderRefs = () => React.useContext(HeaderRefsContext)

function HeaderRefsProvider({ children }: { children: React.ReactNode }) {
  const headerRefs = React.useRef(new Map<string, HTMLElement>())

  const registerHeaderRef = React.useCallback(
    (columnId: string, ref: HTMLElement) => {
      headerRefs.current.set(columnId, ref)
    },
    []
  )

  const unregisterHeaderRef = React.useCallback((columnId: string) => {
    headerRefs.current.delete(columnId)
  }, [])

  return (
    <HeaderRefsContext.Provider
      value={{ headerRefs, registerHeaderRef, unregisterHeaderRef }}
    >
      {children}
    </HeaderRefsContext.Provider>
  )
}

export { HeaderRefsProvider, useHeaderRefs }
