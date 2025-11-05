"use client"

import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import { InputTag, InputTagProps } from "./input-tag"

export interface InputTagFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName>,
    Omit<InputTagProps, "defaultValue" | "name" | "value" | "onValueChange"> {}

const InputTagForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  ...props
}: Omit<InputTagFormProps<TFieldValues, TName>, "render">) => {
  const { getSchemaFromPath } = useZodSchema()
  const { isRequired } = getSchemaFromPath(name)
  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field } }) => {
        const handleClear = () => {
          onChange([])
          props.formComposition?.onClear?.()
        }

        return (
          <InputTag
            {...field}
            value={value || []}
            {...props}
            onValueChange={onChange}
            formComposition={{
              onClear: handleClear,
              requiredSymbol: isRequired,
              ...props.formComposition,
            }}
          />
        )
      }}
    />
  )
}

export { InputTagForm }
