# Route File Types

Detailed explanation of each file type in TanStack Router.

## index.tsx - Page Routes

**Purpose:** Renders the content for an exact URL match.

**When to use:**

- Main content of a route
- List pages, detail pages, forms

**URL mapping:**

- `users/index.tsx` → `/users`
- `users/(index)/index.tsx` → `/users` (with grouping)

**Template:**

```tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/users/")({
  component: UsersPage,
})

function UsersPage() {
  return <div>Users list</div>
}
```

**Notes:**

- The trailing `/` in the route path is significant
- TanStack auto-generates the route path from file location
- Component is co-located in the same file

---

## route.tsx - Layout Routes

**Purpose:** Wraps child routes with shared layout, provides `<Outlet />`.

**When to use:**

- Section layouts (sidebar, header)
- Auth protection wrappers
- Shared context providers

**URL mapping:**

- `users/route.tsx` → Does NOT add to URL
- Wraps all routes in `users/` folder

**Template:**

```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/users")({
  staticData: {
    title: "Users",
  },
  component: UsersLayout,
})

function UsersLayout() {
  return (
    <div className="flex">
      <aside>Sidebar</aside>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

**Notes:**

- MUST include `<Outlet />` to render child routes
- `staticData` is used for breadcrumbs, document title
- No trailing `/` in route path

---

## $param.tsx - Dynamic Routes

**Purpose:** Matches dynamic URL segments.

**When to use:**

- Detail pages (`/users/:id`)
- Any route with variable segments

**URL mapping:**

- `users/$userId.tsx` → `/users/:userId`
- `products/$category/$productId.tsx` → `/products/:category/:productId`

**Template:**

```tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/users/$userId")({
  component: UserDetail,
})

function UserDetail() {
  const { userId } = Route.useParams()

  return <div>User ID: {userId}</div>
}
```

**With loader:**

```tsx
export const Route = createFileRoute("/users/$userId")({
  loader: async ({ params }) => {
    return { user: await fetchUser(params.userId) }
  },
  component: UserDetail,
})

function UserDetail() {
  const { user } = Route.useLoaderData()
  return <div>{user.name}</div>
}
```

---

## $.tsx - Catch-All Routes

**Purpose:** Matches any remaining path segments.

**When to use:**

- 404 pages
- Wildcard routes
- Proxy routes

**URL mapping:**

- `docs/$.tsx` → `/docs/*` (matches `/docs/anything/here`)

**Template:**

```tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/docs/$")({
  component: DocsPage,
})

function DocsPage() {
  const { _splat } = Route.useParams()
  // _splat contains the remaining path: "anything/here"

  return <div>Path: {_splat}</div>
}
```

---

## Special Prefixes

### \_ (Underscore) - Pathless Layout

**Purpose:** Layout that doesn't add to URL path.

```
_authed/
├── route.tsx      # No URL impact, just wraps
├── dashboard.tsx  # /dashboard (not /_authed/dashboard)
└── settings.tsx   # /settings
```

### \_\_ (Double Underscore) - Root Special

**Purpose:** Root-level configuration file.

```
__root.tsx        # Root layout, wraps ALL routes
```

### - (Hyphen) - Private Folder

**Purpose:** Folder that is NOT a route.

```
users/
├── -components/   # Not a route
│   └── table.tsx
└── index.tsx      # /users
```

### (parentheses) - Group Folder

**Purpose:** Groups files without affecting URL.

```
users/
├── (index)/       # Groups index page files
│   ├── -components/
│   └── index.tsx  # Still /users
└── route.tsx
```
