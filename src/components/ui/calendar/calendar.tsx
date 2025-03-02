"use client";

import { ChevronLeft } from "lucide-react";
import * as React from "react";
import { DayPicker, DropdownNavProps, DropdownProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { vi } from "react-day-picker/locale";
import { buttonVariants } from "../button";
import { Select } from "../select/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  localeString?: string;
};

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
    } as React.ChangeEvent<HTMLSelectElement>;
    _e(_event);
  };
  return (
    <DayPicker
      locale={
        localeString === "vi" || localeString === "vi-VN" ? vi : undefined
      }
      showOutsideDays={showOutsideDays}
      captionLayout="dropdown"
      className={cn("p-3", className)}
      // formatters={{
      //   formatCaption: (date, options) => {
      //     const formattedMonth = format(date, "M", options);
      //     const formattedYear = format(date, "yyyy", options);
      //     return "Tháng " + formattedMonth + " " + formattedYear;
      //   },
      //   formatWeekdayName: (weekNumber) =>
      //     format(weekNumber, "eeeee", { locale: vi }),
      // }}
      classNames={{
        months: "flex flex-row justify-center gap-5",
        month: "gap-4 flex flex-col items-center", // changed from month
        month_caption: "flex justify-center items-center", // changed from caption
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex justify-between z-10  absolute w-full left-0 px-3", // changed from nav
        button_previous: cn(
          // changed from nav_button
          buttonVariants({
            variant: "outline",
            className: "size-8 p-0 min-w-7 absolute left-3",
          })
        ),
        button_next: cn(
          buttonVariants({
            variant: "outline",
            className: "size-8 p-0 min-w-7 absolute right-3",
          })
        ), // changed from nav_button_next
        month_grid: "w-full border-collapse border-0 space-y-1", // changed from table
        weekdays: "flex", // changed from head_row
        weekday:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]", // changed from head_cell
        week: "flex w-full mt-2", // changed from row
        day_button: cn(
          // cell is now day
          "size-9 text-center text-sm p-0 relative [&:has([aria-selected].range-end)]:rounded-r-md [&:has([aria-selected].outside)]:bg-primary/50 [&:has([aria-selected])]:bg-primary first:[&:has([aria-selected])]:rounded-l-md focus-within:relative focus-within:z-20 min-w-0"
        ),
        day: "border-0 p-0 hover:bg-accent rounded-md size-9 last:rounded-r-md first:rounded-l-md [&:has(+_.invisible[aria-selected])]:rounded-r-md", // changed from cell
        range_middle:
          "range-middle rounded-none bg-primary/10 !text-foreground hover:bg-primary/10 [&.invisible+.range-middle]:rounded-l-md [&:has(+_.invisible)]:rounded-r-md", // changed from day_range_middle
        range_end:
          "range-end !bg-primary !text-primary-foreground rounded-r-md rounded-l-none", // changed from day_range_end
        range_start:
          "range-start !bg-primary !text-primary-foreground rounded-r-none rounded-l-md", // changed from day_range_start
        selected:
          "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md hover:bg-primary hover:text-primary-foreground", // changed from day_selected
        today: "bg-accent", // changed from day_today
        outside:
          "outside text-muted-foreground opacity-50 aria-selected:bg-primary/50 aria-selected:text-muted-foreground aria-selected:opacity-30", // changed from day_outside
        disabled: "text-muted-foreground opacity-50", // changed from day_disabled
        hidden: "invisible", // changed from day_hidden
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
          );
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
                  handleCalendarChange(parseInt(value) - 1, props.onChange);
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
          );
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
                  handleCalendarChange(value, props.onChange);
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
          );
        },
      }}
      fixedWeeks
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
