import { useMergedRef } from "@/hooks/use-merge-ref"
import { cn } from "@/lib/utils"
import { PopoverAnchor, PopoverContentProps } from "@radix-ui/react-popover"
import { Measurable } from "@radix-ui/rect"
import * as React from "react"
import { Command } from "../command"
import { Popover, PopoverContent } from "../popover"
import { SelectCommand } from "../select/select-command"
import { SelectGroup, SelectItems } from "../select/select-interface"
import { Input } from "./input"

export interface InputAutoCompleteProps
  extends Omit<React.ComponentProps<typeof Input>, "onValueChange"> {
  options?: SelectItems[] | SelectGroup[]
  popoverContentProps?: PopoverContentProps
  onValueChange?: (value: string) => void
  value?: string
  initialState?: React.ReactNode
  loading?: boolean
  minCharToSearch?: number
  mode?: "default" | "select"
}

function InputAutoComplete({
  options,
  formComposition,
  value,
  onValueChange,
  onChange,
  onFocus,
  popoverContentProps,
  loading,
  initialState,
  minCharToSearch = 1,
  mode = "default",
  ref,
  ...props
}: InputAutoCompleteProps) {
  const internalRef = React.useRef<HTMLInputElement>(null)
  const mergeRef = useMergedRef(internalRef, ref)
  const formCompositionRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [internalValue, setInternalValue] = React.useState("")
  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setOpen(true)
      onFocus?.(e)
    },
    [onFocus]
  )
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      if (mode === "default") {
        setInternalValue(e.target.value)
        onValueChange?.(e.target.value)
      }
      onChange?.(e)
    },
    [onChange, onValueChange, mode]
  )
  const handleOnSelect = React.useCallback(
    (selected: SelectItems) => {
      setInternalValue(selected.value)
      setInputValue(selected.value)
      onValueChange?.(selected.value)
      setOpen(false)
    },
    [onValueChange]
  )

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open)
      if (!open) {
        internalRef.current?.blur()
        if (mode === "select") {
          setInputValue(internalValue)
        }
      }
    },
    [internalValue, mode]
  )

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
      if (!open || mode === "default") {
        setInputValue(value)
      }
    }
  }, [value, open, mode])
  const currentValue = value !== undefined ? value : internalValue

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverAnchor
        virtualRef={formCompositionRef as React.RefObject<Measurable>}
      />
      <Command className="overflow-visible" defaultValue={currentValue}>
        <Input
          value={mode === "default" ? currentValue : inputValue}
          onFocus={handleFocus}
          onChange={handleChange}
          autoComplete="off"
          {...props}
          ref={mergeRef}
          formComposition={{
            ...formComposition,
            ref: formCompositionRef,
            onClear: () => {
              setInternalValue("")
              setInputValue("")
              onValueChange?.("")
              formComposition?.onClear?.()
            },
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
          className={cn("popover-content-width-full p-0")}
          onWheel={(e) => e.stopPropagation()}
          {...popoverContentProps}
        >
          {inputValue.length < minCharToSearch ? (
            initialState || (
              <div className="p-6 text-center text-sm">
                Vui lòng nhập ít nhất {minCharToSearch} kí tự để tìm kiếm
              </div>
            )
          ) : (
            <SelectCommand
              showSearch={false}
              selected={[(currentValue as string) || ""]}
              items={options}
              onSelect={handleOnSelect}
              commandWrapper={false}
              loading={loading}
            />
          )}
        </PopoverContent>
      </Command>
    </Popover>
  )
}

export { InputAutoComplete }
