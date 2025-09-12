import { cn } from "@/lib/utils"
import { Check, CheckCheck } from "lucide-react"
import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"
import { Badge } from "../badge/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
} from "../command"
import { Checkbox } from "../selection-controls/checkbox"
import { Separator } from "../separator"
import { SelectGroup, SelectItems } from "./select-interface"

function isSelectGroup(item: SelectItems | SelectGroup): item is SelectGroup {
  return (item as SelectGroup).options !== undefined
}

export function modifyItems(options: SelectItems[] | SelectGroup[] = []) {
  if (!options || options.length === 0) {
    return [{ heading: undefined, options: [], isMultiSelect: false }]
  }

  return isSelectGroup(options[0])
    ? (options as SelectGroup[])
    : [
        {
          heading: undefined,
          options: options as SelectItems[],
          isMultiSelect: false,
        },
      ]
}

export function flatItems(options: SelectItems[] | SelectGroup[] = []) {
  if (!options || options.length === 0) {
    return []
  }
  return modifyItems(options).flatMap((item) => item.options)
}

export interface UseSelectCommandProps {
  selected?: string[]
  setSelected?: (selected: string[]) => void
  defaultSelect?: string[]
  items?: SelectItems[] | SelectGroup[]
}

function useSelectCommand({
  selected: selectedProp,
  setSelected: setSelectedProp,
  defaultSelect = [],
  items = [],
}: UseSelectCommandProps) {
  const flattenItems = flatItems(items)

  const isControlled = selectedProp !== undefined
  const [uncontrolledSelected, setUncontrolledSelected] =
    React.useState<string[]>(defaultSelect)

  const selected = isControlled ? selectedProp! : uncontrolledSelected

  const handleSetSelected = React.useCallback(
    (newValues: string[]) => {
      if (isControlled) {
        setSelectedProp?.(newValues)
      } else {
        setUncontrolledSelected(newValues)
      }
    },
    [isControlled, setSelectedProp]
  )

  const toggleOption = React.useCallback(
    (item: SelectItems) => {
      const isSelected = selected.includes(item.value)
      const updated = isSelected
        ? selected.filter((val) => val !== item.value)
        : [...selected, item.value]

      handleSetSelected(updated)
    },
    [selected, handleSetSelected]
  )

  const isAllSelected = React.useMemo(
    () =>
      flattenItems
        .filter((item) => !item.disabled)
        .every((item) => selected.includes(item.value)),
    [flattenItems, selected]
  )

  const toggleAll = React.useCallback(() => {
    const selectedDisabledItems = flattenItems
      .filter((item) => item.disabled && selected.includes(item.value))
      .map((item) => item.value)

    if (isAllSelected) {
      handleSetSelected(selectedDisabledItems)
    } else {
      const enabledItems = flattenItems
        .filter((item) => !item.disabled)
        .map((item) => item.value)
      handleSetSelected([...selectedDisabledItems, ...enabledItems])
    }
  }, [flattenItems, isAllSelected, selected, handleSetSelected])

  return {
    selected,
    toggleOption,
    handleSetSelected,
    isAllSelected,
    toggleAll,
  }
}

interface SelectCommandItemProps {
  option: SelectItems
  isSelected: boolean
  isMultiSelect: boolean
  onSelect: () => void
  uniqueId: string
}

