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
  ...props
}: Omit<InputFormProps<TFieldValues, TName>, "render">) => {
  const { getSchemaFromPath } = useZodSchema()
  const { isOptional } = getSchemaFromPath(name)
  return (
    <FormField
      name={name}
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
              requiredSymbol: !isOptional(),
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
