"use client"

import { useHistoryState } from "@/hooks/use-history-state"
import { useMergedRef } from "@/hooks/use-merge-ref"
import { cn } from "@/lib/utils"
import { PopoverAnchor } from "@radix-ui/react-popover"
import { Measurable } from "@radix-ui/rect"
import { CommandInput, useCommandState } from "cmdk"
import { AlertCircle, PlusCircle } from "lucide-react"
import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"
import { Badge, BadgeProps } from "../badge/badge"
import { Command, CommandGroup, CommandItem } from "../command"
import { FormComposition, FormCompositionProps } from "../form/form"
import { Popover, PopoverContent } from "../popover"
import { flatItems, SelectCommand } from "../select/select-command"
import { SelectGroup, SelectItems } from "../select/select-interface"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip"
import { Input } from "./input"

export interface InputTagProps
  extends Omit<
    React.ComponentProps<typeof Input>,
    "value" | "onChange" | "defaultValue" | "onValueChange"
  > {
  /** Options displayed for tag suggestions */
  options?: SelectItems[] | SelectGroup[]
  /** Current selected tags (controlled) */
  value?: string[]
  /** Default tags (uncontrolled) */
  defaultValue?: string[]
  /** Called when tags change */
  onValueChange?: (value: string[]) => void
  onSearchChange?: (value: string) => void
  /** Whether to allow duplicate tags */
  allowDuplicates?: boolean
  /** Keys that trigger tag addition */
  triggerKeys?: string[]
  /** Content shown before search, like suggestions */
  initialState?: React.ReactNode
  /** Whether options are loading */
  loading?: boolean
  /** Min characters needed before showing search results, set to 0 to show default suggestion list */
  minCharToSearch?: number

  commandProps?: React.ComponentProps<typeof Command>

  selectCommandProps?: React.ComponentProps<typeof SelectCommand>
  /** History state options */
  historyOptions?: {
    commitEvery?: number
    throttle?: number
    debounce?: number
    maxHistory?: number
  }
  /** Form composition props */
  formComposition?: FormCompositionProps
  /** Props passed to each tag badge */
  badgeProps?: BadgeProps
  /**
   * Custom display values to render instead of the actual selected values.
   * Useful when you want to show different content than what's stored in the tag values.
   * Each item should follow the SelectItems interface with properties like label, icon, etc.
   */
  customDisplayValue?: SelectItems[]

  /**
   * Display mode for the input tag component:
   * - "default": Allows free text entry with tag creation on trigger keys
   * - "select": Only allows selecting tags from the provided options list
   */
  mode?: "default" | "select"

  disabled?: boolean

  onUndo?: () => void
  onRedo?: () => void
}

