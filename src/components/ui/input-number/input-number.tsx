import { useMergedRef } from "@/hooks/use-merge-ref";
import { getNodeText } from "@/lib/get-node-text";
import { cn, lowercaseFirstChar } from "@/lib/utils";
import { maskitoTransform } from "@maskito/core";
import {
  maskitoNumberOptionsGenerator,
  maskitoParseNumber,
} from "@maskito/kit";
import { useMaskito } from "@maskito/react";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import {
  FormComposition,
  FormCompositionProps,
  FormControl,
} from "../form/form";

export type OnValueChangeInputNumber = {
  maskedValue: string | undefined;
  unMaskedValue: number | undefined;
};

export interface InputNumberProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange"
  > {
  formComposition?: FormCompositionProps;
  maskitoOptions?: Parameters<typeof maskitoNumberOptionsGenerator>[0];
  value?: number | "";
  defaultValue?: number;
  onValueChange?: (value: OnValueChangeInputNumber) => void;
}

const defaultMaskitoOptions = {
  decimalSeparator: ".",
  thousandSeparator: ",",
  precision: 0,
  max: 99999999999999999999999999999999999999999999,
};
const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
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
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Maskito configuratio

    const mergedMaskitoOptions = {
      ...defaultMaskitoOptions,
      ...maskitoOptions,
    };

    const [internalValue, setInternalValue] = useState<string | undefined>(
      defaultValue !== undefined
        ? maskitoTransform(
            defaultValue.toString(),
            maskitoNumberOptionsGenerator(mergedMaskitoOptions)
          )
        : undefined
    );

    const maskitoOption = maskitoNumberOptionsGenerator(mergedMaskitoOptions);
    const maskitoInputRef = useMaskito({ options: maskitoOption });

    const mergedRef = useMergedRef(ref, internalRef, maskitoInputRef);

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur]
    );

    const handleInput = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (newValue === "") {
          setInternalValue("");
          onValueChange?.({ maskedValue: undefined, unMaskedValue: undefined });
          return;
        }

        const rawValue = maskitoParseNumber(
          newValue,
          mergedMaskitoOptions.decimalSeparator
        );

        setInternalValue(newValue);
        onValueChange?.({ maskedValue: newValue, unMaskedValue: rawValue });
        onInput?.(e);
      },
      [onValueChange, onInput, mergedMaskitoOptions.decimalSeparator]
    );

    const handleClear = useCallback(() => {
      if (internalRef.current) {
        internalRef.current.value = "";
        internalRef.current.focus();
      }

      setInternalValue("");
      onValueChange?.({ maskedValue: undefined, unMaskedValue: undefined });
      formComposition?.onClear?.();
    }, [onValueChange, formComposition]);

    const currentValue =
      value !== undefined
        ? maskitoTransform(value.toString(), maskitoOption)
        : internalValue || "";

    const hasValue = Boolean(
      defaultValue
        ? internalValue
        : currentValue && (currentValue as string).length
    );

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
            className={cn(
              "flex-grow bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground h-full w-full",
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
    );
  }
);

InputNumber.displayName = "InputNumber";

export { InputNumber };
