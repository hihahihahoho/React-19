"use client"

import { useComposedRefs } from "@/lib/compose-refs"
import { getNodeText } from "@/lib/get-node-text"
import { cn } from "@/lib/utils"
import { lowercaseFirstChar } from "@/lib/utils-plus"
import { maskitoTransform } from "@maskito/core"
import { maskitoNumberOptionsGenerator, maskitoParseNumber } from "@maskito/kit"
import { useMaskito } from "@maskito/react"
import React, { useCallback, useMemo, useRef, useState } from "react"
import {
  FormComposition,
  FormCompositionProps,
  FormControl,
} from "../form/form"

export type OnValueChangeInputNumber = {
  maskedValue: string | undefined
  unMaskedValue: number | undefined
}

export interface InputNumberProps
  extends Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> {
  formComposition?: FormCompositionProps
  maskitoOptions?: Parameters<typeof maskitoNumberOptionsGenerator>[0]
  value?: number | ""
  defaultValue?: number
  onValueChange?: (value: OnValueChangeInputNumber) => void
}

const defaultMaskitoOptions = {
  decimalSeparator: ".",
  thousandSeparator: ",",
  // eslint-disable-next-line no-loss-of-precision
  max: 99999999999999999999999999999999999999999999,
}

function InputNumber({
  onFocus,
  onBlur,
  className,
  formComposition,
  onInput,
  value,
  defaultValue,
  onValueChange,
  maskitoOptions,
  placeholder,
  ref,
  ...props
}: InputNumberProps) {
  const internalRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Maskito configuration
  const mergedMaskitoOptions = useMemo(
    () => ({
      ...defaultMaskitoOptions,
      ...maskitoOptions,
    }),
    [maskitoOptions]
  )

  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue !== undefined
      ? maskitoTransform(
          defaultValue.toString(),
          maskitoNumberOptionsGenerator(mergedMaskitoOptions)
        )
      : undefined
  )

  const maskitoOption = maskitoNumberOptionsGenerator(mergedMaskitoOptions)
  const maskitoInputRef = useMaskito({ options: maskitoOption })

  const mergedRef = useComposedRefs(ref, internalRef, maskitoInputRef)

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

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      if (newValue === "") {
        setInternalValue("")
        onValueChange?.({ maskedValue: undefined, unMaskedValue: undefined })
        return
      }

      const rawValue = maskitoParseNumber(newValue, mergedMaskitoOptions)

      setInternalValue(newValue)
      onValueChange?.({ maskedValue: newValue, unMaskedValue: rawValue })
      onInput?.(e)
    },
    [onValueChange, onInput, mergedMaskitoOptions]
  )

  const handleClear = useCallback(() => {
    if (internalRef.current) {
      internalRef.current.value = ""
      internalRef.current.focus()
    }

    setInternalValue("")
    onValueChange?.({ maskedValue: undefined, unMaskedValue: undefined })
    formComposition?.onClear?.()
  }, [onValueChange, formComposition])

  const currentValue =
    value !== undefined
      ? maskitoTransform(value.toString(), maskitoOption)
      : internalValue || ""

  const hasValue = Boolean(
    defaultValue
      ? internalValue
      : currentValue && (currentValue as string).length
  )

  return (
    <FormComposition
      {...formComposition}
      hasValue={hasValue}
      onFormCompositionClick={() => internalRef.current?.focus()}
      onClear={handleClear}
      disabled={props.disabled}
      readonly={props.readOnly}
      isFocused={isFocused}
    >
      <FormControl>
        <input
          data-slot="input-number"
          className={cn(
            "placeholder:text-muted-foreground h-full w-full grow border-none bg-transparent focus:ring-0 focus:outline-hidden",
            className
          )}
          type="text"
          inputMode="decimal"
          placeholder={
            placeholder ||
            "Nhập " +
              lowercaseFirstChar(getNodeText(formComposition?.label) || "")
          }
          {...props}
          {...(!defaultValue
            ? { value: currentValue }
            : {
                defaultValue: maskitoTransform(
                  defaultValue.toString(),
                  maskitoOption
                ),
              })}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={mergedRef}
        />
      </FormControl>
    </FormComposition>
  )
}

export { InputNumber }
