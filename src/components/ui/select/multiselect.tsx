import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { OverflowBadgeGroup } from "../badge/overflow-badge-group";
import {
  FormComposition,
  FormCompositionProps,
  FormControlButton,
} from "../form/form";
import { flatItems, SelectCommand } from "./select-command";
import { SelectGroup, SelectItems } from "./select-interface";
import { SelectPopover } from "./select-popover";

export interface MultiSelectProps
  extends Omit<React.ComponentProps<"button">, "value"> {
  placeholder?: string | React.ReactNode;
  placeholderColor?: string;
  options: SelectItems[] | SelectGroup[];
  value?: string[] | null;
  defaultValue?: string[];
  className?: string;
  badgeClassName?: string;
  badgeMeasureClassName?: string;
  overflowMeasureClassName?: string;
  disabled?: boolean;
  formComposition?: FormCompositionProps;
  maxShownBadges?: number;
  onValueChange?: (value: string[]) => void;
  readonly?: boolean;
  showClear?: boolean;
}

function MultiSelect({
  options,
  value,
  defaultValue = [],
  disabled = false,
  formComposition,
  onValueChange,
  readonly,
  className,
  badgeMeasureClassName,
  overflowMeasureClassName,
  placeholder = "Select",
  placeholderColor = "text-muted-foreground",
  maxShownBadges,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [internalValue, setInternalValue] =
    React.useState<string[]>(defaultValue);

  const flattenItems = flatItems(options);
  const currentValue = React.useMemo(
    () => (value !== undefined ? value || [] : internalValue),
    [value, internalValue]
  );
  const hasValue = currentValue.length > 0;

  const handleValueChange = React.useCallback(
    (newOptions: string[]) => {
      setInternalValue(newOptions);
      onValueChange?.(newOptions);
    },
    [onValueChange]
  );

  const handleClear = React.useCallback(() => {
    handleValueChange([]);
    formComposition?.onClear?.();
  }, [formComposition, handleValueChange]);

  const handleRemove = React.useCallback(
    (optionValue: string) => {
      const newOptions = currentValue.filter((v) => v !== optionValue);
      handleValueChange(newOptions);
    },
    [currentValue, handleValueChange]
  );

  // Validate options against available choices
  React.useEffect(() => {
    if (!currentValue?.length || !flattenItems?.length) return;

    const validOptions = currentValue.filter((selected) =>
      flattenItems.some((option) => option.value === selected)
    );

    if (validOptions.length !== currentValue.length) {
      handleValueChange(validOptions);
    }
  }, [currentValue, flattenItems, handleValueChange]);

  return (
    <SelectPopover
      open={open}
      setOpen={setOpen}
      triggerContent={
        <FormComposition
          inputClear={false}
          {...formComposition}
          className={cn("cursor-pointer", formComposition?.className)}
          asChild
          clearWhenNotFocus={true}
          isMinHeight={true}
          hasValue={hasValue}
          onClear={handleClear}
          iconRight={<ChevronDown className="opacity-50" />}
          disabled={disabled}
          readonly={readonly}
          isFocused={isFocused}
          focusWithin={false}
        >
          <FormControlButton
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          >
            {currentValue.length > 0 ? (
              <OverflowBadgeGroup
                items={currentValue.map((optionValue) => {
                  const option = flattenItems.find(
                    (o) => o.value === optionValue
                  );
                  return {
                    key: optionValue,
                    content: (
                      <div className="flex items-center gap-1 max-w-[90px] overflow-hidden text-ellipsis">
                        {option?.icon &&
                          (typeof option.icon === "string" ? (
                            <Avatar size={"xs"}>
                              <AvatarImage src={option.icon} />
                              <AvatarFallback>
                                {(optionValue || "").substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            option.icon
                          ))}
                        <span className="overflow-hidden text-ellipsis">
                          {option?.label || optionValue}
                        </span>
                      </div>
                    ),
                    removeButton: !option?.disabled,
                    onRemove: () => handleRemove(optionValue),
                  };
                })}
                maxShownItems={maxShownBadges}
                className={cn("-mx-1.5", className)}
                badgeMeasureClassName={badgeMeasureClassName}
                overflowMeasureClassName={overflowMeasureClassName}
                badgeProps={{
                  clearBtn: true,
                }}
              />
            ) : (
              <div
                className={cn(
                  "w-full h-full flex items-center",
                  placeholderColor
                )}
              >
                {placeholder}
              </div>
            )}
          </FormControlButton>
        </FormComposition>
      }
      label={formComposition?.label || placeholder}
    >
      <SelectCommand
        items={options}
        selected={currentValue}
        setSelected={handleValueChange}
        isCheckAll={true}
        allMultiSelect={true}
      />
    </SelectPopover>
  );
}

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
