import { getNodeText } from "@/lib/get-node-text";
import { cn, lowercaseFirstChar } from "@/lib/utils";
import React, {
  TextareaHTMLAttributes,
  useCallback,
  useRef,
  useState,
} from "react";
import {
  FormComposition,
  FormCompositionProps,
  FormControl,
} from "../form/form";
import { useAutosizeTextArea } from "./use-autosize-textarea";

export type OnValueChangeTextarea =
  TextareaHTMLAttributes<HTMLTextAreaElement>["value"];

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  formComposition?: FormCompositionProps;
  onValueChange?: (value: OnValueChangeTextarea) => void;
  maxHeight?: number;
  minHeight?: number;
  maxLength?: number;
}

function Textarea({
  onFocus,
  onBlur,
  className,
  formComposition,
  onChange,
  onValueChange,
  maxHeight = 300,
  minHeight = 54,
  maxLength = 200,
  placeholder,
  ...props
}: TextareaProps) {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const [internalValue, setInternalValue] = useState<OnValueChangeTextarea>(
    props.defaultValue
  );
  const [isFocused, setIsFocused] = useState(false);
  const [triggerAutoSize, setTriggerAutoSize] = useState("");
  const [charCount, setCharCount] = useState(0);

  useAutosizeTextArea({
    textAreaRef: internalRef,
    triggerAutoSize,
    maxHeight,
    minHeight,
  });

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      setTriggerAutoSize(newValue);
      setCharCount(newValue.length);
      onValueChange?.(newValue);
      onChange?.(e);
    },
    [onChange, onValueChange]
  );

  const handleClear = useCallback(() => {
    if (internalRef.current) {
      internalRef.current.value = "";
      internalRef.current.focus();
    }

    onValueChange?.("");
    setInternalValue("");
    setTriggerAutoSize("");
    setCharCount(0);
    formComposition?.onClear?.();
  }, [onValueChange, formComposition]);

  const currentValue = props.value !== undefined ? props.value : internalValue;
  const hasValue = Boolean(currentValue && (currentValue as string).length);

  // Initialize character count when component mounts or value changes
  React.useEffect(() => {
    if (currentValue) {
      setCharCount(currentValue.toString().length);
    }
  }, [currentValue]);

  return (
    <FormComposition
      data-slot="textarea"
      inputClear={false}
      {...formComposition}
      hasValue={hasValue}
      onFormCompositionClick={() => internalRef.current?.focus()}
      onClear={handleClear}
      disabled={props.disabled}
      readonly={props.readOnly}
      isFocused={isFocused}
      isMinHeight={true}
      subDescription={maxLength ? `${charCount}/${maxLength}` : `${charCount}`}
    >
      <FormControl>
        <textarea
          className={cn(
            "flex-grow bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground h-full w-full py-2",
            className
          )}
          placeholder={
            placeholder ||
            "Nhập " +
              lowercaseFirstChar(getNodeText(formComposition?.label) || "")
          }
          {...props}
          maxLength={maxLength}
          value={currentValue || ""}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={internalRef}
        />
      </FormControl>
    </FormComposition>
  );
}

export { Textarea };
