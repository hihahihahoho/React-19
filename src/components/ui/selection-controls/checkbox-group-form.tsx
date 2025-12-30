"use client"

import { cn } from "@/lib/utils"
import * as React from "react"
import {
  ControllerProps,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form"
import { FormComposition, FormCompositionProps, FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import { CheckboxGroup, CheckboxGroupProps } from "./checkbox-group"

export interface CheckboxGroupFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    Omit<ControllerProps<TFieldValues, TName>, "render">,
    Omit<CheckboxGroupProps, "value" | "onValueChange" | "defaultValue"> {
  formComposition?: FormCompositionProps
  children: React.ReactNode
}

const CheckboxGroupForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  formComposition,
  children,
  className,
  disabled,
  ...props
}: CheckboxGroupFormProps<TFieldValues, TName>) => {
  const { control: contextControl } = useFormContext<TFieldValues>()
  const { getSchemaFromPath } = useZodSchema()
  const { isRequired } = getSchemaFromPath(name)

  return (
    <FormField<TFieldValues, TName>
      name={name}
      control={control || contextControl}
      render={({ field }) => {
        const value = (field.value || []) as string[]

        return (
          <FormComposition
            requiredSymbol={isRequired}
            {...formComposition}
            isMinHeight
            variant="empty"
          >
            <CheckboxGroup
              value={value}
              onValueChange={field.onChange}
              disabled={disabled}
              className={cn("mt-2", className)}
            >
              {children}
            </CheckboxGroup>
          </FormComposition>
        )
      }}
      {...props}
    />
  )
}

export { CheckboxGroupForm }
