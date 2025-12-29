"use client"

import { flexRender } from "@tanstack/react-table"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverHeader,
  ResponsivePopoverTitle,
  ResponsivePopoverTrigger,
} from "@/components/ui/responsive-popover"
import { SelectCommand } from "@/components/ui/select/select-command"
import { SelectItems } from "@/components/ui/select/select-interface"
import { Grid } from "lucide-react"
import { useDataTable } from "./data-table-context"

function ShowHideColumnButton() {
  const { table } = useDataTable()
  const [open, setOpen] = useState(false)

  const columns = table
    .getAllColumns()
    .filter((column) => column.getCanHide())
    .map((column) => {
      const header = column.columnDef.header
      const headerText =
        typeof header === "string"
          ? header
          : typeof header === "function"
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              flexRender(header, { column, header: column as any, table })
            : column.id

      return {
        value: column.id,
        label: headerText,
      } as SelectItems
    })

  const visibleColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide() && column.getIsVisible())
    .map((column) => column.id)

  return (
    <ResponsivePopover open={open} onOpenChange={setOpen}>
      <ResponsivePopoverTrigger asChild>
        <Button
          className="txt-body-default-medium text-muted-foreground font-[Inter] normal-case"
          size={"sm"}
          variant="outline"
        >
          Ẩn/Hiện cột ({visibleColumns.length})
          <Grid />
        </Button>
      </ResponsivePopoverTrigger>
      <ResponsivePopoverContent
        data-slot="select-popover-content"
        align="end"
        className="popover-content-width-full p-0"
        onWheel={(e) => e.stopPropagation()}
      >
        <ResponsivePopoverHeader className="border-b sm:hidden">
          <ResponsivePopoverTitle>Ẩn/Hiện cột</ResponsivePopoverTitle>
        </ResponsivePopoverHeader>
        <SelectCommand
          items={[
            {
              heading: "Cột",
              options: columns,
              isMultiSelect: true,
            },
          ]}
          selected={visibleColumns}
          setSelected={(values) => {
            table.getAllColumns().forEach((column) => {
              if (column.getCanHide()) {
                column.toggleVisibility(values.includes(column.id))
              }
            })
          }}
          showSearch={columns.length > 5}
          isCheckAll={true}
          commandInputProps={{
            placeholder: "Tìm cột...",
          }}
        />
      </ResponsivePopoverContent>
    </ResponsivePopover>
  )
}

export { ShowHideColumnButton }
