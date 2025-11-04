import { fuzzyFilterStrings } from "@/lib/fuzzy-search"
import { getNodeText } from "@/lib/get-node-text"
import { useVirtualizer, VirtualizerOptions } from "@tanstack/react-virtual"
import { CheckCheck } from "lucide-react"
import React from "react"
import { Badge } from "../badge/badge"
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
  virtualizerOptions?: Partial<VirtualizerOptions<HTMLDivElement, Element>>
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
  virtualizerOptions,
  ...props
}: SelectCommandVirtualizeProps) {
  const flattenItems = flatItems(items)
  const modifyItemsNew = modifyItems(items)
  const Comp = commandWrapper ? Command : React.Fragment

  const [filter, setFilter] = React.useState("")
  const parentRef = React.useRef<HTMLDivElement>(null)
  const rowRefsMap = React.useRef(new Map<number, HTMLDivElement>())
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

  // Create virtualized list with dynamic measurement
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32, // Initial height estimation
    overscan: 10,
    measureElement: (element, _entry, instance) => {
      const direction = instance.scrollDirection
      if (direction === "forward" || direction === null) {
        // Allow remeasuring when scrolling down or direction is null
        return element.clientHeight
      } else {
        // When scrolling up, use cached measurement to prevent stuttering
        const indexKey = Number(element.getAttribute("data-index"))
        const cachedMeasurement = instance.measurementsCache[indexKey]?.size
        return cachedMeasurement || element.clientHeight
      }
    },
    ...virtualizerOptions,
  })

  React.useEffect(() => {
    if (parentRef.current && filter.length > 0) {
      virtualizer.scrollToIndex(0)
    }
  }, [filter, virtualizer])

  // Scroll to the selected item on first open (when there is a selection and no active filter)
  const didInitialScrollRef = React.useRef(false)
  React.useEffect(() => {
    if (didInitialScrollRef.current) return
    if (filter) return
    if (!selected || selected.length === 0) return

    const lastSelected = selected.at(-1)
    if (!lastSelected) return

    const targetIndex = filteredItems.findIndex(
      (it) => it.value === lastSelected
    )
    if (targetIndex >= 0) {
      virtualizer.scrollToIndex(targetIndex, { align: "center" })
      didInitialScrollRef.current = true
    }
  }, [filter, selected, filteredItems, virtualizer])

  const virtualRows = virtualizer.getVirtualItems()

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

      <CommandList
        ref={parentRef}
        tabIndex={0}
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          overflow: "auto",
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

            <CommandGroup>
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualRows.map((virtualRow) => {
                  const option = filteredItems[virtualRow.index]
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
                    <div
                      key={uniqueId + option.value}
                      data-index={virtualRow.index}
                      ref={(el) => {
                        if (el) {
                          virtualizer.measureElement(el)
                          rowRefsMap.current.set(virtualRow.index, el)
                        }
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <SelectCommandItem
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
                    </div>
                  )
                })}
              </div>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Comp>
  )
}

export { SelectCommandVirtualize }
