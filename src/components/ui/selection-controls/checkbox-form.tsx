import { CheckboxProps } from "@radix-ui/react-checkbox"
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormComposition, FormCompositionProps, FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
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
  formComposition,
  ...props
}: CheckboxFormProps<TFieldValues, TName>) => {
  const { getJsonSchema } = useZodSchema()
  const { isRequired } = getJsonSchema(name)
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormComposition
          requiredSymbol={isRequired}
          {...formComposition}
          variant="empty"
          className="h-auto min-h-0"
        >
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
          </SelectionGroup>
        </FormComposition>
      )}
    />
  )
}

CheckboxForm.displayName = "CheckboxForm"

export { CheckboxForm }
