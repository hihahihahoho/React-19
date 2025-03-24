import { Command as CommandPrimitive } from "cmdk"
import { BadgeProps } from "../badge/badge"
import { CommandItem } from "../command"

export type SelectItems = React.ComponentProps<typeof CommandItem> & {
  value: string | number
  label?: React.ReactNode
  icon?: React.ReactNode
  description?: React.ReactNode
  badgeProps?: BadgeProps
}

export type SelectGroup = React.ComponentProps<
  typeof CommandPrimitive.Group
> & {
  options: SelectItems[]
  isMultiSelect?: boolean
}
