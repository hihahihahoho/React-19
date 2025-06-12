import { AppSidebar } from "@/components/layout/sidebar/app-sidebar"
import {
  NavGroupTanstack,
  NavItemTanstack,
} from "@/components/layout/sidebar/nav-interface"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getCookieValue } from "@/lib/get-cookie-value"
import { NAV_DATA_MAIN } from "@/static/sidebar-data"
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router"
import { useMemo } from "react"

export const Route = createFileRoute("/_authed")({
  component: RouteComponent,
})

function setActiveNavItems(
  navData: NavGroupTanstack[],
  currentPathname: string
): NavGroupTanstack[] {
  return navData.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      const processedItem = processNavItem(item, currentPathname)
      return processedItem
    }),
  }))
}

function processNavItem(
  item: NavItemTanstack,
  currentPathname: string
): NavItemTanstack {
  let isActive = false
  let hasActiveChild = false

  // Check if current item is active
  if (item.url && currentPathname.startsWith(item.url as string)) {
    isActive = true
  }

  // Process child items if they exist
  let processedItems: NavItemTanstack[] | undefined
  if (item.items) {
    processedItems = item.items.map((childItem) => {
      const processedChild = processNavItem(childItem, currentPathname)
      if (processedChild.isActive) {
        hasActiveChild = true
      }
      return processedChild
    })
  }

  return {
    ...item,
    isActive: isActive || hasActiveChild,
    items: processedItems,
  }
}

function RouteComponent() {
  const pathname = useLocation({
    select: (location) =>
      location.pathname
        .replace(/\/$/, "")
        .replace(import.meta.env.VITE_DESIGN_PATH, ""),
  })

  const navDataWithActive = useMemo(() => {
    return setActiveNavItems(NAV_DATA_MAIN, pathname)
  }, [pathname])

  return (
    <SidebarProvider defaultOpen={getCookieValue()}>
      <AppSidebar navMain={navDataWithActive} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
