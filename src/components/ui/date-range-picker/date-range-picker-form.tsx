"use client";

import { isBefore } from "date-fns";
import {
  ControllerProps,
  FieldPath,
  FieldValues,
  useWatch,
} from "react-hook-form";
import { FormField } from "../form/form";
import { useZodSchema } from "../form/zod-schema-context";
import {
  DateRangePicker,
  DateRangePickerProps,
  OnValueChangeDateRangePicker,
} from "./date-range-picker"; // <-- Update import to your actual path

type JsonSchemaType = {
  isRequired: boolean;
  description?: string;
};

type JsonDescriptionType = {
  minDate?: Date;
  maxDate?: Date;
  minRange?: number;
  maxRange?: number;
};

export interface DateRangePickerFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends ControllerProps<TFieldValues, TName>,
    Omit<
      DateRangePickerProps,
      "defaultValue" | "name" | "value" | "onValueChange"
    > {}

const DateRangePickerForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  name,
  control,
  ...props
}: Omit<DateRangePickerFormProps<TFieldValues, TName>, "render">) => {
  const fieldValue = useWatch({
    control,
    name: name,
  });

  const { getJsonSchema } = useZodSchema();
  const { isRequired, description }: JsonSchemaType = getJsonSchema(name);

  const jsonDescription: JsonDescriptionType = JSON.parse(description || "{}");

  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { onChange, ...field } }) => {
        const handleClear = () => {
          onChange(undefined);
          props.formComposition?.onClear?.();
        };

        const handleValueChange = (newRange: OnValueChangeDateRangePicker) => {
          onChange(newRange);
        };

        return (
          <DateRangePicker
            {...field}
            value={fieldValue ?? null}
            onValueChange={handleValueChange}
            {...props}
            calendarProps={{
              minRange: jsonDescription.minRange,
              maxRange: jsonDescription.maxRange,
              disabled: (date) => {
                if (
                  jsonDescription.minDate &&
                  isBefore(date, jsonDescription.minDate)
                ) {
                  return true;
                }
                if (
                  jsonDescription.maxDate &&
                  isBefore(jsonDescription.maxDate, date)
                ) {
                  return true;
                }
                return false;
              },
              ...props.calendarProps,
            }}
            formComposition={{
              requiredSymbol: isRequired,
              ...props.formComposition,
              onClear: handleClear,
            }}
          />
        );
      }}
    />
  );
};

DateRangePickerForm.displayName = "DateRangePickerForm";

export { DateRangePickerForm };
