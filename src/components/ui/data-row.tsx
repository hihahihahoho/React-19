import { cn } from "@/lib/utils";

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
  );
};

const DataRow = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="data-row"
      className={cn(
        "form-wrapper-class grid gap-x-2 sm:gap-x-6 gap-y-1 text-sm items-start grid-cols-12 py-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const DataRowLabel = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="data-row-label"
      className={cn(
        "col-span-5 sm:col-span-4 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const DataRowValue = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="data-row-value"
      className={cn(
        "col-span-7 sm:col-span-8 text-text-14-regular word-break",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { DataRow, DataRowLabel, DataRowValue, DataRowWrapper };
