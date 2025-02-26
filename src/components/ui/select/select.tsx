import { useMergedRef } from "@/hooks/use-merge-ref";
import { getNodeText } from "@/lib/get-node-text";
import { cn, lowercaseFirstChar } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import {
  FormComposition,
  FormCompositionProps,
  FormControlButton,
} from "../form/form";
import { flatItems, SelectCommand } from "./select-command";
import { SelectGroup, SelectItems } from "./select-interface";
import { SelectPopover } from "./select-popover";

export type OnValueChangeSelect = string | undefined;

export interface SelectProps {
  placeholder?: string | React.ReactNode;
  options: SelectItems[] | SelectGroup[];
  value?: OnValueChangeSelect;
  defaultValue?: OnValueChangeSelect;
  disabled?: boolean;
  formComposition?: FormCompositionProps;
  onValueChange?: (value: OnValueChangeSelect) => void;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  readonly?: boolean;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      placeholder,
      options,
      value,
      defaultValue,
      disabled = false,
      formComposition,
      onValueChange,
      onFocus,
      onBlur,
      readonly,
    },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(ref, internalRef);
    const [open, setOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] =
      useState<OnValueChangeSelect>(defaultValue);

    const flattenItems = flatItems(options);

    const handleValueChange = useCallback(
      (newValue: OnValueChangeSelect) => {
        setInternalValue(newValue);
        onValueChange?.(newValue);
      },
      [onValueChange]
    );

    const handleClear = useCallback(() => {
      handleValueChange(undefined);
      formComposition?.onClear?.();
      if (internalRef.current) {
        const button = internalRef.current.querySelector("button");
        button?.focus();
      }
    }, [formComposition, handleValueChange]);

    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = Boolean(currentValue);
    const selectedOption = flattenItems.find(
      (item) => item.value === currentValue
    );

    return (
      <SelectPopover
        open={open}
        setOpen={setOpen}
        triggerContent={
          <FormComposition
            clearWhenNotFocus={true}
            inputClear={false}
            iconRight={<ChevronDown className="opacity-50" />}
            {...formComposition}
            asChild
            ref={mergedRef}
            hasValue={hasValue}
            className={cn("cursor-pointer", formComposition?.className)}
            onClear={handleClear}
            disabled={disabled}
            focusWithin={false}
            readonly={readonly}
            isFocused={isFocused}
          >
            <FormControlButton
              disabled={disabled}
              onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                onBlur?.(e);
              }}
            >
              <div className={cn("flex items-center h-full flex-1")}>
                <div className="line-clamp-1">
                  {selectedOption?.label ? (
                    <div className="flex items-center gap-2">
                      {selectedOption?.icon &&
                        (typeof selectedOption.icon === "string" ? (
                          <Avatar size={"xs"}>
                            <AvatarImage src={selectedOption.icon} />
                            <AvatarFallback>
                              {(selectedOption.value || "").substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          selectedOption.icon
                        ))}
                      <span className="line-clamp-1">
                        {selectedOption?.label || selectedOption.value}
                      </span>
                    </div>
                  ) : (
                    <span
                      className={cn(!selectedOption && "text-muted-foreground")}
                    >
                      {placeholder ||
                        "Chọn " +
                          lowercaseFirstChar(
                            getNodeText(formComposition?.label) || ""
                          )}
                    </span>
                  )}
                </div>
              </div>
            </FormControlButton>
          </FormComposition>
        }
        label={formComposition?.label || placeholder || "Chọn"}
      >
        <SelectCommand
          items={options}
          selected={[currentValue || ""]}
          setSelected={(values) => handleValueChange(values[0])}
          onSelect={() => {
            setOpen(false);
          }}
        />
      </SelectPopover>
    );
  }
);

Select.displayName = "Select";

export { Select };
