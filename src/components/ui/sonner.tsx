"use client"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle, InfoIcon, Loader2 } from "lucide-react"
import { toast as sonner, Toaster as Sonner } from "sonner"
import { Button } from "./button"

type ToasterSonnerProps = React.ComponentProps<typeof Sonner>

const sonnerVariant = cva(
  "toast-container flex min-h-12 w-full max-w-[calc(100vw_-_32px)] items-center justify-center gap-2 rounded-full px-4 py-2 text-sm shadow-lg md:min-w-[280px] md:max-w-[var(--width)]",
  {
    variants: {
      variant: {
        default:
          "border border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
        success:
          "border border-green-100 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-700 dark:text-green-100",
        warning:
          "border border-amber-100 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-700 dark:text-amber-100",
        destructive:
          "border border-red-100 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-700 dark:text-red-100",
        loading:
          "border border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Extract the variant type from sonnerVariant
type SonnerVariantProps = VariantProps<typeof sonnerVariant>
type SonnerVariant = NonNullable<SonnerVariantProps["variant"]>

const SONNER_STATUS_ICON: { [key in SonnerVariant]: React.ReactNode } = {
  default: <InfoIcon />,
  success: <CheckCircle />,
  warning: <AlertCircle />,
  destructive: <AlertCircle />,
  loading: <Loader2 className="animate-spin" />,
}

export interface ToastSonnerProps {
  id: string | number
  title?: React.ReactNode
  variant?: SonnerVariant
  icon?: React.ReactNode
  button?: React.ComponentProps<typeof Button> & {
    label?: string
  }
}

function sonnerToast({
  title,
  button,
  position = "top-center",
  variant = "default",
  icon,
  ...props
}: Omit<ToastSonnerProps, "id"> & ToasterSonnerProps) {
  const iconKey = variant as SonnerVariant

  return sonner.custom(
    (id) => (
      <div className={sonnerVariant({ variant: iconKey })}>
        <div className="text-porcelain-400 flex flex-1 items-center gap-2">
          <div className="[&_svg]:size-5">
            {icon || SONNER_STATUS_ICON[iconKey]}
          </div>
          <p>{title}</p>
        </div>
        {button && (
          <Button
            onClick={(e) => {
              button?.onClick?.(e)
              sonner.dismiss(id)
            }}
            variant={"outline"}
            size={"xs"}
            {...button}
          >
            {button.label || "Huỷ"}
          </Button>
        )}
      </div>
    ),
    {
      unstyled: true,
      classNames: {
        toast: "md:w-fit! left-0! right-0! md:mx-auto!",
      },
      position,
      ...props,
    }
  )
}

export { sonnerToast, Sonner as Toaster }
