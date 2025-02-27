import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Badge } from "../badge/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../command";
import { Checkbox } from "../selection-controls/checkbox";
import { SelectGroup, SelectItems } from "./select-interface";

function isSelectGroup(item: SelectItems | SelectGroup): item is SelectGroup {
  return (item as SelectGroup).options !== undefined;
}

export function modifyItems(options: SelectItems[] | SelectGroup[]) {
  return isSelectGroup(options[0])
    ? (options as SelectGroup[])
    : [
        {
          heading: undefined,
          options: options as SelectItems[],
          isMultiSelect: false,
        },
      ];
}

export function flatItems(options: SelectItems[] | SelectGroup[]) {
  return modifyItems(options).flatMap((item) => item.options);
}

interface SelectCommandProps {
  onSelect?: (selected: string) => void;
  selected?: string[];
  setSelected?: (selected: string[]) => void;
  defaultSelect?: string[];
  items: SelectItems[] | SelectGroup[];
  isCheckAll?: boolean;
  allMultiSelect?: boolean;
}

function SelectCommand({
  onSelect,
  selected: selectedProp,
  setSelected: setSelectedProp,
  defaultSelect = [],
  items,
  isCheckAll,
  allMultiSelect,
}: SelectCommandProps) {
  const flattenItems = flatItems(items);
  const modifyItemsNew = modifyItems(items);

  const isControlled = selectedProp !== undefined;

  const [uncontrolledSelected, setUncontrolledSelected] =
    React.useState<string[]>(defaultSelect);

  const selected = isControlled ? selectedProp! : uncontrolledSelected;

  const handleSetSelected = React.useCallback(
    (newValues: string[]) => {
      if (isControlled) {
        setSelectedProp?.(newValues);
      } else {
        setUncontrolledSelected(newValues);
      }
    },
    [isControlled, setSelectedProp]
  );

  const commandListRef = React.useRef<HTMLDivElement>(null);
  const showSearch = flattenItems.length > 5;
  const uniqueId = React.useId();

  const toggleOption = (item: SelectItems) => {
    const isSelected = selected.includes(item.value);
    const updated = isSelected
      ? selected.filter((val) => val !== item.value)
      : [...selected, item.value];

    handleSetSelected(updated);
  };

  const isAllSelected = flattenItems
    .filter((item) => !item.disabled)
    .every((item) => selected.includes(item.value));
  const toggleAll = () => {
    const selectedDisabledItems = flattenItems
      .filter((item) => item.disabled && selected.includes(item.value))
      .map((item) => item.value);

    if (isAllSelected) {
      handleSetSelected(selectedDisabledItems);
    } else {
      const enabledItems = flattenItems
        .filter((item) => !item.disabled)
        .map((item) => item.value);
      handleSetSelected([...selectedDisabledItems, ...enabledItems]);
    }
  };

  return (
    <Command defaultValue={selected.at(-1)}>
      {showSearch && <CommandInput placeholder="Tìm kiếm..." />}

      {isCheckAll && (
        <CommandGroup>
          <div className="flex items-center gap-2 px-2 pt-1 pb-2">
            <div className="flex-1">
              <Badge
                size={"md"}
                className="cursor-pointer select-none"
                variant={isAllSelected ? "lightBlue" : "secondary"}
                onClick={toggleAll}
              >
                <CheckCheck />
                <div>Chọn tất cả</div>
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Đã chọn {selected.length} / {flattenItems.length}
            </div>
          </div>
          <CommandSeparator />
        </CommandGroup>
      )}

      <CommandList ref={commandListRef} tabIndex={0}>
        <CommandEmpty>Không tìm thấy kết quả</CommandEmpty>

        {modifyItemsNew.map(
          ({ heading, options, isMultiSelect }, groupIndex) => (
            <React.Fragment key={uniqueId + groupIndex}>
              <CommandGroup heading={heading}>
                {options.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <CommandItem
                      {...option}
                      key={uniqueId + option.value}
                      value={option.value}
                      onSelect={() => {
                        onSelect?.(option.value);
                        if (isMultiSelect || allMultiSelect) {
                          toggleOption(option);
                          return;
                        }
                        handleSetSelected([option.value]);
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1 -md:text-base [&_svg]:size-4 -md:[&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground">
                        <div className="flex items-center flex-1 gap-2">
                          {option.icon &&
                            (typeof option.icon === "string" ? (
                              <Avatar size={"xs"}>
                                <AvatarImage src={option.icon} />
                                <AvatarFallback>
                                  {option.value.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              option.icon
                            ))}
                          {option.label}
                        </div>
                        {isMultiSelect || allMultiSelect ? (
                          <Checkbox
                            className="[&_svg]:!text-primary-foreground"
                            checked={isSelected}
                          />
                        ) : (
                          isSelected && (
                            <Check
                              className={cn(
                                "size-4 !text-foreground",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                          )
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {groupIndex < items.length - 1 && <CommandSeparator />}
            </React.Fragment>
          )
        )}
      </CommandList>
    </Command>
  );
}

export { isSelectGroup, SelectCommand };
