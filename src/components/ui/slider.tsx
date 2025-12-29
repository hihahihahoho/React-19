"use client"

import { cn } from "@/lib/utils"
import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"

// ============================================================================
// Context
// ============================================================================

interface SliderContextValue {
  value: number[]
  min: number
  max: number
  handleValueChange: (value: number[]) => void
  suffix?: React.ReactNode | ((value: number | undefined) => React.ReactNode)
  disabled?: boolean
}

const SliderContext = React.createContext<SliderContextValue | null>(null)

const useSliderContext = () => {
  const context = React.useContext(SliderContext)
  if (!context) {
    throw new Error("Slider components must be used within <SliderRoot>")
  }
  return context
}

// ============================================================================
// Slider Root (Context Provider + Wrapper)
// ============================================================================

interface SliderRootProps extends Omit<
  React.ComponentProps<"div">,
  "defaultValue"
> {
  value?: number[]
  onValueChange?: (value: number[]) => void
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  suffix?: React.ReactNode | ((value: number | undefined) => React.ReactNode)
}

function SliderRoot({
  className,
  children,
  min = 0,
  max = 100,
  step: _step = 1,
  value: controlledValue,
  onValueChange,
  defaultValue,
  suffix,
  disabled = false,
  ...props
}: SliderRootProps) {
  const isControlled = controlledValue !== undefined

  const [internalValue, setInternalValue] = React.useState<number[]>(
    defaultValue || [min]
  )

  const currentValue = isControlled ? controlledValue : internalValue

  const handleValueChange = React.useCallback(
    (newValue: number[]) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange]
  )

  const contextValue = React.useMemo(
    () => ({
      value: currentValue,
      min,
      max,
      handleValueChange,
      suffix,
      disabled,
    }),
    [currentValue, min, max, handleValueChange, suffix, disabled]
  )

  return (
    <SliderContext.Provider value={contextValue}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </SliderContext.Provider>
  )
}

// ============================================================================
// Slider Control (The actual Radix Slider)
// ============================================================================

type SliderControlProps = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "value" | "onValueChange" | "min" | "max" | "disabled"
>

function SliderControl({
  className,
  children,
  ref,
  ...props
}: SliderControlProps) {
  const { value, min, max, handleValueChange, disabled } = useSliderContext()

  return (
    <SliderPrimitive.Root
      ref={ref}
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        "has-data-[position=bottom]:pb-8 has-data-[position=top]:pt-8",
        className
      )}
      value={value}
      onValueChange={handleValueChange}
      min={min}
      max={max}
      disabled={disabled}
      {...props}
    >
      {children}
    </SliderPrimitive.Root>
  )
}

// ============================================================================
// Slider Track
// ============================================================================

interface SliderTrackProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode
}

function SliderTrack({ className, children, ...props }: SliderTrackProps) {
  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      className={cn(
        "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        className
      )}
      {...props}
    >
      {children}
    </SliderPrimitive.Track>
  )
}

// ============================================================================
// Slider Range
// ============================================================================

type SliderRangeProps = React.ComponentProps<"span">

function SliderRange({ className, ...props }: SliderRangeProps) {
  return (
    <SliderPrimitive.Range
      data-slot="slider-range"
      className={cn(
        "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
        className
      )}
      {...props}
    />
  )
}

// ============================================================================
// Slider Thumb
// ============================================================================

interface SliderThumbProps extends React.ComponentProps<"span"> {
  children?: React.ReactNode
}

