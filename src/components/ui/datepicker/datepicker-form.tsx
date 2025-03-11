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

type JsonSchemaType = {
  isRequired: boolean
  description?: string
}

type JsonDescriptionType = {
  minDate?: Date
  maxDate?: Date
}

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
  const { getJsonSchema } = useZodSchema()
  const { isRequired, description }: JsonSchemaType = getJsonSchema(name)

  const jsonDescription: JsonDescriptionType = JSON.parse(description || "{}")
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
                if (
                  jsonDescription.minDate &&
                  isBefore(date, jsonDescription.minDate)
                ) {
                  return true
                }
                if (
                  jsonDescription.maxDate &&
                  isBefore(jsonDescription.maxDate, date)
                ) {
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

DatePickerForm.displayName = "DatePickerForm"

export { DatePickerForm }
