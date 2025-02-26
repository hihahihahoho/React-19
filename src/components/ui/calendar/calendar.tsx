"use client";

import { ChevronLeft } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "react-day-picker/locale";
import { buttonVariants } from "../button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={vi}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      formatters={{
        formatCaption: (date, options) => {
          const formattedMonth = format(date, "M", options);
          const formattedYear = format(date, "yyyy", options);
          return "Tháng " + formattedMonth + " " + formattedYear;
        },
        formatWeekdayName: (weekNumber) =>
          format(weekNumber, "eeeee", { locale: vi }),
      }}
      classNames={{
        months: "flex flex-row justify-center gap-2",
        month: "gap-4 flex flex-col items-center", // changed from month
        month_caption: "flex justify-center pt-1 items-center", // changed from caption
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex justify-between z-10  absolute w-full left-0 px-3", // changed from nav
        button_previous: cn(
          // changed from nav_button
          buttonVariants({
            variant: "outline",
            className: "h-7 w-7 p-0 min-w-7 absolute left-3",
          })
        ),
        button_next: cn(
          buttonVariants({
            variant: "outline",
            className: "h-7 w-7 p-0 min-w-7 absolute right-3",
          })
        ), // changed from nav_button_next
        month_grid: "w-full border-collapse border-0 space-y-1", // changed from table
        weekdays: "flex", // changed from head_row
        weekday:
          "text-muted-foreground rounded-md w-9 md:w-8 font-normal text-[0.8rem]", // changed from head_cell
        week: "flex w-full mt-2", // changed from row
        day_button: cn(
          // cell is now day
          "size-9 md:size-8 text-center text-sm p-0 relative [&:has([aria-selected].range-end)]:rounded-r-md [&:has([aria-selected].outside)]:bg-primary/50 [&:has([aria-selected])]:bg-primary first:[&:has([aria-selected])]:rounded-l-md focus-within:relative focus-within:z-20 min-w-0"
        ),
        day: "border-0 p-0 hover:bg-accent rounded-md size-9 md:size-8 last:rounded-r-md first:rounded-l-md [&:has(+_.invisible[aria-selected])]:rounded-r-md", // changed from cell
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
      }}
      fixedWeeks
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
