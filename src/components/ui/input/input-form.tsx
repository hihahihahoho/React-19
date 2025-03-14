import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import { Input, InputProps } from "./input"

export interface InputFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName>,
    Omit<InputProps, "defaultValue" | "name"> {}

const InputForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  ...props
}: Omit<InputFormProps<TFieldValues, TName>, "render">) => {
  const { getJsonSchema } = useZodSchema()
  const { isRequired } = getJsonSchema(name)
  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field } }) => {
        const handleClear = () => {
          if (props.type === "file") {
            onChange(null)
          } else {
            onChange("")
          }
          props.formComposition?.onClear?.()
        }

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (props.type === "file") {
            const { files } = e.target
            onChange({
              target: { value: files },
            })
          } else {
            const { value } = e.target
            onChange(value)
          }
        }
        return (
          <Input
            {...field}
            {...(props.type !== "file" && { value: value || "" })}
            {...props}
            onChange={handleChange}
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

InputForm.displayName = "InputForm"

export { InputForm }
