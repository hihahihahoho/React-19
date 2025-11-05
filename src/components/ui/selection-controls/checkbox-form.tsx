"use client"

import { CheckboxProps } from "@radix-ui/react-checkbox"
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormCompositionProps, FormField, FormMessage } from "../form/form"
import { Checkbox } from "./checkbox"
import { SelectionGroup, SelectionGroupProps } from "./selection-group"

export interface CheckboxFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render">,
    Omit<CheckboxProps, "name" | "onValueChange" | "defaultValue" | "value"> {
  selectionGroup?: SelectionGroupProps
  formComposition?: FormCompositionProps
}

const CheckboxForm = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  selectionGroup,
  children,
  ...props
}: CheckboxFormProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <SelectionGroup
          control={
            <Checkbox
              {...props}
              onCheckedChange={field.onChange}
              checked={field.value}
            />
          }
          {...selectionGroup}
        >
          {children}
          <FormMessage className="mt-1" />
        </SelectionGroup>
      )}
    />
  )
}

export { CheckboxForm }
