# Select system

Based on `src/components/ui/select/select.tsx`.

## Core behavior

- `Select` is a button-based control built on `ResponsivePopover` and `FormComposition`.
- It uses `SelectCommand` by default, or `virtualComponents` for large lists.
- Selection state is internal unless `value` is controlled.

## Value handling

- `value` takes precedence over `defaultValue`.
- `onValueChange` updates internal state and notifies caller.
- Clear behavior uses `formComposition.onClear` and sets the value to `undefined`.

## Display rules

- If `customDisplayValue` is provided, it overrides the display item.
- Otherwise, `Select` finds the selected item from the flattened options.
- Placeholder falls back to label-derived text: "Chon " + lowercase label text.

## Composition rules

- Always provide `formComposition.label` for accessibility.
- Use `formComposition` to pass icons, prefix/suffix, label layout, and variants.
- `FormComposition` is rendered with `asChild`, and `FormControlButton` handles focus.

## Popover behavior

- Uses `ResponsivePopover` with `ResponsivePopoverContent` for the menu.
- The header displays the label in mobile view.
- `onWheel` is stopped to prevent parent scroll interference.

## Virtualization

- Use `SelectCommandVirtualize` via `virtualComponents` when the dataset is large.
