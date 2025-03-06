import { useMergedRef } from "@/hooks/use-merge-ref";
import { cn } from "@/lib/utils";
import { PopoverAnchor, PopoverContentProps } from "@radix-ui/react-popover";
import { Measurable } from "@radix-ui/rect";
import * as React from "react";
import { Command } from "../command";
import { Popover, PopoverContent } from "../popover";
import { SelectCommand } from "../select/select-command";
import { SelectGroup, SelectItems } from "../select/select-interface";
import { Input } from "./input";

export interface InputAutoCompleteProps
  extends Omit<React.ComponentProps<typeof Input>, "onValueChange"> {
  options: SelectItems[] | SelectGroup[];
  popoverContentProps?: PopoverContentProps;
  onValueChange?: (value: string) => void;
  value?: string;
  initialState?: React.ReactNode;
  loading?: boolean;
}

function InputAutoComplete({
  options,
  onBlur,
  formComposition,
  value,
  onValueChange,
  onChange,
  onFocus,
  popoverContentProps,
  loading,
  initialState,
  ref,
  ...props
}: InputAutoCompleteProps) {
  const formCompositionRef = React.useRef<HTMLDivElement>(null);
  const internalRef = React.useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(ref, internalRef);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [internalValue, setInternalValue] = React.useState("");
  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      setInputValue(internalValue);
    },
    [onBlur, internalValue]
  );
  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setOpen(true);
      onFocus?.(e);
    },
    [onFocus]
  );
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChange?.(e);
    },
    [onChange]
  );
  const handleOnSelect = React.useCallback(
    (selected: SelectItems) => {
      setInternalValue(selected.value);
      setInputValue(selected.value);
      onValueChange?.(selected.value);
      setOpen(false);
    },
    [onValueChange]
  );

  const currentValue = value !== undefined ? value : internalValue;
  console.log(currentValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor
        virtualRef={formCompositionRef as React.RefObject<Measurable>}
      />
      <Command className="overflow-visible" defaultValue={currentValue}>
        <Input
          ref={mergedRef}
          value={inputValue}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onChange={handleChange}
          autoComplete="off"
          {...props}
          formComposition={{
            ...formComposition,
            ref: formCompositionRef,
            onClear: () => {
              setInternalValue("");
              setInputValue("");
              formComposition?.onClear?.();
            },
          }}
        />
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if (
              internalRef.current &&
              internalRef.current.contains(e.target as Node)
            ) {
              e.preventDefault();
            } else {
              setOpen(false);
            }
          }}
          data-slot="select-popover-content"
          align="start"
          className={cn("p-0 popover-content-width-full")}
          onWheel={(e) => e.stopPropagation()}
          {...popoverContentProps}
        >
          {initialState ? (
            initialState
          ) : (
            <SelectCommand
              hideSearch
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
  );
}

export { InputAutoComplete };
