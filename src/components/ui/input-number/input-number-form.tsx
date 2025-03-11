import {
  ControllerProps,
  FieldPath,
  FieldValues,
  useWatch,
} from "react-hook-form"
import { FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import {
  InputNumber,
  InputNumberProps,
  OnValueChangeInputNumber,
} from "./input-number"

type JsonSchemaType = {
  isRequired: boolean
}

export interface InputNumberFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName>,
    Omit<InputNumberProps, "defaultValue" | "name"> {}

const InputNumberForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  ...props
}: Omit<InputNumberFormProps<TFieldValues, TName>, "render">) => {
  const fieldValue = useWatch({
    control,
    name: name,
  })

  const { getJsonSchema } = useZodSchema()
  const { isRequired }: JsonSchemaType = getJsonSchema(name)

  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { onChange, ...field } }) => {
        const handleClear = () => {
          onChange(undefined)
          props.formComposition?.onClear?.()
        }

        const handleChange = (e: OnValueChangeInputNumber) => {
          onChange(e.unMaskedValue)
        }
        return (
          <InputNumber
            {...field}
            {...props}
            value={fieldValue || ""}
            onValueChange={handleChange}
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

InputNumberForm.displayName = "InputNumberForm"

export { InputNumberForm }
