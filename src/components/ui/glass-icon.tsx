import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const glassIconWraperVariants = cva(" relative", {
  variants: {
    size: {
      sm: "size-12",
      lg: "size-[72px]",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

const glassIconVariants = cva(
  "flex items-center justify-center backdrop-blur-md from-white/80 to-white/0 rounded-lg bg-gradient-to-tr z-[1] absolute text-white ring-1 ring-white dark:ring-white/20 dark:ring-inset",
  {
    variants: {
      variant: {
        default: "size-[34px] bottom-[3px] left-[3px]",
        card: "w-[30px] h-[42px] bottom-[3px] left-[7px]",
      },
      size: {
        sm: "[&_svg]:size-6",
        lg: "[&_svg]:size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
    compoundVariants: [
      {
        variant: "default",
        size: "lg",
        className: "size-[52px] ring-2 rounded-xl",
      },
      {
        variant: "card",
        size: "lg",
        className: "w-[45px] h-[64px] ring-2",
      },
    ],
  }
);

const glassIconColorVariants = {
  blue: "bg-blue-500 dark:bg-blue-600",
  green: "bg-green-500 dark:bg-green-600",
  red: "bg-red-500 dark:bg-red-600",
  purple: "bg-purple-500 dark:bg-purple-600",
  amber: "bg-amber-500 dark:bg-amber-600",
  rose: "bg-rose-500 dark:bg-rose-600",
  indigo: "bg-indigo-500 dark:bg-indigo-600",
  cyan: "bg-cyan-500 dark:bg-cyan-600",
  emerald: "bg-emerald-500 dark:bg-emerald-600",
  gray: "bg-primary dark:bg-primary/30",
};

const glassIconBackgroundVariants = cva("absolute z-[0] rounded-lg", {
  variants: {
    variant: {
      default: "size-[34px] absolute top-[4px] right-[5px] rotate-[15deg]",
      card: "w-[30px] h-[34px] top-[7px] right-[6px] rotate-[15deg]",
    },
    size: {
      sm: "",
      lg: "",
    },
    color: glassIconColorVariants,
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
    color: "gray",
  },
  compoundVariants: [
    {
      variant: "default",
      size: "lg",
      className: "size-[52px] rounded-xl top-[6px] right-[8px]",
    },
    {
      variant: "card",
      size: "lg",
      className: "w-[45px] h-[52px] top-[8px] right-[12px]",
    },
  ],
});

export interface GlassIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassIconVariants> {
  backgroundClassName?: string;
  color?: keyof typeof glassIconColorVariants;
}

function GlassIcon({
  className,
  variant,
  size,
  color,
  children,
  backgroundClassName,
  ...props
}: GlassIconProps) {
  return (
    <div
      className={cn(
        glassIconWraperVariants({
          size,
        }),
        className
      )}
      {...props}
    >
      <div
        className={cn(
          glassIconVariants({
            variant,
            size,
          }),
          className
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          glassIconBackgroundVariants({
            variant,
            size,
            color,
          }),
          backgroundClassName
        )}
      />
    </div>
  );
}

export { GlassIcon, glassIconColorVariants, glassIconVariants };
