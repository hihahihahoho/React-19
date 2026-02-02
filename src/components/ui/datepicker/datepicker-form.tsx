"use client"

import { ZodDateMeta } from "@/lib/zod"
import { isBefore, startOfDay } from "date-fns"
import {
  ControllerProps,
  FieldPath,
  FieldValues,
  useWatch,
} from "react-hook-form"
import { FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import {
  DatePicker,
  DatePickerProps,
  OnValueChangeDatePicker,
} from "./datepicker"

export interface DatePickerFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    ControllerProps<TFieldValues, TName>,
    Omit<
      DatePickerProps,
      "defaultValue" | "name" | "value" | "onValueChange"
    > {}

const DatePickerForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  ...props
}: Omit<DatePickerFormProps<TFieldValues, TName>, "render">) => {
  const fieldValue = useWatch({
    control,
    name: name,
  })
  const { getSchemaFromPath } = useZodSchema()
  const { isRequired, meta } = getSchemaFromPath(name)
  const metadata = meta() as ZodDateMeta | undefined
  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { onChange, ...field } }) => {
        const handleClear = () => {
          onChange(undefined)
          props.formComposition?.onClear?.()
        }

        const handleValueChange = (newDate: OnValueChangeDatePicker) => {
          onChange(newDate)
        }

        return (
          <DatePicker
            {...field}
            value={fieldValue || null}
            onValueChange={handleValueChange}
            {...props}
            calendarProps={{
              disabled: (date) => {
                const dateDay = startOfDay(date)
                if (
                  metadata?.minDate &&
                  isBefore(dateDay, startOfDay(metadata.minDate))
                ) {
                  return true
                }
                if (
                  metadata?.maxDate &&
                  isBefore(startOfDay(metadata.maxDate), dateDay)
                ) {
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

export { DatePickerForm }
