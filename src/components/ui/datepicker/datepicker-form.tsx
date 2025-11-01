import { ZodDateMeta } from "@/lib/zod"
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
  DatePicker,
  DatePickerProps,
  OnValueChangeDatePicker,
} from "./datepicker"

export interface DatePickerFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName>,
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
                if (metadata?.minDate && isBefore(date, metadata?.minDate)) {
                  return true
                }
                if (metadata?.maxDate && isBefore(metadata?.maxDate, date)) {
                  return true
                }
                return false
              },
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
