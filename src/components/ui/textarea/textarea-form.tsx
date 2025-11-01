import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { ZodString } from "zod"
import { FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import { Textarea, TextareaProps } from "./textarea"

export interface TextareaFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName>,
    Omit<TextareaProps, "defaultValue" | "name"> {}

const TextareaForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  ...props
}: Omit<TextareaFormProps<TFieldValues, TName>, "render">) => {
  const { getSchemaFromPath } = useZodSchema()
  const { isRequired, maxLength } = getSchemaFromPath<ZodString>(name)
  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field } }) => {
        const handleClear = () => {
          onChange("")
          props.formComposition?.onClear?.()
        }

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const { value } = e.target
          onChange(value)
        }

        return (
          <Textarea
            maxLength={maxLength || undefined}
            {...field}
            value={value || ""}
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

export { TextareaForm }
