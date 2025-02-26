import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  separator?: React.ReactNode;
}

function Breadcrumb({ ...props }: BreadcrumbProps) {
  return <nav data-slot="breadcrumb" aria-label="breadcrumb" {...props} />;
}
Breadcrumb.displayName = "Breadcrumb";

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className
      )}
      {...props}
    />
  );
}
BreadcrumbList.displayName = "BreadcrumbList";

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}
BreadcrumbItem.displayName = "BreadcrumbItem";

interface BreadcrumbLinkProps extends React.ComponentProps<"a"> {
  asChild?: boolean;
}

function BreadcrumbLink({ asChild, className, ...props }: BreadcrumbLinkProps) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  );
}
BreadcrumbLink.displayName = "BreadcrumbLink";

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  );
}
BreadcrumbPage.displayName = "BreadcrumbPage";

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More</span>
    </span>
  );
}
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
