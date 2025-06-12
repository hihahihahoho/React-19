import { LinkProps } from "@tanstack/react-router"
import { type LucideIcon } from "lucide-react"

export interface NavItemTanstack {
  title: string
  url?: LinkProps['to']
  icon?: LucideIcon
  isActive?: boolean
  items?: NavItemTanstack[]
}

export interface NavGroupTanstack {
  groupLabel: string
  items: NavItemTanstack[]
}