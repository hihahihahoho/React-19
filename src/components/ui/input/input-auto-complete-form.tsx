import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import {
  InputAutoComplete,
  InputAutoCompleteProps,
} from "./input-auto-complete"

export interface InputAutoCompleteFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName>,
    Omit<InputAutoCompleteProps, "defaultValue" | "name"> {}

const InputAutoCompleteForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  ...props
}: Omit<InputAutoCompleteFormProps<TFieldValues, TName>, "render">) => {
  const { getSchemaFromPath } = useZodSchema()
  const { isOptional } = getSchemaFromPath(name)
  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field } }) => {
        const handleClear = () => {
          onChange("")
          props.formComposition?.onClear?.()
        }

        return (
          <InputAutoComplete
            {...field}
            value={value === undefined ? "" : value || ""}
            {...props}
            onValueChange={onChange}
            formComposition={{
              onClear: handleClear,
              requiredSymbol: !isOptional(),
              ...props.formComposition,
            }}
          />
        )
      }}
    />
  )
}

InputAutoCompleteForm.displayName = "InputAutoCompleteForm"

export { InputAutoCompleteForm }
