import { useItemOverflow } from "@/hooks/use-item-overflow";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Badge, BadgeProps } from "../badge/badge";

export interface OverflowBadgeGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: Array<{
    key: string;
    content: React.ReactNode;
    removeButton?: boolean;
    onRemove?: () => void;
    badgeProps?: BadgeProps;
  }>;
  maxShownItems?: number;
  minShowItems?: number;
  badgeMeasureClassName?: string;
  overflowMeasureClassName?: string;
  badgeProps?: BadgeProps;
}

function OverflowBadgeGroup({
  items,
  maxShownItems,
  minShowItems,
  className,
  badgeMeasureClassName = "measured-badge",
  overflowMeasureClassName = "measured-plus",
  badgeProps,
  ...props
}: OverflowBadgeGroupProps) {
  const { containerRef, overflowCount, isVisible } = useItemOverflow({
    totalItems: items.length,
    maxShownItems,
    minShowItems,
    itemClassName: badgeMeasureClassName,
    plusItemClassName: overflowMeasureClassName,
  });

  return (
    <div
      ref={containerRef}
      data-slot="overflow-badge-group"
      className={cn(
        "relative flex items-center h-full w-full gap-1 overflow-hidden whitespace-nowrap",
        className
      )}
      {...props}
    >
      {items.map((item, index) => {
        const visible = isVisible(index);
        return (
          <Badge
            key={item.key}
            variant="secondary"
            onClearBtnClick={item.onRemove}
            className={cn(
              badgeMeasureClassName,
              visible
                ? "relative opacity-100"
                : "absolute opacity-0 pointer-events-none"
            )}
            style={visible ? {} : { position: "absolute" }}
            aria-hidden={!visible}
            {...badgeProps}
            {...item.badgeProps}
            clearBtn={item.removeButton}
          >
            {item.content}
          </Badge>
        );
      })}
      {overflowCount > 0 && (
        <Badge
          {...badgeProps}
          clearBtn={false}
          className={cn(
            overflowMeasureClassName,
            "aspect-square text-center px-0 justify-center",
            "relative opacity-100"
          )}
        >
          {overflowCount > 99 ? ">99" : "+" + overflowCount}
        </Badge>
      )}
    </div>
  );
}

export { OverflowBadgeGroup };
