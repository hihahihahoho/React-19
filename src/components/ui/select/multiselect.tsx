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
import { flatItems, SelectCommand, SelectCommandProps } from "./select-command";
import { SelectGroup, SelectItems } from "./select-interface";
import { SelectPopover } from "./select-popover";

export interface MultiSelectProps
  extends Omit<React.ComponentProps<"button">, "value"> {
  placeholder?: string | React.ReactNode;
  placeholderColor?: string;
  options?: SelectItems[] | SelectGroup[];
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
  selectCommandProps?: SelectCommandProps;
  customDisplayValue?: SelectItems[];
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
  selectCommandProps,
  customDisplayValue,
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
  const currentItems =
    customDisplayValue ||
    flattenItems.filter((item) => currentValue.includes(item.value));

  return (
    <SelectPopover
      open={open}
      setOpen={setOpen}
      triggerContent={
        <FormComposition
          inputClear={true}
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
                items={currentItems.map((optionValue) => {
                  return {
                    key: optionValue.value,
                    content: (
                      <div className="flex items-center gap-1 max-w-[90px] overflow-hidden text-ellipsis">
                        {optionValue?.icon &&
                          (typeof optionValue.icon === "string" ? (
                            <Avatar size={"xs"}>
                              <AvatarImage src={optionValue.icon} />
                              <AvatarFallback>
                                {(optionValue.value || "").substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            optionValue.icon
                          ))}

                        <span className="overflow-hidden text-ellipsis">
                          {optionValue?.label || optionValue.value}
                        </span>
                      </div>
                    ),
                    removeButton: !optionValue?.disabled,
                    onRemove: () => handleRemove(optionValue.value),
                    badgeProps: optionValue?.badgeProps,
                  };
                })}
                maxShownItems={maxShownBadges}
                className={cn("-mx-2", className)}
                badgeMeasureClassName={badgeMeasureClassName}
                overflowMeasureClassName={overflowMeasureClassName}
                badgeProps={{
                  clearBtn: true,
                  variant: "secondary",
                  size: "md",
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
        {...selectCommandProps}
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
