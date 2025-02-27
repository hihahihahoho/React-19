import { Command as CommandPrimitive } from "cmdk";
import { BadgeProps } from "../badge/badge";

export type SelectItems = React.ComponentProps<typeof CommandPrimitive.Item> & {
  value: string | number;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badgeProps?: BadgeProps
};

export type SelectGroup = React.ComponentProps<
  typeof CommandPrimitive.Group
> & {
  options: SelectItems[];
  isMultiSelect?: boolean;
};
