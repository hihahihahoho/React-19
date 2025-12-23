"use client"

import useScrollPosition from "@/hooks/use-scroll-position"
import { useSyncScroll } from "@/hooks/use-sync-scroll"
import { cn } from "@/lib/utils"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useDataTable } from "./data-table-context"
import { DataTableHeaderCell } from "./data-table-header-cell"
import { useHeaderRefs } from "./header-ref-context"
import { Table, TableHeader, TableRow } from "./table"

interface FloatingHeaderProps {
  tableRef: React.RefObject<HTMLDivElement | null>
  headerRef: React.RefObject<HTMLTableSectionElement | null>
  fixedHeaderOffset?: string
  mainScrollRef: React.RefObject<HTMLDivElement | null>
  autoWidthTable?: boolean
}

export function FloatingHeader({
  tableRef,
  headerRef,
  fixedHeaderOffset,
  mainScrollRef,
  autoWidthTable = false,
}: FloatingHeaderProps) {
  const { table, setColumnPinning } = useDataTable()
  const { headerRefs } = useHeaderRefs()
  const [showClonedHeader, setShowClonedHeader] = useState(false)
  const [tableOffset, setTableOffset] = useState({ left: 0, width: 0 })
  const syncWithScrollRef = useRef<HTMLDivElement>(null)
  const { isReachLeft, isReachRight } = useScrollPosition(syncWithScrollRef)

  // Use refs to track previous values and avoid unnecessary state updates
  const prevOffsetRef = useRef({ left: 0, width: 0 })

  useSyncScroll(syncWithScrollRef, mainScrollRef)

  // Unified offset updater with comparison to avoid unnecessary state updates
  const updateTableOffset = useCallback(() => {
    if (tableRef.current) {
      const rect = tableRef.current.getBoundingClientRect()
      const newLeft = rect.left + window.scrollX
      const newWidth = rect.width

      // Only update state if values actually changed (with small threshold for floating point)
      if (
        Math.abs(prevOffsetRef.current.left - newLeft) > 1 ||
        Math.abs(prevOffsetRef.current.width - newWidth) > 1
      ) {
        prevOffsetRef.current = { left: newLeft, width: newWidth }
        setTableOffset({ left: newLeft, width: newWidth })
      }
    }
  }, [tableRef])

  // Handle scroll and resize events
  useEffect(() => {
    let isHeaderVisible = false
    let ticking = false
    let resizeTicking = false
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

            // Only update position when header is visible AND position changed
            if (shouldShowHeader) {
              updateTableOffset()
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    // Set up resize observer for the table with separate throttling
    if (tableRef.current) {
      resizeObserver = new ResizeObserver(() => {
        // Separate throttling for resize to avoid blocking scroll
        if (!resizeTicking) {
          window.requestAnimationFrame(() => {
            updateTableOffset()
            resizeTicking = false
          })
          resizeTicking = true
        }
      })
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

  // Memoize header groups to prevent unnecessary re-renders
  const headerGroups = React.useMemo(() => table.getHeaderGroups(), [table])

  return (
    <div
      className={cn(
        "bg-background fixed top-0 z-30 overflow-hidden border-b-0",
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
            minWidth: !autoWidthTable
              ? table.getVisibleFlatColumns().length * 120
              : undefined,
          }}
          className={cn("table-fixed", autoWidthTable && "w-auto")}
        >
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const domNode = headerRefs.current.get(header.column.id)
                  const width = domNode?.offsetWidth || 0

                  return (
                    <DataTableHeaderCell
                      key={header.id}
                      header={header}
                      setColumnPinning={setColumnPinning}
                      width={width}
                      isRegisterHeaderRef={false}
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
