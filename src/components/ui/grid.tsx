import { cn } from "@/lib/utils";
import React from "react";

const SearchFormGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-4",
      className
    )}
    {...props}
  />
));
SearchFormGrid.displayName = "SearchFormGrid";

const SectionGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-4 md:px-6", className)} {...props} />
));
SectionGrid.displayName = "SectionGrid";

export { SearchFormGrid, SectionGrid };
