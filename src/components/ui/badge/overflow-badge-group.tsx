import { useItemOverflow } from "@/hooks/use-item-overflow";
import { useMergedRef } from "@/hooks/use-merge-ref";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Badge, BadgeProps } from "../badge/badge";

export interface OverflowBadgeGroupProps {
  items: Array<{
    key: string;
    content: React.ReactNode;
    removeButton?: boolean;
    onRemove?: () => void;
  }>;
  maxShownItems?: number;
  className?: string;
  badgeMeasureClassName?: string;
  overflowMeasureClassName?: string;
  badgeProps?: BadgeProps;
}

const OverflowBadgeGroup = React.forwardRef<
  HTMLDivElement,
  OverflowBadgeGroupProps
>(
  (
    {
      items,
      maxShownItems,
      className,
      badgeMeasureClassName = "measured-badge",
      overflowMeasureClassName = "measured-plus",
      badgeProps,
    },
    ref
  ) => {
    const { containerRef, overflowCount, isVisible } = useItemOverflow({
      totalItems: items.length,
      maxShownItems,
      itemClassName: badgeMeasureClassName,
      plusItemClassName: overflowMeasureClassName,
    });

    const mergedRef = useMergedRef(ref, containerRef);

    return (
      <div
        ref={mergedRef}
        className={cn(
          "relative flex items-center h-full w-full gap-1 overflow-hidden whitespace-nowrap",
          className
        )}
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
              clearBtn={item.removeButton}
            >
              {item.content}
            </Badge>
          );
        })}
        {overflowCount > 0 && (
          <Badge
            variant="outline"
            className={cn(
              overflowMeasureClassName,
              "w-8 text-center px-0 justify-center",
              "relative opacity-100"
            )}
          >
            {overflowCount > 99 ? ">99" : "+" + overflowCount}
          </Badge>
        )}
      </div>
    );
  }
);

OverflowBadgeGroup.displayName = "OverflowBadgeGroup";

export { OverflowBadgeGroup };
