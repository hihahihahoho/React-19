# Badge Component Documentation

## Import

```typescript
import { Badge, badgeVariants } from "@/components/ui/badge/badge"
```

## Props Explanation

The Badge component extends standard HTML div attributes and accepts additional props defined by badgeVariants:

| Prop              | Type                                                                                                                                                                                                                                                                                                   | Default     | Description                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | -------------------------------------------------------------- |
| `variant`         | `'default'` \| `'secondary'` \| `'destructive'` \| `'outline'` \| `'red'` \| `'orange'` \| `'amber'` \| `'yellow'` \| `'lime'` \| `'green'` \| `'emerald'` \| `'teal'` \| `'cyan'` \| `'sky'` \| `'blue'` \| `'indigo'` \| `'violet'` \| `'purple'` \| `'fuchsia'` \| `'pink'` \| `'rose'` \| `'zinc'` | `"default"` | Determines the visual style (color scheme).                    |
| `size`            | `"xs" \| "sm" \| "md" \| "lg"`                                                                                                                                                                                                                                                                         | `"sm"`      | Controls the badge dimensions and text size.                   |
| `iconLeft`        | `React.ReactNode`                                                                                                                                                                                                                                                                                      | `undefined` | Optional icon rendered at the left of the content.             |
| `iconRight`       | `React.ReactNode`                                                                                                                                                                                                                                                                                      | `undefined` | Optional icon rendered at the right of the content.            |
| `clearBtn`        | `boolean`                                                                                                                                                                                                                                                                                              | `false`     | If true, displays a clear (removable) button inside the badge. |
| `onClearBtnClick` | `() => void`                                                                                                                                                                                                                                                                                           | `undefined` | Callback invoked when the clear button is clicked.             |
| `tooltip`         | `React.ReactNode`                                                                                                                                                                                                                                                                                      | `undefined` | Content for a tooltip shown on hover.                          |

Additionally, any other standard HTML attributes for a div can be passed.
