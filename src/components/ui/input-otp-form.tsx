"use client"

import { OTPInput } from "input-otp"
import * as React from "react"
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormComposition, FormCompositionProps, FormField } from "./form/form"
import { useZodSchema } from "./form/zod-schema-context"
import { InputOTP } from "./input-otp"

export interface InputOTPFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render">,
    Omit<
      React.ComponentProps<typeof OTPInput>,
      "defaultValue" | "name" | "value" | "onChange" | "render"
    > {
  formComposition?: FormCompositionProps
  containerClassName?: string
  children?: React.ReactNode
}

const InputOTPForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  formComposition,
  containerClassName,
  children,
  ...props
}: Omit<InputOTPFormProps<TFieldValues, TName>, "render">) => {
  const { getSchemaFromPath } = useZodSchema()
  const { isRequired } = getSchemaFromPath(name)

  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field } }) => {
        const handleClear = () => {
          onChange("")
          formComposition?.onClear?.()
        }

        return (
          <FormComposition
            {...formComposition}
            hasValue={Boolean(value && value.length)}
            onClear={handleClear}
            requiredSymbol={isRequired}
            variant="empty"
          >
            <InputOTP
              {...field}
              {...props}
              value={value || ""}
              onChange={onChange}
              containerClassName={containerClassName}
            >
              {children}
            </InputOTP>
          </FormComposition>
        )
      }}
    />
  )
}

export { InputOTPForm }
