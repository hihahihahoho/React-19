"use client"

import { ZodDateRangeMeta } from "@/lib/zod"
import { isBefore } from "date-fns"
import {
  ControllerProps,
  FieldPath,
  FieldValues,
  useWatch,
} from "react-hook-form"
import { FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import {
  DateRangePicker,
  DateRangePickerProps,
  OnValueChangeDateRangePicker,
} from "./date-range-picker" // <-- Update import to your actual path

export interface DateRangePickerFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    ControllerProps<TFieldValues, TName>,
    Omit<
      DateRangePickerProps,
      "defaultValue" | "name" | "value" | "onValueChange"
    > {}

const DateRangePickerForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  ...props
}: Omit<DateRangePickerFormProps<TFieldValues, TName>, "render">) => {
  const fieldValue = useWatch({
    control,
    name: name,
  })

  const { getSchemaFromPath } = useZodSchema()
  const { isRequired, meta } = getSchemaFromPath(name)

  const metadata = meta() as ZodDateRangeMeta | undefined

  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { onChange, ...field } }) => {
        const handleClear = () => {
          onChange(undefined)
          props.formComposition?.onClear?.()
        }

        const handleValueChange = (newRange: OnValueChangeDateRangePicker) => {
          onChange(newRange)
        }

        return (
          <DateRangePicker
            {...field}
            value={fieldValue ?? null}
            onValueChange={handleValueChange}
            {...props}
            calendarProps={{
              minRange: metadata?.minRange,
              maxRange: metadata?.maxRange,
              disabled: (date) => {
                if (metadata?.minDate && isBefore(date, metadata?.minDate)) {
                  return true
                }
                if (metadata?.maxDate && isBefore(metadata?.maxDate, date)) {
                  return true
                }
                return false
              },
              startMonth: metadata?.minDate || undefined,
              endMonth: metadata?.maxDate || undefined,
              ...props.calendarProps,
            }}
            formComposition={{
              requiredSymbol: isRequired,
              ...props.formComposition,
              onClear: handleClear,
            }}
          />
        )
      }}
    />
  )
}

export { DateRangePickerForm }
