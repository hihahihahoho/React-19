import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg]:size-4 [&_svg]:shrink-0 gap-1 ring-inset",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/80 ",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 [&_.x-button]:opacity-30",
        destructive:
          "bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground [&_.x-button]:opacity-30",
        lightGreen:
          "bg-green-100 ring-green-600/20  text-green-800 dark:bg-green-500/20 dark:text-green-400 ring-1 dark:ring-green-400/30 border-0",
        lightRed:
          "bg-red-100 ring-red-600/10 text-red-800 dark:bg-red-400/10 dark:text-red-400 ring-1 dark:ring-red-400/30 border-0",
        lightBlue:
          "bg-blue-100 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 ring-1 dark:ring-blue-400/30 text-blue-800 border-0",
        lightOrange:
          "bg-orange-10 ring-orange-700/10 text-orange-800 bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 ring-1 dark:ring-orange-400/30 border-0",
      },
      size: {
        sm: "text-xs px-2.5 py-0.5 min-h-6",
        md: "text-sm px-2.5 py-0.5 min-h-7",
        lg: "text-sm rounded-4 px-4 py-1 min-h-8",
      },
      hasLeftIcon: { true: "" },
      hasRightIcon: { true: "" },
    },

    compoundVariants: [
      { hasLeftIcon: true, size: "sm", className: "pl-2" },
      { hasLeftIcon: true, size: ["md", "lg"], className: "pl-2" },
      { hasRightIcon: true, size: "sm", className: "pr-2" },
      { hasRightIcon: true, size: ["md", "lg"], className: "pr-2" },
    ],
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  clearBtn?: boolean;
  onClearBtnClick?: () => void;
  iconClear?: string;
  iconLeft?: string;
  iconRight?: string;
  tooltip?: React.ReactNode;
}

function Badge({
  className,
  variant,
  size,
  clearBtn,
  onClearBtnClick,
  iconLeft,
  iconRight,
  tooltip,
  ...props
}: BadgeProps) {
  const badge = (
    <div
      className={cn(
        badgeVariants({
          variant,
          size,
          hasLeftIcon: !!iconLeft,
          hasRightIcon: !!(iconRight || clearBtn),
        }),
        className
      )}
      {...props}
    >
      {props.children}
      {clearBtn && (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onClearBtnClick?.();
          }}
        >
          <CircleX className="x-button" />
        </div>
      )}
    </div>
  );
  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}

export { Badge, badgeVariants };
