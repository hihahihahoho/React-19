import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },

      isRounded: {
        true: "rounded-full",
      },
      disabled: {
        true: "opacity-50 pointer-events-none",
      },
      size: {
        xs: "h-6 min-w-6 px-2 py-1 text-xs gap-1",
        default: "h-9 min-w-9 px-4 py-2",
        sm: "h-8 min-w-8 px-3",
        lg: "h-10 min-w-10 rounded-xl px-8",
      },
      iconOnly: {
        true: "p-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      iconOnly: false,
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  btnEventClick?: () => void;
  iconLeft?: string | React.ReactNode;
  iconRight?: string | React.ReactNode;
  isLoading?: boolean;
}

function Button({
  className,
  variant,
  size,
  iconOnly,
  asChild = false,
  iconLeft,
  iconRight,
  type = "button",
  isRounded,
  isLoading,
  disabled,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      type={type}
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
          iconOnly,
          isRounded,
          disabled,
        }),
        "flex items-center"
      )}
      disabled={isLoading || disabled || false}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {!isLoading && iconLeft && iconLeft}
      <Slottable>{props.children}</Slottable>
      {iconRight && iconRight}
    </Comp>
  );
}

export { Button, buttonVariants };
