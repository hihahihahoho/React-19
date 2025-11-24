import { AlertDialogContainer } from "@/components/ui/alert-dialog/alert-dialog-container"
import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { Toaster as SonnerToaster } from "sonner"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <SonnerToaster />
      <AlertDialogContainer />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
