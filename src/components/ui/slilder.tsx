"use client"

import { cn } from "@/lib/utils"
import NumberFlow from "@number-flow/react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"
import { Separator } from "./separator"

interface SliderProps
  extends Omit<
    React.ComponentProps<typeof SliderPrimitive.Root>,
    "value" | "defaultValue"
  > {
  labelPosition?: "top" | "bottom" | "static"
  labelContentPos?: "left" | "right"
  label?: React.ReactNode | ((value: number | undefined) => React.ReactNode)
  indicator?: boolean
  indicatorStep?: number
  // Controlled
  value?: number[]
  onValueChange?: (value: number[]) => void
  // Uncontrolled
  defaultValue?: number[]
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      label,
      labelPosition = "bottom",
      labelContentPos = "right",
      indicator = true,
      min = 0,
      max = 100,
      indicatorStep = 20,
      value: controlledValue,
      onValueChange,
      defaultValue,
      ...props
    },
    ref
  ) => {
    // Determine if this is a controlled or uncontrolled component
    const isControlled = controlledValue !== undefined

    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = React.useState<number[]>(
      defaultValue || [min, max]
    )

    // Get current value (controlled or uncontrolled)
    const currentValue = isControlled ? controlledValue : internalValue

    // Handle value changes
    const handleValueChange = React.useCallback(
      (newValue: number[]) => {
        if (!isControlled) {
          setInternalValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [isControlled, onValueChange]
    )

    const handleIndicatorClick = React.useCallback(
      (clickedValue: number) => {
        const newValue = [...currentValue]

        // Find closest thumb to the clicked value
        if (newValue.length === 1) {
          // Single thumb case
          handleValueChange([clickedValue])
        } else if (newValue.length === 2) {
          // Range slider case - move the closest thumb
          if (
            Math.abs(clickedValue - newValue[0]) <
            Math.abs(clickedValue - newValue[1])
          ) {
            newValue[0] = clickedValue
          } else {
            newValue[1] = clickedValue
          }
          // Ensure min <= max
          newValue.sort((a, b) => a - b)
          handleValueChange(newValue)
        }
      },
      [currentValue, handleValueChange]
    )

    // Generate indicator positions
    const indicatorPositions = React.useMemo(() => {
      if (!indicator || !indicatorStep) return []

      const positions: number[] = []
      for (let i = min; i <= max; i += indicatorStep) {
        positions.push(i)
      }
      return positions
    }, [indicator, indicatorStep, min, max])

    const renderLabelContent = React.useCallback(
      (value: number) => (
        <>
          {labelContentPos === "left" && (
            <>
              {typeof label === "function" ? (
                <span className="inline-block -translate-y-0.5">
                  {label(value)}
                </span>
              ) : (
                label && <span className="inline-block">{label}</span>
              )}
            </>
          )}
          <NumberFlow
            willChange
            value={value}
            isolate
            opacityTiming={{
              duration: 250,
              easing: "ease-out",
            }}
            transformTiming={{
              easing: `linear(0, 0.0033 0.8%, 0.0263 2.39%, 0.0896 4.77%, 0.4676 15.12%, 0.5688, 0.6553, 0.7274, 0.7862, 0.8336 31.04%, 0.8793, 0.9132 38.99%, 0.9421 43.77%, 0.9642 49.34%, 0.9796 55.71%, 0.9893 62.87%, 0.9952 71.62%, 0.9983 82.76%, 0.9996 99.47%)`,
              duration: 500,
            }}
          />
          {labelContentPos === "right" && (
            <>
              {typeof label === "function" ? (
                <span className="inline-block">{label(value)}</span>
              ) : (
                label && <span className="inline-block">{label}</span>
              )}
            </>
          )}
        </>
      ),
      [label, labelContentPos]
    )

    return (
      <>
        {indicator && indicatorPositions.length > 0 && (
          <div className="mb-2 flex w-full justify-between">
            {indicatorPositions.map((pos) => (
              <div
                key={pos}
                className="flex cursor-pointer flex-col items-center gap-1 text-xs"
                onClick={() => handleIndicatorClick(pos)}
              >
                <span className="inline-block">
                  {pos}
                  {typeof label === "function" ? (
                    <span className="inline-block"></span>
                  ) : (
                    label && <span className="inline-block">{label}</span>
                  )}
                </span>
                <Separator className="h-auto flex-1" orientation="vertical" />
              </div>
            ))}
          </div>
        )}

        <div className={cn(indicator && "px-3")}>
          <SliderPrimitive.Root
            ref={ref}
            className={cn(className)}
            value={currentValue}
            onValueChange={handleValueChange}
            min={min}
            max={max}
            {...props}
          >
            <div className="relative flex w-full touch-none items-center select-none">
              <SliderPrimitive.Track
                className={cn(
                  "bg-primary/20 relative h-[6px] w-full grow overflow-hidden rounded-full",
                  indicator && "mx-2"
                )}
              >
                <SliderPrimitive.Range className="bg-primary absolute h-full" />
              </SliderPrimitive.Track>

              {currentValue.map((value, index) => (
                <SliderPrimitive.Thumb
                  key={index}
                  className="border-primary/50 bg-background ring-offset-background focus-visible:ring-primary relative block h-4 w-4 rounded-full border shadow transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  {label && labelPosition !== "static" && (
                    <div
                      className={cn(
                        "bg-primary text-primary-foreground absolute left-1/2 flex w-auto -translate-x-1/2 items-end justify-center gap-0.5 rounded-md px-2 text-xs",
                        labelPosition === "top" && "-top-7",
                        labelPosition === "bottom" && "top-6"
                      )}
                    >
                      <div className="bg-primary absolute -top-1 size-2 rotate-45 rounded-tl-[2px]"></div>
                      {renderLabelContent(value)}
                    </div>
                  )}
                </SliderPrimitive.Thumb>
              ))}

              {label && labelPosition === "static" && (
                <div className="absolute -top-7 right-0 flex w-fit items-start justify-center gap-0.5">
                  {renderLabelContent(currentValue[currentValue.length - 1])}
                </div>
              )}
            </div>
          </SliderPrimitive.Root>
        </div>
      </>
    )
  }
)

Slider.displayName = "Slider"

export { Slider }
