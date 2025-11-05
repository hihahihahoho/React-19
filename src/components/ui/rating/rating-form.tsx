"use client"

import { cn } from "@/lib/utils"
import { ComponentPropsWithoutRef, ElementType } from "react"
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormComposition, FormCompositionProps, FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import { Rating, RatingItem } from "./rating"

export interface RatingFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName>,
    Omit<
      ComponentPropsWithoutRef<typeof Rating>,
      "defaultValue" | "name" | "value" | "onValueChange" | "children"
    > {
  icon?: ElementType
  totalRating?: number
  formComposition?: FormCompositionProps
}

const RatingForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  icon: Icon,
  totalRating = 5,
  formComposition,
  className,
  ...props
}: Omit<RatingFormProps<TFieldValues, TName>, "render">) => {
  const { getSchemaFromPath } = useZodSchema()
  const { isRequired } = getSchemaFromPath(name)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => {
        const handleValueChange = (newValue: number) => {
          onChange(newValue)
        }

        return (
          <FormComposition
            requiredSymbol={isRequired}
            isMinHeight
            {...formComposition}
            variant="empty"
          >
            <Rating
              {...field}
              {...props}
              className={cn("h-full", className)}
              value={value || 0}
              onValueChange={handleValueChange}
              required={isRequired}
              max={totalRating}
            >
              {Array.from({ length: totalRating }, (_, i) => (
                <RatingItem key={i}>{Icon ? <Icon /> : undefined}</RatingItem>
              ))}
            </Rating>
          </FormComposition>
        )
      }}
    />
  )
}

export { RatingForm }
