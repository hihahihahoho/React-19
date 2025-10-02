import { cn } from "@/lib/utils"
import { RadioGroupItemProps } from "@radix-ui/react-radio-group"
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormComposition, FormCompositionProps, FormField } from "../form/form"

import { useZodSchema } from "../form/zod-schema-context"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { SelectionGroup, SelectionGroupProps } from "./selection-group"

export type ItemRadioType = RadioGroupItemProps & {
  label: React.ReactNode
  value: string
}

export interface RadioGroupFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  formComposition?: FormCompositionProps
  selectionGroup?: SelectionGroupProps
  items: ItemRadioType[]
  className?: string
}

const RadioGroupForm = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  formComposition,
  selectionGroup,
  className,
  items,
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
            {items.map((item) => {
              const { label, ...props } = item
              return (
                <SelectionGroup
                  key={item.value}
                  control={<RadioGroupItem {...props} />}
                  {...selectionGroup}
                >
                  <div className="z-10">{label}</div>
                </SelectionGroup>
              )
            })}
          </RadioGroup>
        </FormComposition>
      )}
    />
  )
}

RadioGroupForm.displayName = "RadioGroupForm"

export { RadioGroupForm }
