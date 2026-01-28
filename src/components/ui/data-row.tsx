import { cn } from "@/lib/utils"

const DataRowWrapper = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="data-row-wrapper"
      className={cn("[&_>div:not(:last-child)]:border-b", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const DataRow = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="data-row"
      className={cn(
        "form-wrapper-class grid grid-cols-12 items-start gap-x-6 gap-y-1 py-3 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const DataRowLabel = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="data-row-label"
      className={cn(
        "text-muted-foreground col-span-5 flex items-center gap-2 sm:col-span-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const DataRowValue = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="data-row-value"
      className={cn(
        "col-span-7 flex items-center gap-2 wrap-break-word sm:col-span-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { DataRow, DataRowLabel, DataRowValue, DataRowWrapper }