function SelectCommandItem({
  option,
  isSelected,
  isMultiSelect,
  onSelect,
  uniqueId,
}: SelectCommandItemProps) {
  const BadgeComp = option?.badgeProps?.variant ? Badge : React.Fragment

  return (
    <CommandItem
      {...option}
      key={uniqueId + option.value}
      value={option.value}
      onSelect={onSelect}
    >
      <div className="flex flex-1 items-center gap-3 max-md:text-base [&_svg]:shrink-0">
        <div className="flex flex-1 items-center gap-2">
          <BadgeComp
            {...(option?.badgeProps?.variant
              ? {
                  variant: option.badgeProps.variant,
                  size: "sm",
                }
              : {})}
          >
            {option.icon &&
              (typeof option.icon === "string" ? (
                <Avatar size={"xs"}>
                  <AvatarImage src={option.icon} />
                  <AvatarFallback>
                    {option.value.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div
                  className={cn(
                    !option?.badgeProps?.variant &&
                      "[&_svg]:text-muted-foreground [&_svg]:size-4 max-md:[&_svg]:size-5"
                  )}
                >
                  {option.icon}
                </div>
              ))}
            <div className="space-y-0.5">
              <div className="item">{option.label || option.value}</div>
              {option.description && (
                <div className="text-muted-foreground text-xs">
                  {option.description}
                </div>
              )}
            </div>
          </BadgeComp>
        </div>
        {isMultiSelect ? (
          <Checkbox
            className="[&_svg]:text-primary-foreground!"
            checked={isSelected}
          />
        ) : (
          isSelected && (
            <Check
              className={cn(
                "text-foreground! size-4",
                isSelected ? "opacity-100" : "opacity-0"
              )}
            />
          )
        )}
      </div>
    </CommandItem>
  )
}
export interface SelectCommandProps
  extends Omit<React.ComponentProps<typeof Command>, "onSelect"> {
  onSelect?: (selected: SelectItems) => void
  selected?: string[]
  setSelected?: (selected: string[]) => void
  defaultSelect?: string[]
  items?: SelectItems[] | SelectGroup[]
  isCheckAll?: boolean
  allMultiSelect?: boolean
  showSearch?: boolean
  commandWrapper?: boolean
  loading?: boolean
  minItemsToShowSearch?: number
  commandInputProps?: React.ComponentProps<typeof CommandInput>
  showSelectedItems?: boolean
  showEmptyState?: boolean
  contentBefore?: React.ReactNode
}

function SelectCommand({
  onSelect,
  selected: selectedProp,
  setSelected: setSelectedProp,
  defaultSelect = [],
  items = [],
  isCheckAll,
  allMultiSelect,
  showSearch = true,
  commandWrapper = true,
  loading,
  minItemsToShowSearch = 5,
  showSelectedItems = true,
  commandInputProps,
  showEmptyState = true,
  contentBefore,
  ...props
}: SelectCommandProps) {
  const flattenItems = flatItems(items)
  const modifyItemsNew = modifyItems(items)
  const Comp = commandWrapper ? Command : React.Fragment
  const commandListRef = React.useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = React.useState("")

  const uniqueId = React.useId()

  const {
    selected,
    toggleOption,
    handleSetSelected,
    isAllSelected,
    toggleAll,
  } = useSelectCommand({
    selected: selectedProp,
    setSelected: setSelectedProp,
    defaultSelect,
    items,
  })

  React.useEffect(() => {
    if (commandListRef.current && searchValue) {
      commandListRef.current.scrollTop = 0
    }
  }, [searchValue])

  const compProps = commandWrapper
    ? { defaultValue: selected.at(-1), ...props }
    : {}

  return (
    <Comp {...compProps}>
      {flattenItems.length > minItemsToShowSearch && showSearch ? (
        <CommandInput
          value={searchValue}
          onValueChange={setSearchValue}
          placeholder="Tìm kiếm..."
          {...commandInputProps}
        />
      ) : (
        <button autoFocus aria-hidden="true" className="sr-only" />
      )}

      {isCheckAll && (
        <>
          <div className="flex items-center gap-2 p-2">
            <div className="flex-1">
              <Badge
                size={"md"}
                className="cursor-pointer select-none"
                variant={isAllSelected ? "blue" : "secondary"}
                onClick={toggleAll}
              >
                <CheckCheck />
                <div>Chọn tất cả</div>
              </Badge>
            </div>
            <div className="text-muted-foreground text-sm">
              {selected.length} / {flattenItems.length}
            </div>
          </div>
          <Separator />
        </>
      )}

      <CommandList tabIndex={0}>
        {contentBefore}

        {loading ? (
          <CommandLoading />
        ) : (
          <>
            {showEmptyState && (
              <CommandEmpty>Không tìm thấy kết quả</CommandEmpty>
            )}

            {items &&
              items.length > 0 &&
              modifyItemsNew.map(
                ({ heading, options, isMultiSelect }, groupIndex) => (
                  <React.Fragment key={uniqueId + groupIndex}>
                    <CommandGroup heading={heading}>
                      {options
                        .filter((item) => {
                          if (showSelectedItems) return true
                          return !selected.includes(item.value)
                        })
                        .map((option) => {
                          const isSelected = selected.includes(option.value)

                          return (
                            <SelectCommandItem
                              key={uniqueId + option.value}
                              option={option}
                              isSelected={isSelected}
                              isMultiSelect={isMultiSelect || !!allMultiSelect}
                              uniqueId={uniqueId}
                              onSelect={() => {
                                onSelect?.(option)
                                if (isMultiSelect || allMultiSelect) {
                                  toggleOption(option)
                                  return
                                }
                                handleSetSelected([option.value])
                              }}
                            />
                          )
                        })}
                    </CommandGroup>
                    {groupIndex < modifyItemsNew.length - 1 && (
                      <CommandSeparator />
                    )}
                  </React.Fragment>
                )
              )}
          </>
        )}
      </CommandList>
    </Comp>
  )
}

export { isSelectGroup, SelectCommand, SelectCommandItem, useSelectCommand }
