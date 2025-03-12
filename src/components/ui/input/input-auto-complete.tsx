import { useMergedRef } from "@/hooks/use-merge-ref"
import { PopoverAnchor, PopoverContentProps } from "@radix-ui/react-popover"
import { Measurable } from "@radix-ui/rect"
import * as React from "react"
import { Command } from "../command"
import { Popover, PopoverContent } from "../popover"
import { SelectCommand } from "../select/select-command"
import { SelectGroup, SelectItems } from "../select/select-interface"
import { Input } from "./input"

export interface InputAutoCompleteProps
  extends Omit<
    React.ComponentProps<typeof Input>,
    "onValueChange" | "defaultValue"
  > {
  /** Options displayed in the dropdown */
  options?: SelectItems[] | SelectGroup[]
  /** Additional props for popover content */
  popoverContentProps?: PopoverContentProps
  /** Called when selected value changes */
  onValueChange?: (value: string) => void
  /** Called when search term changes (different from selection) */
  onSearchChange?: (value: string) => void
  /** Current selected value (controlled) */
  value?: string
  /** Default value (uncontrolled) */
  defaultValue?: string
  /** Content shown before search, like suggestions */
  initialState?: React.ReactNode
  /** Whether options are loading */
  loading?: boolean
  /** Min characters needed before showing search results */
  minCharToSearch?: number
  /** Behavior mode - 'default': free text + suggestions, 'select': only options */
  mode?: "default" | "select"
  /** Props passed to the SelectCommand component */
  selectCommandProps?: Partial<React.ComponentProps<typeof SelectCommand>>
}

function InputAutoComplete({
  options,
  formComposition,
  value: controlledValue,
  defaultValue,
  onValueChange,
  onSearchChange,
  onChange,
  onFocus,
  popoverContentProps,
  loading,
  initialState,
  mode = "default",
  selectCommandProps,
  ref,
  ...props
}: InputAutoCompleteProps) {
  const internalRef = React.useRef<HTMLInputElement>(null)
  const mergeRef = useMergedRef(internalRef, ref)
  const formCompositionRef = React.useRef<HTMLDivElement>(null)
  const prevValueRef = React.useRef(controlledValue)

  // State management
  const [open, setOpen] = React.useState(false)
  const [localValue, setLocalValue] = React.useState(
    defaultValue || controlledValue || ""
  )
  const [searchTerm, setSearchTerm] = React.useState(
    defaultValue || controlledValue || ""
  )

  // Determine if component is controlled
  const isControlled = controlledValue !== undefined

  // The actual value to use (controlled or uncontrolled)
  const value = isControlled ? controlledValue : localValue

  // What to display in the input field
  const displayValue = mode === "select" && open ? searchTerm : value

  // Sync both search term and local value when external value changes
  // This is critical for badge clicks to update the search term immediately
  React.useEffect(() => {
    if (isControlled && controlledValue !== prevValueRef.current) {
      setLocalValue(controlledValue)
      // Important: Always update searchTerm when value changes externally
      // This ensures badge clicks update the displayed input value immediately
      setSearchTerm(controlledValue)
      prevValueRef.current = controlledValue
    }
  }, [isControlled, controlledValue])

  // Handle input focus
  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setOpen(true)
      onFocus?.(e)
    },
    [onFocus]
  )

  // Handle input changes
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setSearchTerm(newValue)

      // In default mode, update value immediately
      if (mode === "default") {
        setLocalValue(newValue)
        onValueChange?.(newValue)
      }

      onChange?.(e)
      onSearchChange?.(newValue)
    },
    [mode, onChange, onSearchChange, onValueChange]
  )

  // Handle selection from dropdown
  const handleSelect = React.useCallback(
    (selected: SelectItems) => {
      const newValue = selected.value

      // Update both search term and value
      setSearchTerm(newValue)
      setLocalValue(newValue)

      // Notify parent components
      onSearchChange?.(newValue)
      onValueChange?.(newValue)

      // Close dropdown
      setOpen(false)
    },
    [onSearchChange, onValueChange]
  )

  // Handle dropdown open/close
  const handleOpenChange = React.useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen)

      if (!isOpen) {
        // Blur input when closing
        internalRef.current?.blur()

        // In select mode, reset search term to selected value when closing
        if (mode === "select") {
          setSearchTerm(value)
          onSearchChange?.(value)
        }
      }
    },
    [mode, onSearchChange, value]
  )

  // Handle input clearing
  const handleClear = React.useCallback(() => {
    setLocalValue("")
    setSearchTerm("")
    onValueChange?.("")
    onSearchChange?.("")
    formComposition?.onClear?.()
  }, [formComposition, onSearchChange, onValueChange])

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverAnchor
        virtualRef={formCompositionRef as React.RefObject<Measurable>}
      />
      <Command className="overflow-visible">
        <Input
          value={displayValue}
          onFocus={handleFocus}
          onChange={handleChange}
          autoComplete="off"
          {...props}
          ref={mergeRef}
          formComposition={{
            ...formComposition,
            ref: formCompositionRef,
            onClear: handleClear,
          }}
        />
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if (
              formCompositionRef.current &&
              formCompositionRef.current.contains(e.target as Node)
            ) {
              e.preventDefault()
            } else {
              setOpen(false)
            }
          }}
          data-slot="select-popover-content"
          align="start"
          className="popover-content-width-full p-0"
          onWheel={(e) => e.stopPropagation()}
          {...popoverContentProps}
        >
          {initialState &&
          (!searchTerm || searchTerm.length < (props.minCharToSearch ?? 1)) ? (
            initialState
          ) : (
            <SelectCommand
              showSearch={false}
              selected={[value]}
              items={options}
              onSelect={handleSelect}
              commandWrapper={false}
              loading={loading}
              {...selectCommandProps}
            />
          )}
        </PopoverContent>
      </Command>
    </Popover>
  )
}

export { InputAutoComplete }
