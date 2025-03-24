import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react"
import * as React from "react"

type AlertVariant = Exclude<
  VariantProps<typeof alertVariants>["variant"],
  undefined | null
>

const ALERT_STATUS_ICON = {
  default: <Info className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  destructive: <AlertCircle className="h-5 w-5" />,
}

const alertVariants = cva(
  "relative overflow-hidden rounded-xl border px-4 py-3",
  {
    variants: {
      variant: {
        default:
          "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200",
        success:
          "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
        warning:
          "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200",
        destructive:
          "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const alertIconVariants = cva("", {
  variants: {
    variant: {
      default: "text-blue-600 dark:text-blue-400",
      success: "text-emerald-600 dark:text-emerald-400",
      warning: "text-amber-600 dark:text-amber-400",
      destructive: "text-rose-600 dark:text-rose-400",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

// Define status labels for each variant
const variantLabels: Record<AlertVariant, string> = {
  default: "Information",
  success: "Success",
  warning: "Warning",
  destructive: "Error",
}

type AlertProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    title?: React.ReactNode
    description?: React.ReactNode
    classNames?: {
      root?: string
      icon?: string
      title?: string
      description?: string
      dismissButton?: string
    }
    dismissible?: boolean
    onDismiss?: () => void
  }

function Alert({
  className,
  variant,
  title,
  description,
  children,
  classNames = {},
  dismissible = false,
  onDismiss,
  ...props
}: AlertProps) {
  const [visible, setVisible] = React.useState(true)
  const iconKey = (variant || "default") as keyof typeof ALERT_STATUS_ICON
  const variantType = variant || "default"
  const hasTitle = Boolean(title)
  const hasDescription = Boolean(description) || Boolean(children)

  const titleAttribute =
    typeof title === "string" ? title : `${variantLabels[variantType]} alert`

  const handleDismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  if (!visible) return null

  return (
    <div
      data-slot="alert"
      role="alert"
      data-visible="true"
      data-variant={variant}
      data-has-title={hasTitle ? "true" : "false"}
      data-has-description={hasDescription ? "true" : "false"}
      data-dismissible={dismissible ? "true" : "false"}
      title={titleAttribute}
      className={cn(alertVariants({ variant }), className, classNames.root)}
      {...props}
    >
      <div className="flex gap-3">
        <div className={cn("self-start", classNames.icon)}>
          <div className={alertIconVariants({ variant: variant })}>
            {ALERT_STATUS_ICON[iconKey]}
          </div>
        </div>
        <div className="flex-1 space-y-1">
          {title && (
            <h5 className={cn("text-sm font-medium", classNames.title)}>
              {title}
            </h5>
          )}
          {description && (
            <div className={cn("text-sm font-normal", classNames.description)}>
              {description}
            </div>
          )}
          {children && !description && (
            <div className={cn("text-sm font-normal", classNames.description)}>
              {children}
            </div>
          )}
          {children && description && children}
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              "self-start rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
              classNames.dismissButton
            )}
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export { Alert, type AlertProps }
