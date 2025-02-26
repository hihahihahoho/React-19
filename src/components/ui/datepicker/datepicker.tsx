"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { MaskitoDateMode } from "@maskito/kit";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { useCallback, useRef, useState } from "react";
import { Button } from "../button";
import { Calendar } from "../calendar/calendar";
import {
  DateTimeInput,
  DateTimeInputHandle,
} from "../date-time-input/date-time-input";
import { DateGroup } from "../date-time-input/date-time-input-group";
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
  FormControl,
  FormControlButton,
} from "../form/form";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../popover";

export type OnValueChangeDatePicker = Date | undefined;

export interface DatePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "placeholder" | "defaultValue"
  > {
  placeholder?: string | React.ReactNode;
  placeholderColor?: string;
  defaultValue?: Date;
  value?: Date | null;
  formComposition?: FormCompositionProps;
  editable?: boolean;
  dateFormat?: MaskitoDateMode;
  calendarProps?: React.ComponentProps<typeof Calendar>;
  inputTime?: boolean;
  onValueChange?: (value: OnValueChangeDatePicker) => void;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      dateFormat = "dd/mm/yyyy",
      placeholder = "dd/mm/yyyy",
      placeholderColor = "text-muted-foreground",
      value,
      className,
      disabled = false,
      formComposition,
      editable = false,
      onValueChange,
      calendarProps,
      defaultValue,
      inputTime = false,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const internalRef = useRef<HTMLInputElement>(null);
    const DateTimeInputRef = useRef<DateTimeInputHandle>(null);
    const calendarButtonRef = useRef<HTMLButtonElement>(null);
    const convertedDateFormat = dateFormat.replace("mm", "MM");
    const [isInvalid, setIsInvalid] = useState(false);

    const [internalDate, setInternalDate] = useState<OnValueChangeDatePicker>(
      (defaultValue as Date) || undefined
    );

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const handleChange = useCallback(
      (value: Date | "invalid" | undefined) => {
        if (value && value !== "invalid") {
          setInternalDate(value);
          onValueChange?.(value);
          setIsInvalid(false);
        } else if (value === "invalid") {
          setInternalDate(undefined);
          onValueChange?.(undefined);
          setIsInvalid(true);
        } else {
          setIsInvalid(false);
          setInternalDate(undefined);
          onValueChange?.(undefined);
        }
      },
      [onValueChange]
    );

    const handleCalendarSelect = useCallback(
      (date: Date | undefined) => {
        if (date) {
          // Preserve the time component from the existing date if available
          if (internalDate || value) {
            const currentDate = internalDate || value;
            date = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              currentDate?.getHours(),
              currentDate?.getMinutes(),
              currentDate?.getSeconds(),
              currentDate?.getMilliseconds()
            );
          }

          setInternalDate(date);
          onValueChange?.(date);
          if (internalRef.current)
            internalRef.current.value = format(date, convertedDateFormat);
        } else {
          setInternalDate(undefined);
          onValueChange?.(undefined);
        }
        setOpen(false);
      },
      [onValueChange, convertedDateFormat, internalDate, value]
    );

    const handleClear = useCallback(() => {
      if (internalRef.current) {
        internalRef.current.value = "";
        internalRef.current.focus();
      }
      setInternalDate(undefined);
      setIsInvalid(false);
      onValueChange?.(undefined);
      formComposition?.onClear?.();
      DateTimeInputRef.current?.clear();
    }, [formComposition, onValueChange]);

    const currentDate = value === null ? undefined : value || internalDate;
    const currentInputValue = currentDate
      ? format(currentDate, convertedDateFormat)
      : "";
    const hasValue = Boolean(currentDate || isInvalid);

    React.useEffect(() => {
      if (value === null && !isInvalid) {
        DateTimeInputRef.current?.clear();
      }
    }, [value, isInvalid]);

    const triggerContent = (
      <FormComposition
        {...formComposition}
        asChild={!editable}
        clearWhenNotFocus={editable ? false : true}
        className={cn(
          !editable && "cursor-pointer",
          formComposition?.className
        )}
        hasValue={hasValue}
        onClear={handleClear}
        iconLeft={!editable && <CalendarIcon />}
        disabled={disabled}
        isFocused={isFocused}
        focusWithin={editable}
        onFormCompositionClick={() => {
          DateTimeInputRef.current?.focus();
        }}
        suffixNotFocusInput={
          editable
            ? {
                element: (
                  <Button
                    ref={calendarButtonRef}
                    onClick={() => setOpen(!open)}
                    size="xs"
                    variant="outline"
                    iconOnly
                    disabled={disabled}
                    className="-mr-1"
                  >
                    <CalendarIcon />
                  </Button>
                ),
              }
            : undefined
        }
      >
        {editable ? (
          <div className={cn("flex items-center h-full flex-1", className)}>
            <FormControl>
              <DateGroup
                ref={ref}
                onFocusWithin={handleFocus}
                onBlurWithin={handleBlur}
              >
                <DateTimeInput
                  disabled={disabled}
                  granularity={inputTime ? "datetime" : "date"}
                  ref={DateTimeInputRef}
                  locale="en-GB"
                  value={currentDate}
                  onValueChange={handleChange}
                />
              </DateGroup>
            </FormControl>
          </div>
        ) : (
          <FormControlButton disabled={disabled}>
            <div className={cn("flex items-center h-full flex-1", className)}>
              {currentInputValue ? (
                <span>{currentInputValue}</span>
              ) : (
                <span className={cn(placeholderColor)}>{placeholder}</span>
              )}
            </div>
          </FormControlButton>
        )}
      </FormComposition>
    );

    const calendarContent = (
      <Calendar
        {...calendarProps}
        defaultMonth={currentDate}
        mode="single"
        selected={currentDate}
        onSelect={handleCalendarSelect}
      />
    );

    return (
      <>
        {editable && triggerContent}
        {isDesktop ? (
          <Popover open={open} onOpenChange={setOpen}>
            {editable && <PopoverAnchor virtualRef={calendarButtonRef} />}
            <PopoverTrigger asChild>
              {!editable && triggerContent}
            </PopoverTrigger>
            <PopoverContent
              onInteractOutside={(e) => {
                if (editable) {
                  if (
                    calendarButtonRef.current &&
                    calendarButtonRef.current.contains(e.target as Node)
                  ) {
                    e.preventDefault();
                  } else {
                    setOpen(false);
                  }
                }
              }}
              align={editable ? "end" : "start"}
              className="p-0"
              style={{ width: "auto" }}
            >
              {calendarContent}
            </PopoverContent>
          </Popover>
        ) : (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{!editable && triggerContent}</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                {formComposition?.label && (
                  <DrawerTitle>{formComposition?.label}</DrawerTitle>
                )}
              </DrawerHeader>
              <div className="border-t">{calendarContent}</div>
            </DrawerContent>
          </Drawer>
        )}
      </>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };
