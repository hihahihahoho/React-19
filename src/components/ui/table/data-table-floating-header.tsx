import useScrollPosition from "@/hooks/use-scroll-position"
import { useSyncScroll } from "@/hooks/use-sync-scroll"
import { cn } from "@/lib/utils"
import React, { useCallback, useEffect, useRef, useState } from "react"
// import { useSidebar } from "../sidebar"
import { useDataTable } from "./data-table-context"
import { DataTableHeaderCell } from "./data-table-header-cell"
import { useHeaderRefs } from "./header-ref-context"
import { Table, TableHeader, TableRow } from "./table"

interface FloatingHeaderProps {
  tableRef: React.RefObject<HTMLDivElement | null>
  headerRef: React.RefObject<HTMLTableSectionElement | null>
  fixedHeaderOffset?: string
  mainScrollRef: React.RefObject<HTMLDivElement | null>
}

export function FloatingHeader({
  tableRef,
  headerRef,
  fixedHeaderOffset,
  mainScrollRef,
}: FloatingHeaderProps) {
  const { table, setColumnPinning } = useDataTable()
  const { headerRefs } = useHeaderRefs()
  // const { state, isMobile } = useSidebar()
  const [showClonedHeader, setShowClonedHeader] = useState(false)
  const [tableOffset, setTableOffset] = useState({ left: 0, width: 0 })
  const syncWithScrollRef = useRef<HTMLDivElement>(null)
  const { isReachLeft, isReachRight } = useScrollPosition(syncWithScrollRef)

  useSyncScroll(syncWithScrollRef, mainScrollRef)

  // Unified offset updater
  const updateTableOffset = useCallback(() => {
    if (tableRef.current) {
      const rect = tableRef.current.getBoundingClientRect()
      setTableOffset({
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }, [tableRef])

  // Handle scroll and resize events
  useEffect(() => {
    let isHeaderVisible = false
    let ticking = false
    let resizeObserver: ResizeObserver | undefined

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (tableRef.current && headerRef.current) {
            const tableRect = tableRef.current.getBoundingClientRect()
            const headerRect = headerRef.current.getBoundingClientRect()
            const shouldShowHeader =
              tableRect.top < 0 && tableRect.bottom > headerRect.height

            if (shouldShowHeader !== isHeaderVisible) {
              isHeaderVisible = shouldShowHeader
              setShowClonedHeader(shouldShowHeader)
            }

            // Always update position when scrolling
            if (shouldShowHeader) {
              updateTableOffset()
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    // Set up resize observer for the table
    if (tableRef.current) {
      resizeObserver = new ResizeObserver(updateTableOffset)
      resizeObserver.observe(tableRef.current)
    }

    // Set initial position
    updateTableOffset()

    // Set up event listeners
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", updateTableOffset)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", updateTableOffset)
      resizeObserver?.disconnect()
    }
  }, [tableRef, headerRef, updateTableOffset])

  return (
    <div
      className={cn(
        "fixed top-0 z-30 overflow-hidden border-b-0 bg-background shadow-md",
        // state === "collapsed" && "top-12",
        // state === "expanded" && "top-16",
        // isMobile && "top-16",
        fixedHeaderOffset
      )}
      style={{
        visibility: showClonedHeader ? "visible" : "hidden",
        transform: "translateY(0)",
        width: `${tableOffset.width}px`,
        left: `${tableOffset.left}px`,
      }}
    >
      <div
        ref={syncWithScrollRef}
        className={cn("w-full", {
          "is-reach-left": !isReachLeft,
          "is-reach-right": !isReachRight,
        })}
      >
        <Table
          style={{
            minWidth: table.getVisibleFlatColumns().length * 120 || "none",
          }}
          className="table-fixed"
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const domNode = headerRefs.current.get(header.column.id)
                  const width = domNode?.offsetWidth || 0

                  return (
                    <DataTableHeaderCell
                      key={header.id}
                      header={header}
                      setColumnPinning={setColumnPinning}
                      width={width}
                    />
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
        </Table>
      </div>
    </div>
  )
}
