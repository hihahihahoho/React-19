"use client"

import { cn } from "@/lib/utils"
import * as React from "react"
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormComposition, FormCompositionProps, FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import { RadioGroup } from "./radio-group"

export interface RadioGroupFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    Omit<ControllerProps<TFieldValues, TName>, "render">,
    Omit<
      React.ComponentProps<typeof RadioGroup>,
      "value" | "onValueChange" | "defaultValue" | "name"
    > {
  formComposition?: FormCompositionProps
  children: React.ReactNode
}

const RadioGroupForm = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  formComposition,
  className,
  children,
  ...props
}: RadioGroupFormProps<TFieldValues, TName>) => {
  const { getSchemaFromPath } = useZodSchema()
  const { isRequired } = getSchemaFromPath(name)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormComposition
          requiredSymbol={isRequired}
          {...formComposition}
          isMinHeight
          variant="empty"
        >
          <RadioGroup
            {...props}
            className={cn("mt-2 grid grid-cols-2 gap-2", className)}
            value={field.value}
            onValueChange={field.onChange}
          >
            {children}
          </RadioGroup>
        </FormComposition>
      )}
    />
  )
}

export { RadioGroupForm }
