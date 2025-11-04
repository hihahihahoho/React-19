"use client"

import { flexRender } from "@tanstack/react-table"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { SelectCommand } from "@/components/ui/select/select-command"
import { SelectItems } from "@/components/ui/select/select-interface"
import { SelectPopover } from "@/components/ui/select/select-popover"
import { Grid7 } from "iconsax-reactjs"
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
    <SelectPopover
      open={open}
      setOpen={setOpen}
      triggerContent={
        <Button
          className="txt-body-default-medium text-muted-foreground font-[Inter] normal-case"
          size={"sm"}
          variant="outline"
        >
          Ẩn/Hiện cột ({visibleColumns.length})
          <Grid7 />
        </Button>
      }
      popoverContentProps={{
        align: "end",
      }}
      label="Ẩn/Hiện cột"
    >
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
    </SelectPopover>
  )
}

export { ShowHideColumnButton }
