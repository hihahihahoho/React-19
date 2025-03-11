"use client"
import { AlertCircle, CheckCircle, InfoIcon } from "lucide-react"
import { toast as sonner, Toaster as Sonner } from "sonner"

type ToasterSonnerProps = React.ComponentProps<typeof Sonner>

type SonnerVariant = Exclude<ToastSonnerProps["variant"], undefined | null>

const SONNER_STATUS_ICON: { [key in SonnerVariant]: React.ReactNode } = {
  default: <InfoIcon />,
  success: <CheckCircle />,
  warning: <AlertCircle />,
  danger: <AlertCircle />,
}
export interface ToastSonnerProps {
  id: string | number
  title?: React.ReactNode
  variant?: "success" | "warning" | "danger" | "default"
  button?: {
    label?: string
    onClick?: () => void
  }
}

function sonnerToast({
  title,
  button,
  position = "top-center",
  variant = "default",
  ...props
}: Omit<ToastSonnerProps, "id"> & ToasterSonnerProps) {
  const iconKey = (variant || "success") as keyof typeof SONNER_STATUS_ICON

  return sonner.custom(
    (id) => (
      <div className="toast-container flex min-h-12 w-full max-w-[calc(100vw_-_32px)] items-center justify-center gap-2 rounded-full px-4 py-2 text-white md:min-w-[300px] md:max-w-[var(--width)]">
        <div className="text-porcelain-400 flex flex-1 items-center gap-2">
          {SONNER_STATUS_ICON[iconKey]}
          <p className="text-heading-5">{title}</p>
        </div>
        {button && (
          <button
            className="text-text-14-semibold"
            onClick={() => {
              button?.onClick?.()
              sonner.dismiss(id)
            }}
          >
            {button.label || "Huỷ"}
          </button>
        )}
      </div>
    ),
    {
      unstyled: true,
      classNames: {
        toast: "md:!w-fit !left-0 !right-0 md:!mx-auto",
      },
      position,
      ...props,
    }
  )
}

export { sonnerToast }
