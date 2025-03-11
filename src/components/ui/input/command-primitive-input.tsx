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
  extends React.ComponentProps<typeof Command.Input> {
  formComposition?: FormCompositionProps;
}

function CommandPrimitiveInput({
  value,
  onFocus,
  onBlur,
  className,
  formComposition,
  onValueChange,
  ...props
}: CommandPrimitiveInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>(
    value?.toString() || ""
  );

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handelValueChange = (value: string) => {
    setInputValue(value);
    onValueChange?.(value);
  };

  const handleClear = () => {
    setInputValue("");
    onValueChange?.("");
  };

  return (
    <FormComposition
      data-slot="command-input"
      hasValue={!!inputValue}
      onClick={() => {}}
      disabled={props.disabled}
      isFocused={isFocused}
      iconLeft={<Search className="opacity-50" />}
      onClear={handleClear}
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
          value={inputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onValueChange={handelValueChange}
        />
      </FormControl>
    </FormComposition>
  );
}

export { CommandPrimitiveInput };
