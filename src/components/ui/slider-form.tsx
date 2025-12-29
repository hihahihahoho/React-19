"use client"

import * as React from "react"
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormComposition, FormCompositionProps, FormField } from "./form/form"
import { useZodSchema } from "./form/zod-schema-context"
import {
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderRange,
  SliderRoot,
  SliderRootProps,
  SliderThumb,
  SliderTrack,
} from "./slider"

// ============================================================================
// Slider (Basic Shadcn-style slider component)
// ============================================================================

interface SliderProps extends Omit<SliderRootProps, "children"> {
  /** ClassName applied to the SliderControl element */
  className?: string
}

function Slider({ className, disabled, ...props }: SliderProps) {
  return (
    <SliderRoot disabled={disabled} {...props}>
      <SliderControl className={className}>
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb />
      </SliderControl>
    </SliderRoot>
  )
}

// ============================================================================
// SliderForm (With react-hook-form integration)
// ============================================================================

export interface SliderFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    Omit<ControllerProps<TFieldValues, TName>, "render">,
    Omit<SliderRootProps, "value" | "onValueChange" | "defaultValue" | "name"> {
  showIndicator?: boolean
  indicatorStep?: number
  indicatorPosition?: "top" | "bottom"
  showThumbLabel?: boolean
  thumbLabelPosition?: "top" | "bottom"
  renderIndicatorLabel?: (value: number) => React.ReactNode
  formComposition?: FormCompositionProps
}

const SliderForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  min = 0,
  max = 100,
  showIndicator = false,
  indicatorStep = 25,
  indicatorPosition = "top",
  showThumbLabel = false,
  thumbLabelPosition = "bottom",
  renderIndicatorLabel,
  formComposition,
  ...props
}: SliderFormProps<TFieldValues, TName>) => {
  const { getSchemaFromPath } = useZodSchema()
  const { isRequired } = getSchemaFromPath(name)

  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field } }) => {
        const sliderValue = Array.isArray(value)
          ? value
          : value !== undefined
            ? [value]
            : [min]

        const isRange = sliderValue.length > 1

        const handleValueChange = (newValue: number[]) => {
          if (!Array.isArray(value) && newValue.length === 1) {
            onChange(newValue[0])
          } else {
            onChange(newValue)
          }
        }

        return (
          <FormComposition
            data-slot="slider-form"
            {...formComposition}
            className="flex-col border-0 p-0 shadow-none! ring-0!"
            variant="ghost"
            isMinHeight
            requiredSymbol={formComposition?.requiredSymbol ?? isRequired}
          >
            <SliderRoot
              {...field}
              {...props}
              min={min}
              max={max}
              value={sliderValue}
              onValueChange={handleValueChange}
              className="py-4"
            >
              {showIndicator && indicatorPosition === "top" && (
                <SliderIndicator
                  step={indicatorStep}
                  position="top"
                  renderLabel={renderIndicatorLabel}
                />
              )}

              <SliderControl>
                <SliderTrack>
                  <SliderRange />
                </SliderTrack>
                <SliderThumb>
                  {showThumbLabel && (
                    <SliderLabel
                      value={sliderValue[0]}
                      position={thumbLabelPosition}
                    />
                  )}
                </SliderThumb>
                {isRange && (
                  <SliderThumb>
                    {showThumbLabel && (
                      <SliderLabel
                        value={sliderValue[sliderValue.length - 1]}
                        position={thumbLabelPosition}
                      />
                    )}
                  </SliderThumb>
                )}
              </SliderControl>

              {showIndicator && indicatorPosition === "bottom" && (
                <SliderIndicator
                  step={indicatorStep}
                  position="bottom"
                  renderLabel={renderIndicatorLabel}
                />
              )}
            </SliderRoot>
          </FormComposition>
        )
      }}
    />
  )
}

export { Slider, SliderForm }
export type { SliderProps }
