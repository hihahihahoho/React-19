"use client"

import { cn } from "@/lib/utils"
import { SwitchProps } from "@radix-ui/react-switch"
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormComposition, FormCompositionProps, FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import { Switch } from "./switch"

export interface SwitchFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render">,
    Omit<SwitchProps, "name" | "onValueChange" | "defaultValue" | "value"> {
  formComposition?: FormCompositionProps
}

const SwitchForm = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  formComposition,
  ...props
}: SwitchFormProps<TFieldValues, TName>) => {
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
          <div className={cn("flex h-full items-center")}>
            <Switch
              {...props}
              onCheckedChange={field.onChange}
              checked={field.value}
            />
          </div>
        </FormComposition>
      )}
    />
  )
}

export { SwitchForm }
