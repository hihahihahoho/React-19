# Alert Component Documentation

## Overview

The Alert component provides contextual feedback messages for user actions with multiple variants (information, success, warning, error) and customizable content.

## Import

```typescript
import { Alert, type AlertProps } from "@/components/ui/alert"
```

## Props Explanation

The Alert component extends React.HTMLAttributes<HTMLDivElement> to accept all standard HTML div attributes plus the following:

| Prop          | Type                                                                            | Default   | Description                                                       |
| ------------- | ------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------- |
| `variant`     | "default" \| "success" \| "warning" \| "destructive"                            | "default" | Determines the visual style and icon of the alert                 |
| `title`       | React.ReactNode                                                                 | undefined | The main heading text for the alert                               |
| `description` | React.ReactNode                                                                 | undefined | The explanatory text of the alert                                 |
| `classNames`  | { icon?: string; title?: string; description?: string; dismissButton?: string } | {}        | Object containing CSS class overrides for specific alert elements |
| `dismissible` | boolean                                                                         | false     | When true, adds a dismiss button to close the alert               |
| `onDismiss`   | () => void                                                                      | undefined | Callback function triggered when the dismiss button is clicked    |

## Example Usage

```tsx
<Alert
  variant="success"
  title="Profile Updated"
  description="Your profile information has been successfully updated."
/>
```

## Variants

The Alert component has four variants:

- `default` - Blue styling, information icon
- `success` - Green styling, check circle icon
- `warning` - Amber styling, warning triangle icon
- `destructive` - Red styling, alert circle icon

## Best Practices

1. Use the appropriate variant that matches the message's importance
2. Keep alert messages clear and concise
3. Use dismissible alerts for non-critical messages
4. Place alerts where they're contextually relevant to the user's action

```

```
