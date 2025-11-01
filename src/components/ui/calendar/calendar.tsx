"use client"

import { ChevronLeft } from "lucide-react"
import * as React from "react"
import { DayPicker, DropdownNavProps, DropdownProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { vi } from "react-day-picker/locale"
import { buttonVariants } from "../button"
import { Select } from "../select/select"
import "./calendar.css"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  localeString?: string
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  localeString,
  ...props
}: CalendarProps) {
  const handleCalendarChange = (
    _value: string | number,
    _e: React.ChangeEventHandler<HTMLSelectElement>
  ) => {
    const _event = {
      target: {
        value: String(_value),
      },
    } as React.ChangeEvent<HTMLSelectElement>
    _e(_event)
  }
  return (
    <DayPicker
      animate
      locale={
        localeString === "vi" || localeString === "vi-VN" ? vi : undefined
      }
      showOutsideDays={showOutsideDays}
      captionLayout="dropdown"
      className={cn("p-3", className)}
      footer={true}
      classNames={{
        months: "flex flex-row justify-center gap-5",
        month: "flex flex-col items-center gap-4", // changed from month
        month_caption: "flex items-center justify-center", // changed from caption
        caption_label: "text-sm font-medium",
        nav: "absolute left-0 z-10 flex w-full justify-between space-x-1 px-3", // changed from nav
        month_grid: "w-full border-collapse space-y-1 border-0", // changed from table
        weekdays: "flex", // changed from head_row
        weekday:
          "text-muted-foreground w-9 rounded-md text-[0.8rem] font-normal", // changed from head_cell
        week: "mt-2 flex w-full", // changed from row
        day_button: cn(
          // cell is now day
          "[&:has([aria-selected])]:bg-primary [&:has([aria-selected].outside)]:bg-primary/50 relative size-9 min-w-0 p-0 text-center text-sm focus-within:relative focus-within:z-20 first:[&:has([aria-selected])]:rounded-l-md [&:has([aria-selected].range-end)]:rounded-r-md"
        ),
        day: "hover:bg-accent size-9 rounded-md border-0 p-0 first:rounded-l-md last:rounded-r-md [&:has(+_.invisible[aria-selected])]:rounded-r-md", // changed from cell
        range_middle:
          "range-middle bg-primary/10 text-foreground! hover:bg-primary/10 rounded-none [&.invisible+.range-middle]:rounded-l-md [&:has(+_.invisible)]:rounded-r-md", // changed from day_range_middle
        range_end:
          "range-end bg-primary! text-primary-foreground! rounded-l-none rounded-r-md", // changed from day_range_end
        range_start:
          "range-start bg-primary! text-primary-foreground! rounded-l-md rounded-r-none", // changed from day_range_start
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md", // changed from day_selected
        today: "bg-accent", // changed from day_today
        outside:
          "outside text-muted-foreground aria-selected:bg-primary/50 aria-selected:text-muted-foreground opacity-50 aria-selected:opacity-30", // changed from day_outside
        disabled: "text-muted-foreground opacity-50", // changed from day_disabled
        hidden: "invisible", // changed from day_hidden
        button_previous: cn(
          // changed from nav_button
          buttonVariants({
            variant: "outline",
            className: "absolute left-3 size-8 min-w-7 p-0",
          })
        ),
        button_next: cn(
          buttonVariants({
            variant: "outline",
            className: "absolute right-3 size-8 min-w-7 p-0",
          })
        ), // changed from nav_button_next
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => (
          <ChevronLeft
            className={cn("transform", orientation === "right" && "rotate-180")}
          />
        ),
        DropdownNav: (props: DropdownNavProps) => {
          return (
            <div className="flex w-full items-center justify-center gap-2 [&>span]:text-sm [&>span]:font-medium">
              {props.children}
            </div>
          )
        },
        MonthsDropdown: (props: DropdownProps) => {
          return props.options ? (
            <Select
              options={
                props.options.map((option) => ({
                  value: (option.value + 1).toString(),
                  label:
                    localeString === "vi" || localeString === "vi-VN" ? (
                      <>Tháng {option.value + 1}</>
                    ) : (
                      option.label
                    ),
                  disabled: option.disabled,
                })) || []
              }
              value={String((props.value as number) + 1)}
              onValueChange={(value) => {
                if (props.onChange && value) {
                  handleCalendarChange(parseInt(value) - 1, props.onChange)
                }
              }}
              formComposition={{
                showErrorMsg: false,
                size: "sm",
                className: "px-1.5",
              }}
            />
          ) : (
            <></>
          )
        },
        YearsDropdown: (props: DropdownProps) => {
          return props.options ? (
            <Select
              options={
                props.options.map((option) => ({
                  value: option.value.toString(),
                  label: option.label,
                  disabled: option.disabled,
                })) || []
              }
              value={String(props.value)}
              onValueChange={(value) => {
                if (props.onChange && value) {
                  handleCalendarChange(value, props.onChange)
                }
              }}
              formComposition={{
                showErrorMsg: false,
                size: "sm",
                className: "px-1.5",
              }}
            />
          ) : (
            <></>
          )
        },
      }}
      fixedWeeks
      {...props}
    />
  )
}

export { Calendar }
