# Display Components

Custom display components for status, progress, and structured data.

---

## Alert

Base component for inline messages.

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

;<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Your session has expired.</AlertDescription>
</Alert>
```

---

## Avatar

Enhanced avatar with size variants and fallback support.

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

;<Avatar size="lg">
  <AvatarImage src="/user.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## Badge

Status indicators with predefined variants.

```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="outline">Processing</Badge>
<Badge variant="secondary">Draft</Badge>
```

---

## Circle Progress

Circular progress indicator with animation and gradient support.

### Key Props

- `value`: Current value.
- `maxValue`: Target value.
- `size`: Width/height (default 40).
- `useGradient`: Enable color transitions.
- `getColor`: Custom function `(percentage) => string`.

### Usage

```tsx
import { CircleProgress } from "@/components/ui/circle-progress"

;<CircleProgress value={75} maxValue={100} size={60} useGradient showValue />
```

---

## Data Row

Structured key-value display, often used in sidebars or detail pages.

```tsx
import {
  DataRow,
  DataRowLabel,
  DataRowValue,
  DataRowWrapper,
} from "@/components/ui/data-row"

;<DataRowWrapper>
  <DataRow>
    <DataRowLabel>Status</DataRowLabel>
    <DataRowValue>
      <Badge>Active</Badge>
    </DataRowValue>
  </DataRow>
  <DataRow>
    <DataRowLabel>Created At</DataRowLabel>
    <DataRowValue>Jan 1, 2024</DataRowValue>
  </DataRow>
</DataRowWrapper>
```

---

## Do/Don't

- **Do** use `CircleProgress` for single metrics (e.g., storage used) rather than linear bars if space is tight.
- **Do** use `DataRow` for vertical attribute lists.
- **Don't** use `Alert` for temporary feedback; use `sonnerToast` instead.
- **Don't** manually style badges; use the provided variants (`destructive`, `outline`, `secondary`).
