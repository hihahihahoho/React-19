// alert-dialog-container.tsx
"use client"

import { AlertDialogStatusType, useAlertDialog } from "@/hooks/use-alert-dialog"
import { AlertCircleIcon, Check, Info } from "lucide-react"
import { Button } from "../button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog" // Adjust the import path accordingly

const ALERT_DIALOG_STATUS_ICON: {
  [key in AlertDialogStatusType]: React.ReactNode
} = {
  default: (
    <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
      <Info />
    </div>
  ),
  success: (
    <div className="flex size-12 items-center justify-center rounded-full bg-green-100 text-green-600">
      <Check />
    </div>
  ),
  warning: (
    <div className="flex size-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
      <AlertCircleIcon />
    </div>
  ),
  destructive: (
    <div className="flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
      <AlertCircleIcon />
    </div>
  ),
}

export function AlertDialogContainer() {
  const { dialogs, dismiss } = useAlertDialog()

  return (
    <div>
      {dialogs.map(
        ({
          id,
          title,
          description,
          action,
          open,
          showCancel,
          cancelContent = "Đóng",
          showFooter = true,
          content,
          status = "default",
          customStatusIcon,
          footerOrientation = "horizontal",
          ...props
        }) => (
          <AlertDialog
            key={id}
            open={open}
            onOpenChange={(open) => {
              if (!open) dismiss(id)
            }}
            {...props}
          >
            <AlertDialogContent className="overflow-hidden">
              <AlertDialogHeader>
                {customStatusIcon || ALERT_DIALOG_STATUS_ICON[status]}
                <AlertDialogTitle>{title}</AlertDialogTitle>
                {description && (
                  <AlertDialogDescription>{description}</AlertDialogDescription>
                )}
              </AlertDialogHeader>
              {content}
              {showFooter && (
                <AlertDialogFooter footerOrientation={footerOrientation}>
                  {showCancel && (
                    <Button variant={"secondary"} asChild>
                      <AlertDialogCancel onClick={() => dismiss(id)}>
                        {cancelContent}
                      </AlertDialogCancel>
                    </Button>
                  )}
                  {action}
                </AlertDialogFooter>
              )}
            </AlertDialogContent>
          </AlertDialog>
        )
      )}
    </div>
  )
}
