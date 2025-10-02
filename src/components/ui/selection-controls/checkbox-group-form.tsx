import { cn } from "@/lib/utils"
import { CheckboxProps } from "@radix-ui/react-checkbox"
import {
  ControllerProps,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form"
import { FormComposition, FormCompositionProps, FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import { Checkbox } from "./checkbox"
import { SelectionGroup, SelectionGroupProps } from "./selection-group"

export type ItemCheckboxType = CheckboxProps & {
  label: React.ReactNode
  value: string
}

export interface CheckboxFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  formComposition?: FormCompositionProps
  selectionGroup?: SelectionGroupProps
  items: ItemCheckboxType[]
  className?: string
}

const CheckboxGroupForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  formComposition,
  selectionGroup,
  items,
  className,
  ...props
}: CheckboxFormProps<TFieldValues, TName>) => {
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
            <div className={cn("mt-2 grid grid-cols-2 gap-2", className)}>
              {items.map((item) => {
                const { label, ...checkboxProps } = item
                return (
                  <SelectionGroup
                    key={item.value}
                    control={
                      <Checkbox
                        {...checkboxProps}
                        checked={value.includes(item.value)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...value, item.value]
                            : value.filter((val) => val !== item.value)
                          field.onChange(newValue)
                        }}
                      />
                    }
                    {...selectionGroup}
                  >
                    {label}
                  </SelectionGroup>
                )
              })}
            </div>
          </FormComposition>
        )
      }}
      {...props}
    />
  )
}

CheckboxGroupForm.displayName = "CheckboxGroupForm"

export { CheckboxGroupForm }
