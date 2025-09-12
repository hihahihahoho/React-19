import {
  useItemOverflow,
  UseItemOverflowProps,
} from "@/hooks/use-item-overflow"
import { cn } from "@/lib/utils"
import * as React from "react"
import { Badge, BadgeProps } from "../badge/badge"

export interface OverflowBadgeGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<UseItemOverflowProps, "totalItems"> {
  items: Array<{
    key: string
    content: React.ReactNode
    removeButton?: boolean
    onRemove?: () => void
    badgeProps?: BadgeProps
  }>
  badgeMeasureClassName?: string
  overflowMeasureClassName?: string
  badgeProps?: BadgeProps
  reverseOrder?: boolean
}

function OverflowBadgeGroup({
  items,
  maxShownItems,
  minShowItems,
  className,
  badgeMeasureClassName = "measured-badge",
  overflowMeasureClassName = "measured-plus",
  overflowState = "collapse",
  badgeProps,
  reverseOrder = false,
  maxLine = 1,
  ...props
}: OverflowBadgeGroupProps) {
  const { containerRef, overflowCount, isVisible } = useItemOverflow({
    totalItems: items.length,
    maxShownItems,
    minShowItems,
    itemClassName: badgeMeasureClassName,
    plusItemClassName: overflowMeasureClassName,
    overflowState,
    maxLine,
  })

  // Create a copy of items array to avoid mutating the original
  const displayItems = reverseOrder ? [...items].reverse() : items

  return (
    <div
      ref={containerRef}
      data-slot="overflow-badge-group"
      className={cn(
        "relative flex h-full w-full flex-wrap items-center gap-1 whitespace-nowrap",
        (overflowState === "collapse" || maxLine > 1) && "py-[3px]",
        className
      )}
      {...props}
    >
      {displayItems.map((item, index) => {
        const visible = isVisible(index)
        return (
          <Badge
            key={item.key}
            variant="secondary"
            onClearBtnClick={item.onRemove}
            className={cn(
              badgeMeasureClassName,
              visible
                ? "relative opacity-100"
                : "pointer-events-none absolute opacity-0"
            )}
            style={visible ? {} : { position: "absolute" }}
            aria-hidden={!visible}
            {...badgeProps}
            {...item.badgeProps}
            clearBtn={item.removeButton}
          >
            {item.content}
          </Badge>
        )
      })}
      {overflowCount > 0 && (
        <Badge
          {...badgeProps}
          clearBtn={false}
          className={cn(
            overflowMeasureClassName,
            "aspect-square justify-center px-0 text-center",
            "relative opacity-100"
          )}
        >
          {overflowCount > 99 ? ">99" : "+" + overflowCount}
        </Badge>
      )}
    </div>
  )
}

export { OverflowBadgeGroup }
