import { cn } from "@/lib/utils";
import React from "react";

function SearchFormGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="search-form-grid"
      className={cn(
        "grid lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-4",
        className
      )}
      {...props}
    />
  );
}
SearchFormGrid.displayName = "SearchFormGrid";

function SectionGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-grid"
      className={cn("px-4 md:px-6", className)}
      {...props}
    />
  );
}
SectionGrid.displayName = "SectionGrid";

export { SearchFormGrid, SectionGrid };
