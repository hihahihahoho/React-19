---
name: tanstack-router
description: TanStack Router file-based routing structure for React. Use when creating routes, layouts, dynamic routes, or organizing route components.
---

# TanStack Router Project Structure

> File-based routing with type-safe navigation for React applications.

## When to Use

- Creating new routes or pages
- Setting up layouts with nested routes
- Building dynamic routes with parameters
- Organizing route-specific components
- Understanding routing conventions

## Mental Model

TanStack Router uses **file-based routing**:

1. **Files become routes** - `users.tsx` → `/users`
2. **Folders create nesting** - `users/$id.tsx` → `/users/:id`
3. **Layouts wrap children** - `route.tsx` + `<Outlet />` for sub-routes
4. **Groups don't affect URL** - `(admin)/` folder is ignored in URL path

## Route File Types

| File         | Purpose         | URL Impact                               |
| ------------ | --------------- | ---------------------------------------- |
| `index.tsx`  | Page content    | Matches exact path                       |
| `route.tsx`  | Layout wrapper  | No URL, wraps children with `<Outlet />` |
| `$param.tsx` | Dynamic segment | `:param` in URL                          |
| `$.tsx`      | Catch-all/splat | Matches any remaining path               |

## Canonical Structure

```
src/routes/
├── _authed/                    # Auth layout group
│   ├── route.tsx              # Auth check, redirects if not logged in
│   ├── dashboard/
│   │   ├── (index)/           # Group folder (no URL impact)
│   │   │   ├── -components/   # Private components (not routes)
│   │   │   │   └── stats.tsx
│   │   │   └── index.tsx      # /dashboard
│   │   ├── route.tsx          # Dashboard layout
│   │   ├── settings.tsx       # /dashboard/settings
│   │   └── $userId.tsx        # /dashboard/:userId
│   └── users/
│       ├── route.tsx          # Users layout
│       ├── index.tsx          # /users (list)
│       └── $id.tsx           # /users/:id (detail)
├── _public/                    # Public layout group
│   ├── route.tsx              # Public layout
│   ├── login.tsx              # /login
│   └── register.tsx           # /register
├── __root.tsx                  # Root layout (always renders)
└── index.tsx                   # / (home page)
```

## Naming Conventions

| Prefix     | Meaning            | Example                                  |
| ---------- | ------------------ | ---------------------------------------- |
| `_`        | Layout route       | `_authed/route.tsx` - doesn't add to URL |
| `$`        | Dynamic param      | `$userId.tsx` → `:userId`                |
| `-`        | Private folder     | `-components/` - not a route             |
| `(folder)` | Group folder       | `(index)/` - groups files, no URL impact |
| `__`       | Root-level special | `__root.tsx`                             |

## File Templates

### index.tsx (Page)

```tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/path/")({
  component: PageComponent,
})

function PageComponent() {
  return (
    <div className="container py-8">
      <h1>Page Title</h1>
      {/* Page content */}
    </div>
  )
}
```

### route.tsx (Layout)

```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/path")({
  staticData: {
    title: "Section Title", // For breadcrumbs, document title
  },
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <div>
      {/* Optional: Section header, sidebar */}
      <Outlet />
    </div>
  )
}
```

### $param.tsx (Dynamic Route)

```tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/users/$userId")({
  component: UserDetail,
})

function UserDetail() {
  const { userId } = Route.useParams()

  return (
    <div>
      <h1>User: {userId}</h1>
    </div>
  )
}
```

### With Loader

```tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/users/$userId")({
  loader: async ({ params }) => {
    const user = await fetchUser(params.userId)
    return { user }
  },
  component: UserDetail,
})

function UserDetail() {
  const { user } = Route.useLoaderData()

  return <div>{user.name}</div>
}
```

### With Search Params

```tsx
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

const searchSchema = z.object({
  page: z.number().default(1),
  search: z.string().optional(),
})

export const Route = createFileRoute("/users/")({
  validateSearch: searchSchema,
  component: UserList,
})

function UserList() {
  const { page, search } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <div>
      <input
        value={search ?? ""}
        onChange={(e) => navigate({ search: { search: e.target.value } })}
      />
    </div>
  )
}
```

## Component Organization

### Route-specific Components

Place in `-components/` folder next to the route:

```
users/
├── (index)/
│   ├── -components/
│   │   ├── user-table.tsx       # Table component
│   │   ├── user-filters.tsx     # Filter form
│   │   └── -user-form/          # Complex form (use form pattern)
│   │       ├── schema.ts
│   │       ├── context.tsx
│   │       └── form.tsx
│   └── index.tsx
└── route.tsx
```

### Shared Components

Place in `src/components/`:

```
src/components/
├── ui/                  # Base UI components (Button, Input, etc.)
├── layout/             # Layout components (Header, Sidebar)
└── shared/             # Shared business components
```

## Do's and Don'ts

### Do

- Use `(index)/` group for pages with many components
- Use `-components/` for route-private components
- Add `staticData.title` for breadcrumb support
- Keep layouts minimal - just structure, not logic
- Use loaders for data fetching

### Don't

- Don't put business logic in route files
- Don't create deep nesting (max 3-4 levels)
- Don't forget `<Outlet />` in layout routes
- Don't mix layout routes and page routes in same folder without group

## Reference Files

For detailed patterns, see:

- [File Types](references/FILE-TYPES.md) - Detailed file type explanations
- [Patterns](references/PATTERNS.md) - Common routing patterns
- [Examples](references/EXAMPLES.md) - Real project examples

## Quick Reference

| Task             | File                | Template                         |
| ---------------- | ------------------- | -------------------------------- |
| New page         | `path/index.tsx`    | `createFileRoute` + component    |
| New layout       | `path/route.tsx`    | `createFileRoute` + `<Outlet />` |
| Dynamic route    | `path/$id.tsx`      | `createFileRoute` + `useParams`  |
| Protected routes | `_authed/route.tsx` | Auth check in layout             |
| Route components | `path/-components/` | Private folder                   |
