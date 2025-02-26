"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowRightIcon, CalendarDays } from "lucide-react";
import * as React from "react";
import {
  CalendarRange,
  CalendarRangeProps,
  DateRange,
} from "../calendar/calendar-range";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../drawer";
import {
  FormComposition,
  FormCompositionProps,
  FormControlButton,
} from "../form/form";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Separator } from "../separator";

export type OnValueChangeDateRangePicker = DateRange | undefined;

export interface DateRangePickerProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "placeholder" | "defaultValue"
  > {
  placeholder?: string | React.ReactNode;
  placeholderColor?: string;
  disabled?: boolean;
  dateFormat?: string;
  defaultValue?: DateRange;
  value?: DateRange | null;
  onValueChange?: (value: OnValueChangeDateRangePicker) => void;
  formComposition?: FormCompositionProps;
  calendarProps?: CalendarRangeProps;
}

const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (props, ref) => {
    const {
      placeholder = (
        <div className="flex gap-2 items-center">
          dd/mm/yyyy
          <ArrowRightIcon />
          dd/mm/yyyy
        </div>
      ),
      placeholderColor = "text-muted-foreground",
      disabled = false,
      dateFormat = "dd/MM/yyyy",
      defaultValue,
      value,
      onValueChange,
      formComposition,
      className,
      calendarProps,
    } = props;

    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [open, setOpen] = React.useState(false);

    const [internalRange, setInternalRange] = React.useState<
      DateRange | undefined
    >(defaultValue);

    const currentRange = value ?? internalRange;

    const handleSelect = React.useCallback(
      (range: DateRange | undefined) => {
        setInternalRange(range);
        onValueChange?.(range);
      },
      [onValueChange]
    );

    const handleClear = React.useCallback(() => {
      setInternalRange(undefined);
      onValueChange?.(undefined);
      formComposition?.onClear?.();
    }, [onValueChange, formComposition]);

    const fromFormatted =
      value === null
        ? undefined
        : currentRange?.from
        ? format(currentRange.from, dateFormat)
        : "";
    const toFormatted =
      value === null
        ? undefined
        : currentRange?.to
        ? format(currentRange.to, dateFormat)
        : "";
    const displayRange =
      fromFormatted || toFormatted ? (
        <>
          {fromFormatted}
          {fromFormatted && toFormatted ? (
            <ArrowRightIcon className="text-muted-foreground" />
          ) : (
            ""
          )}
          {toFormatted}
        </>
      ) : (
        ""
      );

    const hasValue = Boolean(fromFormatted || toFormatted);
    const triggerContent = (
      <FormComposition
        {...formComposition}
        asChild
        ref={ref}
        clearWhenNotFocus
        disabled={disabled}
        hasValue={hasValue}
        onClear={handleClear}
        iconLeft={<CalendarDays />}
        className={cn("cursor-pointer", formComposition?.className)}
      >
        <FormControlButton disabled={disabled}>
          <div className={cn("flex items-center h-full flex-1", className)}>
            {hasValue ? (
              <span className="flex items-center gap-2">{displayRange}</span>
            ) : (
              <span className={cn(placeholderColor)}>{placeholder}</span>
            )}
          </div>
        </FormControlButton>
      </FormComposition>
    );

    const calendarRangeContent = (
      <CalendarRange
        setOpen={setOpen}
        selectedRange={currentRange}
        onValueChange={
          !calendarProps?.showConfirmButton
            ? handleSelect
            : calendarProps?.onValueChange
        }
        onConfirm={
          calendarProps?.showConfirmButton
            ? handleSelect
            : calendarProps?.onConfirm
        }
        {...calendarProps}
      />
    );

    return (
      <>
        {isDesktop ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{triggerContent}</PopoverTrigger>
            <PopoverContent
              align="start"
              className="p-0"
              style={{ width: "auto" }}
            >
              {calendarRangeContent}
            </PopoverContent>
          </Popover>
        ) : (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{triggerContent}</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                {formComposition?.label && (
                  <DrawerTitle>{formComposition?.label}</DrawerTitle>
                )}
              </DrawerHeader>
              <Separator />
              {calendarRangeContent}
            </DrawerContent>
          </Drawer>
        )}
      </>
    );
  }
);

DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };
