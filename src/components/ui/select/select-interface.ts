import { Command as CommandPrimitive } from "cmdk";

export type SelectItems = React.ComponentProps<typeof CommandPrimitive.Item> & {
  value: string | number;
  label: React.ReactNode;
  icon?: React.ReactNode;
};

export type SelectGroup = React.ComponentProps<
  typeof CommandPrimitive.Group
> & {
  options: SelectItems[];
  isMultiSelect?: boolean;
};
