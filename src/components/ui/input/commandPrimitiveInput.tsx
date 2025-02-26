import { cn } from "@/lib/utils";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import * as React from "react";
import {
  FormComposition,
  FormCompositionProps,
  FormControl,
} from "../form/form";

export interface CommandPrimitiveInputProps
  extends React.ComponentPropsWithRef<typeof Command.Input> {
  formComposition?: FormCompositionProps;
}

const CommandPrimitiveInput = React.forwardRef<
  HTMLInputElement,
  CommandPrimitiveInputProps
>(
  (
    {
      value,
      onFocus,
      onBlur,
      className,
      formComposition,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = React.useState(false);
    const [inputValue, setInputValue] = React.useState<string>(
      value?.toString() || ""
    );

    React.useImperativeHandle(ref, () => inputRef.current!);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const handleClear = () => {
      setInputValue("");
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
      formComposition?.onClear?.();
    };
    const handelValueChange = (value: string) => {
      setInputValue(value);
      onValueChange?.(value);
    };
    return (
      <FormComposition
        hasValue={!!inputValue}
        onFormCompositionClick={handleClick}
        onClick={() => {}}
        onClear={handleClear}
        disabled={props.disabled}
        isFocused={isFocused}
        iconLeft={<Search className="opacity-50" />}
        variant={"ghost"}
        {...formComposition}
        showErrorMsg={false}
      >
        <FormControl>
          <Command.Input
            {...props}
            className={cn(
              "flex-grow bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground h-full w-full",
              className
            )}
            ref={inputRef}
            value={inputValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onValueChange={handelValueChange}
          />
        </FormControl>
      </FormComposition>
    );
  }
);

CommandPrimitiveInput.displayName = "CommandPrimitiveInput";

export { CommandPrimitiveInput };
