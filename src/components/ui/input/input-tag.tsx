import { useHistoryState } from "@/hooks/use-history-state"
import { useMergedRef } from "@/hooks/use-merge-ref"
import { cn } from "@/lib/utils"
import { PopoverAnchor } from "@radix-ui/react-popover"
import { Measurable } from "@radix-ui/rect"
import { CommandInput } from "cmdk"
import * as React from "react"
import { Badge, BadgeProps } from "../badge/badge"
import { Command } from "../command"
import { FormComposition, FormCompositionProps } from "../form/form"
import { Popover, PopoverContent } from "../popover"
import { SelectCommand } from "../select/select-command"
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
  /** Whether to allow duplicate tags */
  allowDuplicates?: boolean
  /** Keys that trigger tag addition */
  triggerKeys?: string[]
  /** Content shown before search, like suggestions */
  initialState?: React.ReactNode
  /** Whether options are loading */
  loading?: boolean
  /** Min characters needed before showing search results */
  minCharToSearch?: number

  commndProps?: React.ComponentProps<typeof Command>
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
}

export function InputTag({
  options,
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  allowDuplicates = false,
  triggerKeys = ["Enter", ",", "Tab"],
  initialState,
  loading,
  minCharToSearch = 0,
  commndProps,
  historyOptions = {},
  formComposition,
  onFocus,
  onKeyDown,
  badgeProps,
  ref,
  ...props
}: InputTagProps) {
  // Refs setup
  const internalRef = React.useRef<HTMLInputElement>(null)
  const mergeRef = useMergedRef(internalRef, ref)
  const formCompositionRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // State management using history hook
  const [tags, setTags, undo, redo] = useHistoryState<string[]>(
    defaultValue,
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
  const shouldShowDropdown = React.useMemo(() => {
    // Always show dropdown when open is true, minCharToSearch <= 0, and options exist
    if (open && minCharToSearch <= 0 && options && options.length > 0) {
      return true
    }

    // Otherwise, show based on search term length vs minCharToSearch
    return (
      open &&
      inputValue.length >= minCharToSearch &&
      options &&
      options.length > 0
    )
  }, [open, minCharToSearch, inputValue, options])

  // Key event handlers for ctrl+z and ctrl+shift+z/ctrl+y
  const handleKeyDownGlobal = React.useCallback(
    (e: KeyboardEvent) => {
      // Only apply undo/redo when input is focused
      if (document.activeElement !== internalRef.current) {
        return // Do nothing if input is not focused
      }

      // If input has content, let browser handle the undo/redo
      if (inputValue) {
        return // Let browser handle normal input undo/redo when input has content
      }

      // Apply custom undo/redo for tag management when input is empty
      // Check for Ctrl+Z (undo)
      if (e.ctrlKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Check for Ctrl+Shift+Z or Ctrl+Y (redo)
      if (
        (e.ctrlKey && e.key.toLowerCase() === "z" && e.shiftKey) ||
        (e.ctrlKey && e.key.toLowerCase() === "y")
      ) {
        e.preventDefault()
        redo()
      }
    },
    [undo, redo, inputValue]
  )

  // Add global keyboard event listener for undo/redo
  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDownGlobal)
    return () => {
      window.removeEventListener("keydown", handleKeyDownGlobal)
    }
  }, [handleKeyDownGlobal])

  // Add a new tag
  const addTag = React.useCallback(
    (tagValue: string) => {
      if (!tagValue.trim()) return

      const newTagValue = tagValue.trim()

      if (!allowDuplicates && currentTags.includes(newTagValue)) {
        return
      }

      const newTags = [...currentTags, newTagValue]

      if (isControlled) {
        onValueChange?.(newTags)
      } else {
        setTags(newTags)
        onValueChange?.(newTags)
      }

      setInputValue("")
      setActiveTagIndex(null)
    },
    [allowDuplicates, currentTags, isControlled, onValueChange, setTags]
  )

  // Remove a tag
  const removeTag = React.useCallback(
    (indexToRemove: number) => {
      const newTags = currentTags.filter((_, index) => index !== indexToRemove)

      if (isControlled) {
        onValueChange?.(newTags)
      } else {
        setTags(newTags)
        onValueChange?.(newTags)
      }

      setActiveTagIndex(null)
      internalRef.current?.focus()
    },
    [currentTags, isControlled, onValueChange, setTags]
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

    // Show dropdown if typing or if minCharToSearch is 0 or negative
    setOpen(minCharToSearch <= 0 || value.length >= minCharToSearch)
    setActiveTagIndex(null)
  }

  // Handle keyboard interaction
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e)

    // Tag creation triggers
    if (triggerKeys.includes(e.key) && inputValue) {
      e.preventDefault()
      addTag(inputValue)
      return
    }

    // Handle backspace to remove last tag when input is empty
    if (e.key === "Backspace" && !inputValue && currentTags.length > 0) {
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
      removeTag(activeTagIndex)
      return
    }

    // Tag navigation with arrow keys when input is empty
    if (!inputValue) {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setActiveTagIndex((prev) => {
          if (prev === null) return currentTags.length - 1
          return prev <= 0 ? 0 : prev - 1
        })
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setActiveTagIndex((prev) => {
          if (prev === null) return 0
          return prev >= currentTags.length - 1 ? null : prev + 1
        })
      }
    }

    // Clear tag selection on Escape
    if (e.key === "Escape") {
      setActiveTagIndex(null)
    }
  }

  // Handle selection from dropdown
  const handleSelect = (selected: SelectItems) => {
    addTag(selected.value.toString())
    setOpen(false)
    internalRef.current?.focus()
  }

  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setActiveTagIndex(null)
      onFocus?.(e)

      // If minCharToSearch is 0 or negative, open dropdown on input focus
      if (minCharToSearch <= 0 && options && options.length > 0) {
        setOpen(true)
      }
    },
    [minCharToSearch, onFocus, options]
  )

  // Check for tag duplicates
  const isDuplicate = (tag: string) => {
    if (allowDuplicates) return false
    return currentTags.filter((t) => t === tag).length > 1
  }

  // Get duplicate count for a tag
  const getDuplicateCount = (tag: string) => {
    return currentTags.filter((t) => t === tag).length
  }

  const renderTag = (tag: string, index: number) => {
    const duplicate = isDuplicate(tag)
    const tagDisplay = (
      <Badge
        key={`${tag}-${index}`}
        size={"md"}
        variant="blue"
        className={cn(
          activeTagIndex === index && "ring-2 ring-blue-500",
          duplicate && !allowDuplicates && "ring-2 ring-destructive"
        )}
        clearBtn={true}
        onClearBtnClick={() => removeTag(index)}
        onClick={(e) => {
          e.stopPropagation()
          console.log(index)
          setActiveTagIndex(index)
        }}
        {...badgeProps}
      >
        {tag}
      </Badge>
    )

    if (duplicate) {
      return (
        <TooltipProvider key={`${tag}-${index}`}>
          <Tooltip>
            <TooltipTrigger asChild>{tagDisplay}</TooltipTrigger>
            <TooltipContent>
              <p>Duplicate tag ({getDuplicateCount(tag)} occurrences)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return tagDisplay
  }

  const inputArea = (
    <div className="-mx-2 flex min-h-full flex-1 flex-wrap gap-1 py-[3px]">
      {currentTags.map((tag, index) => renderTag(tag, index))}
      <div ref={formCompositionRef} className="min-w-[120px] flex-1 px-2 py-1">
        <CommandInput
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
          {...props}
        />
      </div>
    </div>
  )

  return (
    <FormComposition
      ref={containerRef}
      isMinHeight
      {...formComposition}
      onFormCompositionClick={() => {
        internalRef.current?.focus()
      }}
    >
      <Popover open={shouldShowDropdown} onOpenChange={setOpen}>
        <PopoverAnchor
          virtualRef={formCompositionRef as React.RefObject<Measurable>}
        />
        <Command {...commndProps} className="overflow-visible">
          {inputArea}
          {shouldShowDropdown && (
            <PopoverContent
              onOpenAutoFocus={(e) => e.preventDefault()}
              align="start"
              className="w-[var(--radix-popover-trigger-width)] p-0"
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
                commandWrapper={false}
                loading={loading}
              />
            </PopoverContent>
          )}
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
