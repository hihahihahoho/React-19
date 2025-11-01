import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react"
import * as React from "react"
import { ButtonProps, buttonVariants } from "./button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="pagination"
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="pagination-item" className={cn("", className)} {...props} />
  )
}

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
  title?: React.ReactNode
} & Pick<ButtonProps, "size"> &
  Pick<ButtonProps, "iconOnly"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size,
  disabled,
  iconOnly,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      data-slot="pagination-link"
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
  )
}

function PaginationPrevious({
  className,
  title,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      data-slot="pagination-previous"
      aria-label={"Trước"}
      size="default"
      iconOnly={!title}
      className={cn("gap-1", title && "px-4", className)}
      {...props}
    >
      <ChevronLeft />
      {title && <span>{title}</span>}
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  title,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      data-slot="pagination-next"
      aria-label={"Tiếp"}
      size="default"
      iconOnly={!title}
      className={cn("gap-1", title && "px-4", className)}
      {...props}
    >
      {title && <span>{title}</span>}
      <ChevronRight />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pagination-ellipsis"
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <Ellipsis className="size-4" />
      <span className="sr-only">Trang khác</span>
    </span>
  )
}

export type CombinedPaginationProps = {
  currentPage: number
  totalPages: number
  numberPageShow?: number
  onPageChange?: (page: number) => void
  onPreviousClick?: () => void
  onNextClick?: () => void
  className?: string
  size?: ButtonProps["size"]
}

function CombinedPagination({
  currentPage,
  totalPages,
  onPageChange,
  onPreviousClick,
  onNextClick,
  className,
  size,
}: CombinedPaginationProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const defaultSize = !isDesktop ? "sm" : size || "default"
  type PageItem = number | "ellipsis"

  const getPageNumbers = (): PageItem[] => {
    const maxItems = 5

    if (totalPages <= maxItems) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const firstPage = 1
    const lastPage = totalPages

    if (currentPage <= 3) {
      return [1, 2, 3, "ellipsis", lastPage]
    } else if (currentPage >= totalPages - 2) {
      return [firstPage, "ellipsis", totalPages - 2, totalPages - 1, totalPages]
    } else {
      return [firstPage, "ellipsis", currentPage, "ellipsis", lastPage]
    }
  }

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1)
      onPreviousClick?.()
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentPage < totalPages) {
      onPageChange?.(currentPage + 1)
      onNextClick?.()
    }
  }

  const handlePageClick = (page: PageItem) => (e: React.MouseEvent) => {
    e.preventDefault()
    if (typeof page === "number") {
      onPageChange?.(page)
    }
  }

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
  )
}

export {
  CombinedPagination,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
