// alert-dialog-container.tsx
"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog/alert-dialog" // Adjust the import path accordingly
import { useAlertDialog } from "@/hooks/use-alert-dialog" // Adjust the import path accordingly

export function AlertDialogContainer() {
  const { dialogs, dismiss } = useAlertDialog()

  return (
    <>
      {dialogs.map(
        ({ id, title, description, action, open, showCancel, ...props }) => (
          <AlertDialog
            key={id}
            open={open}
            onOpenChange={(open) => {
              if (!open) dismiss(id)
            }}
            {...props}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                {description && (
                  <AlertDialogDescription>{description}</AlertDialogDescription>
                )}
              </AlertDialogHeader>
              <AlertDialogFooter>
                {action}
                {showCancel && (
                  <AlertDialogCancel onClick={() => dismiss(id)}>
                    Đóng
                  </AlertDialogCancel>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      )}
    </>
  )
}
