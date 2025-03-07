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
  minCharToSearch?: number;
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
  ref,
  ...props
}: InputAutoCompleteProps) {
  const internalRef = React.useRef<HTMLInputElement>(null);
  const mergeRef = useMergedRef(internalRef, ref);
  const formCompositionRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [internalValue, setInternalValue] = React.useState("");
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
      console.log(selected);
      setInternalValue(selected.value);
      setInputValue(selected.value);
      onValueChange?.(selected.value);
      setOpen(false);
    },
    [onValueChange]
  );

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open);
      if (!open) {
        internalRef.current?.blur();
        setInputValue(internalValue);
      }
    },
    [internalValue]
  );

  const currentValue = value !== undefined ? value : internalValue;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverAnchor
        virtualRef={formCompositionRef as React.RefObject<Measurable>}
      />
      <Command className="overflow-visible" defaultValue={currentValue}>
        <Input
          value={inputValue}
          onFocus={handleFocus}
          onChange={handleChange}
          autoComplete="off"
          {...props}
          ref={mergeRef}
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
              formCompositionRef.current &&
              formCompositionRef.current.contains(e.target as Node)
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
          {inputValue.length < minCharToSearch ? (
            initialState || (
              <div className="p-6 text-sm text-center">
                Vui lòng nhập ít nhất {minCharToSearch} kí tự để tìm kiếm
              </div>
            )
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