export function InputTag({
  options,
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  allowDuplicates = false,
  triggerKeys = [",", "Tab"],
  initialState,
  loading,
  minCharToSearch = 0,
  commandProps,
  historyOptions = {},
  formComposition,
  onFocus,
  onKeyDown,
  badgeProps,
  mode = "default",
  ref,
  customDisplayValue,
  selectCommandProps,
  onUndo,
  onRedo,
  onSearchChange,
  disabled,
}: InputTagProps) {
  // Refs setup
  const internalRef = React.useRef<HTMLInputElement>(null)
  const mergeRef = useMergedRef(internalRef, ref)
  const formCompositionRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // State management using history hook
  const [tags, setTags, undo, redo] = useHistoryState<string[]>(
    controlledValue || defaultValue,
    historyOptions
  )
  const [inputValue, setInputValue] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(
    null
  )

  // Controlled vs uncontrolled handling
  const isControlled = controlledValue !== undefined
  const currentTags = isControlled ? controlledValue : tags

  // Check if we should show suggestion dropdown
  // Modified the shouldShowDropdown condition to properly handle the minCharToSearch condition
  // Determine whether to show the dropdown suggestions
  const shouldShowDropdown = React.useMemo(() => {
    // Always show when loading
    if (loading && open) {
      return true
    }

    // Must have the dropdown marked as open to proceed
    if (!open) {
      return false
    }

    // Has content in search box
    if (inputValue) {
      return true
    }

    // If no minimum search requirement and we have options
    if (minCharToSearch <= 0 && options && options.length > 0) {
      return true
    }

    // Has typed enough characters to meet search threshold
    return inputValue.length >= minCharToSearch && options && options.length > 0
  }, [open, loading, inputValue, minCharToSearch, options])

  React.useEffect(() => {
    if (isControlled) {
      onValueChange?.(tags)
    }
  }, [tags, isControlled])

  // Add a new tag
  const addTag = React.useCallback(
    (tagValue: string) => {
      if (!tagValue.trim()) return

      const newTagValue = tagValue.trim()

      if (!allowDuplicates && currentTags.includes(newTagValue)) {
        return
      }

      const newTags = [...currentTags, newTagValue]

      onValueChange?.(newTags)
      setTags(newTags)

      setInputValue("")
      setActiveTagIndex(null)
    },
    [allowDuplicates, currentTags, isControlled, onValueChange, setTags]
  )

  // Remove a tag
  const removeTag = React.useCallback(
    (indexToRemove: number) => {
      const newTags = currentTags.filter((_, index) => index !== indexToRemove)

      onValueChange?.(newTags)
      setTags(newTags)

      // Focus previous tag if available, otherwise keep focus on input
      if (indexToRemove > 0) {
        setActiveTagIndex(indexToRemove - 1)
      } else if (newTags.length > 0) {
        setActiveTagIndex(0) // Focus first tag if removing first tag and others exist
      } else {
        setActiveTagIndex(null)
        internalRef.current?.focus() // Focus input if no tags left
      }
    },
    [currentTags, isControlled, onValueChange, setTags]
  )

  const handleKeyDownGlobal = React.useCallback(
    (e: KeyboardEvent) => {
      // Check if focus is within the container instead of just the input
      if (!containerRef.current?.contains(document.activeElement as Node)) {
        return // Do nothing if focus is not within container
      }

      // If input has content and input is focused, let default handlers work
      const isInputFocused = document.activeElement === internalRef.current
      if (inputValue && isInputFocused) {
        return
      }

      // Apply custom undo/redo for tag management when input is empty
      if (e.ctrlKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault()
        onUndo?.()
        undo()
        return
      }

      // Check for Ctrl+Shift+Z or Ctrl+Y (redo)
      if (
        (e.ctrlKey && e.key.toLowerCase() === "z" && e.shiftKey) ||
        (e.ctrlKey && e.key.toLowerCase() === "y")
      ) {
        e.preventDefault()
        onRedo?.()
        redo()
        return
      }

      // Handle tag navigation with arrow keys when container has focus
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setActiveTagIndex((prev) => {
          if (prev === null) return currentTags.length - 1
          return prev <= 0 ? 0 : prev - 1
        })
        return
      }

      if (e.key === "ArrowRight") {
        e.preventDefault()
        setActiveTagIndex((prev) => {
          if (prev === null) return 0
          // If we're at the last tag, focus the input instead
          if (prev >= currentTags.length - 1) {
            internalRef.current?.focus()
            return null
          }
          return prev + 1
        })
        return
      }

      // Handle backspace to remove last tag when input is empty
      if (
        e.key === "Backspace" &&
        !inputValue &&
        currentTags.length > 0 &&
        isInputFocused
      ) {
        e.preventDefault()
        if (activeTagIndex !== null) {
          // Remove currently selected tag
          removeTag(activeTagIndex)
        } else {
          // Select last tag for potential removal
          setActiveTagIndex(currentTags.length - 1)
        }
        return
      }

      // Handle delete key on selected tag
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        activeTagIndex !== null
      ) {
        // Only handle if we're not typing in the input
        if (!isInputFocused) {
          removeTag(activeTagIndex)
          e.preventDefault()
          return
        }
      }

      // Clear tag selection on Escape
      if (e.key === "Escape") {
        setActiveTagIndex(null)
        internalRef.current?.focus()
        return
      }
    },
    [
      undo,
      redo,
      inputValue,
      containerRef,
      currentTags,
      internalRef,
      activeTagIndex,
      onUndo,
      onRedo,
      removeTag,
    ]
  )

  const handleComponentKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      // Handle delete key on selected tag from anywhere
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        activeTagIndex !== null
      ) {
        // Only handle if we're not typing in the input
        if (document.activeElement !== internalRef.current) {
          removeTag(activeTagIndex)
          e.preventDefault()
        }
      }

      // Clear tag selection on Escape
      if (e.key === "Escape") {
        setActiveTagIndex(null)
      }
    },
    [activeTagIndex, removeTag]
  )

  // Add global keyboard event listener for undo/redo
  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDownGlobal)
    return () => {
      window.removeEventListener("keydown", handleKeyDownGlobal)
    }
  }, [handleKeyDownGlobal])

  // Add global keyboard event listener for tag deletion
  React.useEffect(() => {
    // Only add the listener if we have a selected tag
    if (activeTagIndex !== null) {
      window.addEventListener("keydown", handleComponentKeyDown)
      return () => {
        window.removeEventListener("keydown", handleComponentKeyDown)
      }
    }
  }, [handleComponentKeyDown, activeTagIndex])

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Skip if no tag is selected
      if (activeTagIndex === null) return

      // Check if click is outside the container
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveTagIndex(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeTagIndex])

  // Handle input changes
  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (onSearchChange) {
      onSearchChange(value)
    }

    // Show dropdown if typing or if minCharToSearch is 0 or negative
    setOpen(minCharToSearch <= 0 || value.length >= minCharToSearch)
    setActiveTagIndex(null)
  }

  // Handle keyboard interaction
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e)

    // Tag creation triggers - only in default mode
    if (mode === "default" && triggerKeys.includes(e.key) && inputValue) {
      e.preventDefault()
      addTag(inputValue)
      return
    }

    // Let the global handler handle the rest
  }

  // Handle selection from dropdown
  const handleSelect = (selected: SelectItems) => {
    addTag(selected.value.toString())
    // setOpen(false)
    internalRef.current?.focus()
  }

  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setActiveTagIndex(null)
      onFocus?.(e)

      // Only open dropdown if we have options to display
      if (options && options.length > 0) {
        // Case 1: No minimum search requirement
        if (minCharToSearch <= 0) {
          setOpen(true)
          return
        }

        // Case 2: Input already has text that meets minimum search requirement
        if (inputValue && inputValue.length >= minCharToSearch) {
          setOpen(true)
          return
        }
      }
    },
    [minCharToSearch, onFocus, options, inputValue]
  )

  // Check for tag duplicates
  const isDuplicate = (tag: string) => {
    return currentTags.filter((t) => t === tag).length > 1
  }

  // Get duplicate count for a tag
  const getDuplicateCount = (tag: string) => {
    return currentTags.filter((t) => t === tag).length
  }

  const renderTag = (tag: string, index: number, display?: SelectItems) => {
    const duplicate = isDuplicate(tag)
    const tagContent =
      display || flatItems(options)?.find((o) => o.value === tag)

    const tagDisplay = (
      <Badge
        key={`${tag}-${index}`}
        size={"md"}
        variant={duplicate ? "red" : "blue"}
        className={cn(activeTagIndex === index && "ring-2 ring-blue-500")}
        clearBtn={true}
        onClearBtnClick={() => {
          removeTag(index)
        }}
        onClick={(e) => {
          e.stopPropagation()
          setActiveTagIndex(index)
        }}
        {...badgeProps}
        {...tagContent?.badgeProps}
      >
        {tagContent?.icon &&
          (typeof tagContent.icon === "string" ? (
            <Avatar size={"xs"}>
              <AvatarImage src={tagContent.icon} />
              <AvatarFallback>
                {(tagContent.value || "").substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            tagContent.icon
          ))}

        <span className="overflow-hidden text-ellipsis">
          {tagContent?.label || tagContent?.value || tag}
        </span>
      </Badge>
    )

    if (duplicate) {
      return (
        <TooltipProvider key={`${tag}-${index}`}>
          <Tooltip>
            <TooltipTrigger asChild>{tagDisplay}</TooltipTrigger>
            <TooltipContent>
              <p>Trùng lặp: {getDuplicateCount(tag)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return tagDisplay
  }
  const inputArea = (
    <div className="flex min-h-full flex-1 flex-wrap gap-1 py-[3px]">
      {customDisplayValue?.map((tag, index) => renderTag("", index, tag)) ||
        currentTags.map((tag, index) => renderTag(tag, index))}
      <div ref={formCompositionRef} className="h-7 min-w-[120px] flex-1 px-2">
        <CommandInput
          {...selectCommandProps?.commandInputProps}
          ref={mergeRef}
          value={inputValue}
          onValueChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="h-full w-full flex-grow border-none bg-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
          placeholder={
            currentTags.length > 0 ? "Thêm..." : "Gõ để nhập tags..."
          }
          autoComplete="off"
          disabled={disabled}
        />
      </div>
    </div>
  )

  return (
    <FormComposition
      ref={containerRef}
      isMinHeight
      inputClear={true}
      clearWhenNotFocus={true}
      hasValue={currentTags.length > 0}
      {...formComposition}
      onClear={() => {
        setTags([])
        onValueChange?.([])
        setActiveTagIndex(null)
      }}
      className={cn(
        !formComposition?.iconLeft && "pl-1",
        formComposition?.className
      )}
      onFormCompositionClick={() => {
        internalRef.current?.focus()
      }}
      disabled={disabled}
    >
      <Popover open={shouldShowDropdown} onOpenChange={setOpen}>
        <PopoverAnchor
          virtualRef={formCompositionRef as React.RefObject<Measurable>}
        />
        <Command
          {...commandProps}
          className="overflow-visible focus-visible:outline-none"
        >
          {inputArea}
          <PopoverContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            align="start"
            className={cn(
              "w-[var(--radix-popover-trigger-width)] p-0",
              "has-[[cmdk-group]:first-child:last-child>[cmdk-group-items]:empty]:hidden"
            )}
            onWheel={(e) => e.stopPropagation()}
            onInteractOutside={(e) => {
              if (
                formCompositionRef.current &&
                formCompositionRef.current.contains(e.target as Node)
              ) {
                e.preventDefault()
              } else {
                setOpen(false)
              }
            }}
          >
            <SelectCommand
              showSearch={false}
              items={options}
              onSelect={handleSelect}
              selected={currentTags}
              commandWrapper={false}
              loading={loading}
              showSelectedItems={false}
              contentBefore={
                mode === "default" ? (
                  <AddNewButton
                    onSelect={(value) => addTag(value)}
                    existingTags={currentTags}
                  />
                ) : null
              }
              showEmptyState={false}
              {...selectCommandProps}
            />
          </PopoverContent>
          {initialState && inputValue.length < minCharToSearch && open && (
            <PopoverContent
              onOpenAutoFocus={(e) => e.preventDefault()}
              align="start"
              className="w-[var(--radix-popover-trigger-width)]"
              onWheel={(e) => e.stopPropagation()}
            >
              {initialState}
            </PopoverContent>
          )}
        </Command>
      </Popover>
    </FormComposition>
  )
}

function AddNewButton({
  onSelect,
  existingTags = [],
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onSelect?: (value: string) => void
  existingTags?: string[]
}) {
  const search = useCommandState((state) => state.search)
  if (search === "") return null

  const isDuplicate = existingTags.includes(search.trim())

  return (
    <CommandGroup forceMount>
      <CommandItem
        forceMount
        key={search}
        value={search}
        className={cn("gap-1", isDuplicate && "text-destructive")}
        onSelect={() => onSelect?.(search)}
        {...props}
      >
        {isDuplicate ? (
          <AlertCircle className="size-4 text-destructive" />
        ) : (
          <PlusCircle className="size-4" />
        )}
        <strong>
          {search}
          {isDuplicate && <span className="text-xs font-normal"> (trùng)</span>}
        </strong>
      </CommandItem>
    </CommandGroup>
  )
}