function SliderThumb({ className, children, ...props }: SliderThumbProps) {
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className={cn(
        "border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </SliderPrimitive.Thumb>
  )
}

// ============================================================================
// Slider Label (tooltip above/below thumb)
// ============================================================================

interface SliderLabelProps extends React.ComponentProps<"div"> {
  value: number
  position?: "top" | "bottom"
  showArrow?: boolean
}

function SliderLabel({
  className,
  value,
  position = "top",
  showArrow = true,
  ...props
}: SliderLabelProps) {
  const { suffix } = useSliderContext()

  const renderContent = () => {
    if (typeof suffix === "function") {
      return suffix(value)
    }
    return (
      <>
        {value}
        {suffix && <span>{suffix}</span>}
      </>
    )
  }

  return (
    <div
      data-slot="slider-label"
      data-position={position}
      className={cn(
        "bg-primary text-primary-foreground absolute left-1/2 z-10 flex -translate-x-1/2 items-center justify-center gap-0.5 rounded-md px-2 py-0.5 text-xs whitespace-nowrap",
        position === "top" && "-top-8",
        position === "bottom" && "top-6",
        className
      )}
      {...props}
    >
      {showArrow && (
        <div
          className={cn(
            "bg-primary absolute size-2 rotate-45",
            position === "top" && "-bottom-1 rounded-br-[2px]",
            position === "bottom" && "-top-1 rounded-tl-[2px]"
          )}
        />
      )}
      <span className="relative z-10">{renderContent()}</span>
    </div>
  )
}

// ============================================================================
// Slider Indicator (marks/ticks above the slider)
// ============================================================================

interface SliderIndicatorProps extends React.ComponentProps<"div"> {
  step?: number
  showLabel?: boolean
  renderLabel?: (value: number) => React.ReactNode
  position?: "top" | "bottom"
}

function SliderIndicator({
  className,
  step = 20,
  showLabel = true,
  renderLabel,
  position = "top",
  ...props
}: SliderIndicatorProps) {
  const { min, max, value, handleValueChange, suffix, disabled } =
    useSliderContext()

  const positions = React.useMemo(() => {
    const result: number[] = []
    for (let i = min; i <= max; i += step) {
      result.push(i)
    }
    return result
  }, [min, max, step])

  const handleIndicatorClick = React.useCallback(
    (clickedValue: number) => {
      if (disabled) return
      const newValue = [...value]

      if (newValue.length === 1) {
        // Single value slider - just set the value
        handleValueChange([clickedValue])
      } else if (newValue.length === 2) {
        // Range slider - update the closest thumb
        if (
          Math.abs(clickedValue - newValue[0]) <
          Math.abs(clickedValue - newValue[1])
        ) {
          newValue[0] = clickedValue
        } else {
          newValue[1] = clickedValue
        }
        newValue.sort((a, b) => a - b)
        handleValueChange(newValue)
      }
    },
    [value, handleValueChange, disabled]
  )

  return (
    <div
      data-slot="slider-indicator"
      className={cn(
        "relative left-2 h-6 w-[calc(100%-16px)]",
        position === "top" && "mb-2",
        position === "bottom" && "mt-2",
        className
      )}
      {...props}
    >
      {positions.map((pos) => {
        const percent = ((pos - min) / (max - min)) * 100

        return (
          <div
            key={pos}
            className={cn(
              "text-muted-foreground hover:text-foreground absolute flex cursor-pointer items-center gap-1 text-xs whitespace-nowrap transition-colors",
              position === "top" && "flex-col",
              position === "bottom" && "flex-col-reverse",
              disabled && "pointer-events-none opacity-50"
            )}
            style={{
              left: `${percent}%`,
              transform: "translateX(-50%)",
            }}
            onClick={() => handleIndicatorClick(pos)}
          >
            {showLabel && (
              <span>
                {renderLabel ? (
                  renderLabel(pos)
                ) : (
                  <>
                    {pos}
                    {typeof suffix !== "function" && suffix}
                  </>
                )}
              </span>
            )}
            <div className="bg-border h-1.5 w-px" />
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// Slider Value Display (static display, not on thumb)
// ============================================================================

interface SliderValueProps extends React.ComponentProps<"div"> {
  /**
   * Index of the value to display. If not provided, shows the last value.
   */
  valueIndex?: number
  /**
   * Custom render function for the value
   */
  renderValue?: (value: number) => React.ReactNode
}

function SliderValue({
  className,
  valueIndex,
  renderValue,
  ...props
}: SliderValueProps) {
  const { value, suffix } = useSliderContext()

  const displayValue =
    valueIndex !== undefined ? value[valueIndex] : value[value.length - 1]

  const renderContent = () => {
    if (renderValue) {
      return renderValue(displayValue)
    }
    if (typeof suffix === "function") {
      return suffix(displayValue)
    }
    return (
      <>
        {displayValue}
        {suffix && <span className="ml-0.5">{suffix}</span>}
      </>
    )
  }

  return (
    <div
      data-slot="slider-value"
      className={cn("text-sm font-medium tabular-nums", className)}
      {...props}
    >
      {renderContent()}
    </div>
  )
}

// ============================================================================
// Exports
// ============================================================================

export {
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValue,
  useSliderContext,
}

export type {
  SliderControlProps,
  SliderIndicatorProps,
  SliderLabelProps,
  SliderRangeProps,
  SliderRootProps,
  SliderThumbProps,
  SliderTrackProps,
  SliderValueProps,
}
