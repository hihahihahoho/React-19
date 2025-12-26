"use client"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "../button"
import { useDataTable } from "./data-table-context"

function DataTableSelection({
  children,
  className,
}: React.ComponentProps<"div">) {
  const { table } = useDataTable()
  const selectedCount = table.getSelectedRowModel().rows.length
  const isVisible = selectedCount > 0

  return (
    <div
      data-state={isVisible ? "visible" : "hidden"}
      className={cn(
        "pointer-events-none sticky inset-x-0 bottom-24 z-50 flex items-center justify-center", // Sticky positioning
        "transition-all duration-100 ease-in-out",
        "data-[state=hidden]:translate-y-1/10 data-[state=hidden]:opacity-0",
        "data-[state=visible]:pointer-events-auto data-[state=visible]:translate-y-0 data-[state=visible]:opacity-100",
        className
      )}
    >
      <div
        className={cn(
          "bg-background flex items-center gap-1 rounded-full border shadow-xl",
          "p-2"
        )}
      >
        <div className="flex gap-1">
          <Button
            onClick={() => table.toggleAllRowsSelected(false)}
            variant="ghost"
            iconOnly
            isRounded
          >
            <X className="size-4" />
            <span className="sr-only">Bỏ chọn</span>
          </Button>
        </div>
        <span className="text-foreground text-sm font-medium whitespace-nowrap">
          {selectedCount}{" "}
          <span className="text-muted-foreground pr-2 font-normal">
            đã chọn
          </span>
        </span>
        {children && (
          <>
            <div className="bg-border mr-2 h-4 w-px" />
            <div className="flex gap-1">{children}</div>
          </>
        )}
      </div>
    </div>
  )
}

export { DataTableSelection }
