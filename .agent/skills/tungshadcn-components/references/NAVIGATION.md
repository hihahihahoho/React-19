# Navigation Components

TungShadcn provides enhanced navigation controls, including responsive pagination and animated tabs.

---

## Combined Pagination

A powerful, responsive pagination component that automatically handles desktop/mobile layouts and ellipsis logic.

### Usage

```tsx
import { CombinedPagination } from "@/components/ui/pagination"

function MyTable() {
  const [page, setPage] = useState(1)

  return (
    <CombinedPagination
      currentPage={page}
      totalPages={50}
      onPageChange={setPage}
    />
  )
}
```

### Features

- **Responsive**: Switches between icon-only (mobile) and labeled (desktop) buttons.
- **Auto-Ellipsis**: Intelligently hides middle pages when the range is large.
- **State Management**: Simple `onPageChange` callback.

---

## Tabs System

TungShadcn includes two main variants of tabs:

### 1. Standard Tabs (Scrollable)

Uses Radix UI but with built-in scroll support for many tabs.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

;<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">...</TabsContent>
</Tabs>
```

### 2. Tabs Line (Animated)

Modern tabs with an animated underline indicator.

```tsx
import {
  TabsLine,
  TabsListLine,
  TabsTriggerLine,
  TabsContentLine,
} from "@/components/ui/tabs/tabs-line"

;<TabsLine defaultValue="info">
  <TabsListLine>
    <TabsTriggerLine value="info">General Info</TabsTriggerLine>
    <TabsTriggerLine value="security">Security</TabsTriggerLine>
  </TabsListLine>
  <TabsContentLine value="info">...</TabsContentLine>
</TabsLine>
```

---

## Do/Don't

- **Do** use `CombinedPagination` instead of building custom page buttons.
- **Do** use `TabsLine` for top-level navigation within a page.
- **Don't** use too many tabs; `Tabs` supports scrolling, but it's better to keep options limited (under 5-7).
- **Don't** forget to provide a `defaultValue` for tabs to avoid an empty state on mount.
