import { useMergedRef } from "@/hooks/use-merge-ref"
import { getNodeText } from "@/lib/get-node-text"
import { cn, lowercaseFirstChar } from "@/lib/utils"
import React, { useCallback, useRef, useState } from "react"
import {
  FormComposition,
  FormCompositionProps,
  FormControl,
} from "../form/form"

export type OnValueChangeInput = React.ComponentProps<"input">["value"]
export type OnValueFileChangeInput = FileList | null

export interface InputProps extends React.ComponentProps<"input"> {
  formComposition?: FormCompositionProps
  onValueChange?: (value: OnValueChangeInput) => void
  onValueFileChange?: (value: OnValueFileChangeInput) => void
}

function Input({
  onFocus,
  onBlur,
  className,
  type = "text",
  formComposition,
  onChange,
  onValueChange,
  onValueFileChange,
  placeholder,
  ref,
  ...props
}: InputProps) {
  const internalRef = useRef<HTMLInputElement>(null)
  const mergedRef = useMergedRef(ref, internalRef)
  const [isFocused, setIsFocused] = useState(false)
  const [hasValueInteral, setHasValueInteral] = useState(false)

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    },
    [onBlur]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: newValue, files } = e.target
      setHasValueInteral(Boolean(newValue && newValue.toString().length))
      if (type === "file") {
        onValueFileChange?.(files)
      } else {
        onValueChange?.(newValue)
      }
      onChange?.(e)
    },
    [type, onChange, onValueChange, onValueFileChange]
  )

  const handleClear = useCallback(() => {
    if (internalRef.current) {
      internalRef.current.value = ""
      internalRef.current.focus()
    }
    setHasValueInteral(false)

    if (type === "file") {
      onValueFileChange?.(null)
    } else {
      onValueChange?.("")
    }
    formComposition?.onClear?.()
  }, [onValueChange, formComposition, type, onValueFileChange])

  const currentValue = props.value || props.defaultValue || hasValueInteral
  const hasValue =
    type === "file"
      ? Boolean(internalRef.current?.files?.length)
      : Boolean(currentValue && currentValue.toString().length)

  return (
    <FormComposition
      {...formComposition}
      clearWhenNotFocus={type === "file"}
      hasValue={hasValue}
      onFormCompositionClick={() => internalRef.current?.focus()}
      onClear={handleClear}
      disabled={props.disabled}
      readonly={props.readOnly}
      isFocused={isFocused}
    >
      <FormControl>
        <input
          data-slot="input"
          className={cn(
            "h-full w-full flex-grow border-none bg-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0",
            type === "file" && "h-auto self-center",
            className
          )}
          type={type}
          placeholder={
            placeholder ||
            "Nhập " +
              lowercaseFirstChar(getNodeText(formComposition?.label) || "")
          }
          {...props}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={mergedRef}
        />
      </FormControl>
    </FormComposition>
  )
}

export { Input }
