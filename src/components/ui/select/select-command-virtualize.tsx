"use client"

import { fuzzyFilterStrings } from "@/lib/fuzzy-search"
import { getNodeText } from "@/lib/get-node-text"
import { CheckCheck } from "lucide-react"
import React from "react"
import { Virtualizer, VirtualizerHandle } from "virtua"
import { Badge } from "../badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandLoading,
} from "../command"
import { Separator } from "../separator"
import {
  flatItems,
  modifyItems,
  SelectCommandItem,
  SelectCommandProps,
  useSelectCommand,
} from "./select-command"

export interface SelectCommandVirtualizeProps extends SelectCommandProps {
  height?: string | number
  /**
   * Item size hint for unmeasured items in pixels.
   * If not set, initial item sizes will be automatically estimated from measured sizes (recommended).
   */
  itemSize?: number
  /**
   * Extra item space in pixels to render before/after the viewport.
   * Lower value will give better performance but you can increase to avoid showing blank items in fast scrolling.
   * @default 200
   */
  bufferSize?: number
}

function SelectCommandVirtualize({
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
  commandInputProps,
  showEmptyState = true,
  contentBefore,
  height = "auto",
  itemSize,
  bufferSize,
  ...props
}: SelectCommandVirtualizeProps) {
  // Memoize flattened and modified items to ensure stable references for React Compiler
  const flattenItems = React.useMemo(() => flatItems(items), [items])
  const modifyItemsNew = React.useMemo(() => modifyItems(items), [items])
  const Comp = commandWrapper ? Command : React.Fragment

  const [filter, setFilter] = React.useState("")
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const virtualizerRef = React.useRef<VirtualizerHandle>(null)
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

  // Create searchable strings for each item
  const searchableStrings = React.useMemo(
    () =>
      flattenItems.map((item) => {
        const label = item.label || item.value
        const itemText = getNodeText(label)
        // Combine all searchable parts of the item
        return [
          itemText,
          item.value,
          item.description,
          ...(item.keywords || []),
        ].join(" ")
      }),
    [flattenItems]
  )

  // Use the generic fuzzy filter
  const filteredItemIndices = React.useMemo(() => {
    if (!filter) {
      return flattenItems.map((_, index) => index)
    }

    const results = fuzzyFilterStrings(searchableStrings, filter)
    return results.map((result) => result.index)
  }, [searchableStrings, filter, flattenItems])

  // Map indices back to actual items
  const filteredItems = React.useMemo(
    () => filteredItemIndices.map((index) => flattenItems[index]),
    [filteredItemIndices, flattenItems]
  )

  // Scroll to top when filter changes
  React.useEffect(() => {
    if (virtualizerRef.current && filter.length > 0) {
      virtualizerRef.current.scrollToIndex(0)
    }
  }, [filter])

  // Scroll to the selected item on first open (when there is a selection and no active filter)
  const didInitialScrollRef = React.useRef(false)

  // Reset scroll flag when items change or when filter is cleared
  React.useEffect(() => {
    didInitialScrollRef.current = false
  }, [items])

  React.useEffect(() => {
    if (didInitialScrollRef.current) return
    if (filter) return
    if (!selected || selected.length === 0) return
    if (!virtualizerRef.current) return

    const lastSelected = selected.at(-1)
    if (!lastSelected) return

    const targetIndex = filteredItems.findIndex(
      (it) => it.value === lastSelected
    )

    if (targetIndex >= 0) {
      // Use a small delay to ensure virtualizer is fully initialized
      const timeoutId = setTimeout(() => {
        virtualizerRef.current?.scrollToIndex(targetIndex, {
          align: "center",
          smooth: false,
        })
        didInitialScrollRef.current = true
      }, 0)

      return () => clearTimeout(timeoutId)
    }
  }, [filter, selected, filteredItems])

  const compProps = commandWrapper
    ? { defaultValue: selected.at(-1), ...props }
    : {}

  return (
    <Comp shouldFilter={false} {...compProps}>
      {flattenItems.length > minItemsToShowSearch && showSearch && (
        <CommandInput
          placeholder="Tìm kiếm..."
          onValueChange={setFilter}
          {...commandInputProps}
        />
      )}

      {isCheckAll && (
        <>
          <div className="flex items-center gap-2 p-2">
            <div className="flex-1 text-left">
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

      <CommandList
        ref={scrollRef}
        tabIndex={0}
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          overflow: "auto",
          overflowAnchor: "none", // Required for virtua
        }}
      >
        {contentBefore}

        {loading ? (
          <CommandLoading />
        ) : (
          <>
            {showEmptyState && filteredItems.length === 0 && (
              <CommandEmpty>Không tìm thấy kết quả</CommandEmpty>
            )}

            {filteredItems.length > 0 && (
              <CommandGroup>
                <Virtualizer
                  ref={virtualizerRef}
                  scrollRef={scrollRef}
                  itemSize={itemSize}
                  bufferSize={bufferSize}
                >
                  {filteredItems.map((option) => {
                    const isItemSelected = selected.includes(option.value)
                    const isMultiSelect =
                      modifyItemsNew.some(
                        (group) =>
                          group.isMultiSelect &&
                          group.options.some(
                            (item) => item.value === option.value
                          )
                      ) || !!allMultiSelect

                    return (
                      <SelectCommandItem
                        key={uniqueId + option.value}
                        option={option}
                        isSelected={isItemSelected}
                        isMultiSelect={isMultiSelect}
                        uniqueId={uniqueId}
                        onSelect={() => {
                          onSelect?.(option)
                          if (isMultiSelect) {
                            toggleOption(option)
                            return
                          }
                          handleSetSelected([option.value])
                        }}
                      />
                    )
                  })}
                </Virtualizer>
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </Comp>
  )
}

export { SelectCommandVirtualize }
