import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import * as React from "react";
import { ButtonProps, buttonVariants } from "./button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  title?: React.ReactNode;
} & Pick<ButtonProps, "size"> &
  Pick<ButtonProps, "iconOnly"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size,
  disabled,
  iconOnly,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "secondary" : "ghost",
        size,
        iconOnly: iconOnly,
        disabled,
      }),
      "px-1",
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  title,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  return (
    <PaginationLink
      aria-label={"Trước"}
      size="default"
      iconOnly={!title}
      className={cn("gap-1", title && "px-4", className)}
      {...props}
    >
      <ChevronLeft />
      {title && <span>{title}</span>}
    </PaginationLink>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  title,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  return (
    <PaginationLink
      aria-label={"Tiếp"}
      size="default"
      iconOnly={!title}
      className={cn("gap-1", title && "px-4", className)}
      {...props}
    >
      {title && <span>{title}</span>}
      <ChevronRight />
    </PaginationLink>
  );
};
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => {
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <Ellipsis className="size-4" />
      <span className="sr-only">Trang khác</span>
    </span>
  );
};
PaginationEllipsis.displayName = "PaginationEllipsis";

export type CombinedPaginationProps = {
  currentPage: number;
  totalPages: number;
  numberPageShow?: number;
  onPageChange?: (page: number) => void;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  className?: string;
  size?: ButtonProps["size"];
};

const CombinedPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPreviousClick,
  onNextClick,
  className,
  size,
}: CombinedPaginationProps) => {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const defaultSize = !isDesktop ? "sm" : size || "default";
  type PageItem = number | "ellipsis";

  const getPageNumbers = (): PageItem[] => {
    const maxItems = 5;

    if (totalPages <= maxItems) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const firstPage = 1;
    const lastPage = totalPages;

    if (currentPage <= 3) {
      return [1, 2, 3, "ellipsis", lastPage];
    } else if (currentPage >= totalPages - 2) {
      return [
        firstPage,
        "ellipsis",
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      return [firstPage, "ellipsis", currentPage, "ellipsis", lastPage];
    }
  };
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1);
      onPreviousClick?.();
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      onPageChange?.(currentPage + 1);
      onNextClick?.();
    }
  };

  const handlePageClick = (page: PageItem) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof page === "number") {
      onPageChange?.(page);
    }
  };

  return (
    <Pagination className={cn("select-none", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            title={isDesktop ? "Trước" : ""}
            href="#"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            size={defaultSize}
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={handlePageClick(page)}
                size={defaultSize}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            title={isDesktop ? "Tiếp" : ""}
            href="#"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            size={defaultSize}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export {
  CombinedPagination,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
