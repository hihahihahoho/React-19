"use client"

import { ChevronRight, LinkIcon, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import React from "react"

export interface NavItem {
  title: string
  url?: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavItem[]
}

export interface NavGroup {
  groupLabel: string
  items: NavItem[]
}

export function NavMain({ items }: { items: NavGroup[] }) {
  const { isMobile, state } = useSidebar()
  const isCollapsed = !isMobile && state === "collapsed"

  return (
    <>
      {items.map((group, groupIdx) => (
        <React.Fragment key={groupIdx}>
          {groupIdx > 0 && isCollapsed && <Separator className="mx-3 w-auto" />}
          <SidebarGroup>
            <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item, idx) => (
                <Tree key={idx} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </React.Fragment>
      ))}
    </>
  )
}

function renderDropdownItem(item: NavItem, idx: number): React.ReactNode {
  const hasChildren = item.items && item.items.length > 0

  // If item has children, render a sub menu
  if (hasChildren) {
    return (
      <DropdownMenuSub key={idx}>
        <DropdownMenuSubTrigger className="flex items-center gap-2">
          {item.icon && <item.icon className="h-4 w-4" />}
          <span>{item.title}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="w-48">
            {item.items?.map((childItem, childIdx) => (
              <React.Fragment key={childIdx}>
                {renderDropdownItem(childItem, childIdx)}
              </React.Fragment>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    )
  }

  // If item is a leaf node, render as menu item
  return (
    <DropdownMenuItem asChild key={idx}>
      {/* this is for Tanstack start */}
      <Link
        to={item.url ?? "#"}
        className={`flex w-full items-center gap-2 ${item.isActive ? "bg-accent/50" : ""}`}
      >
        {item.icon && <item.icon className="h-4 w-4" />}
        <span>{item.title}</span>
      </Link>
    </DropdownMenuItem>
  )
}

function Tree({ item }: { item: NavItem }) {
  const hasChildren = item.items && item.items.length > 0
  const { isMobile, state } = useSidebar()
  const isCollapsed = !isMobile && state === "collapsed"

  // Determine tooltip content based on item type
  const tooltipContent = (
    <div className="flex items-center gap-2">
      {!item.items && <LinkIcon className="size-4" />}
      <span>{item.title}</span>
    </div>
  )

  if (!hasChildren) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuButton
          asChild
          isActive={item.isActive}
          tooltip={tooltipContent}
        >
          {/* this is for Tanstack start */}
          <Link to={item.url ?? "#"}>
            {item.icon && <item.icon />}
            <span className={isCollapsed ? "sr-only" : ""}>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuSubItem>
    )
  }

  // If sidebar is collapsed on desktop and has children, render dropdown
  if (isCollapsed && hasChildren) {
    return (
      <SidebarMenuSubItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton tooltip={tooltipContent}>
              {item.icon && <item.icon />}
              <span className="sr-only">{item.title}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            className="w-56"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {item.items?.map((child, idx) => (
              <React.Fragment key={idx}>
                {renderDropdownItem(child, idx)}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuSubItem>
    )
  }

  // Default collapsible menu when expanded
  return (
    <SidebarMenuSubItem>
      <Collapsible defaultOpen={item.isActive}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className="group/collapsible w-full"
            tooltip={tooltipContent}
          >
            {item.icon && <item.icon />}
            <span className={isCollapsed ? "sr-only" : ""}>{item.title}</span>
            <ChevronRight
              className={`${isCollapsed ? "hidden" : "ml-auto"} transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90`}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((child, idx) => <Tree key={idx} item={child} />)}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuSubItem>
  )
}
