# Common Routing Patterns

Patterns for typical routing scenarios.

## Authentication Layout

Protect routes that require login:

```
src/routes/
├── _authed/                    # Protected section
│   ├── route.tsx              # Auth check
│   ├── dashboard/
│   │   └── index.tsx
│   └── settings/
│       └── index.tsx
├── _public/                    # Public section
│   ├── route.tsx              # Public layout
│   ├── login.tsx
│   └── register.tsx
└── __root.tsx
```

**\_authed/route.tsx:**

```tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed")({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" })
    }
  },
  component: AuthedLayout,
})

function AuthedLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
```

---

## CRUD Resource

Standard list/detail/create/edit pattern:

```
users/
├── (index)/                   # List page
│   ├── -components/
│   │   ├── user-table.tsx
│   │   └── user-filters.tsx
│   └── index.tsx             # /users
├── (create)/                  # Create page
│   ├── -components/
│   │   └── -user-form/
│   │       ├── schema.ts
│   │       ├── context.tsx
│   │       └── form.tsx
│   └── create.tsx            # /users/create
├── ($id)/                     # Detail page
│   ├── -components/
│   │   └── user-detail.tsx
│   └── $id.tsx               # /users/:id
├── ($id.edit)/                # Edit page
│   ├── -components/
│   │   └── -user-form/
│   │       └── ...
│   └── $id.edit.tsx          # /users/:id/edit
└── route.tsx
```

---

## Nested Navigation

Multi-level navigation with breadcrumbs:

```
admin/
├── route.tsx                  # Admin layout + breadcrumb root
├── (index)/
│   └── index.tsx             # /admin
├── users/
│   ├── route.tsx             # staticData.title = "Users"
│   ├── (index)/
│   │   └── index.tsx         # /admin/users
│   └── $id.tsx               # /admin/users/:id
└── settings/
    ├── route.tsx             # staticData.title = "Settings"
    ├── (index)/
    │   └── index.tsx         # /admin/settings
    ├── general.tsx           # /admin/settings/general
    └── security.tsx          # /admin/settings/security
```

**Breadcrumb from staticData:**

```tsx
// In layout, collect breadcrumbs from route matches
const matches = useMatches()
const breadcrumbs = matches
  .filter((m) => m.staticData?.title)
  .map((m) => ({
    title: m.staticData.title,
    path: m.pathname,
  }))
```

---

## Search Params Pattern

Filter/pagination state in URL:

```tsx
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

const searchSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(10),
  search: z.string().optional(),
  status: z.enum(["active", "inactive", "all"]).default("all"),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
})

export const Route = createFileRoute("/users/")({
  validateSearch: searchSchema,
  component: UserList,
})

function UserList() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const updateSearch = (updates: Partial<typeof search>) => {
    navigate({
      search: (prev) => ({ ...prev, ...updates }),
    })
  }

  return (
    <div>
      <input
        value={search.search ?? ""}
        onChange={(e) => updateSearch({ search: e.target.value, page: 1 })}
      />
      <Pagination
        page={search.page}
        onChange={(page) => updateSearch({ page })}
      />
    </div>
  )
}
```

---

## Modal Routes

Route-based modals:

```
products/
├── route.tsx
├── (index)/
│   └── index.tsx              # Product list
└── $id.tsx                    # Product detail (can be modal)
```

**Pattern: Parallel routes for modal:**

```tsx
// products/index.tsx
function ProductList() {
  const navigate = Route.useNavigate()

  return (
    <div>
      {products.map((p) => (
        <div
          onClick={() =>
            navigate({ to: "/products/$id", params: { id: p.id } })
          }
        >
          {p.name}
        </div>
      ))}
    </div>
  )
}
```

---

## Loader Pattern

Data fetching with loaders:

```tsx
export const Route = createFileRoute("/users/$userId")({
  loader: async ({ params, context }) => {
    // Access query client from context
    const user = await context.queryClient.fetchQuery({
      queryKey: ["user", params.userId],
      queryFn: () => fetchUser(params.userId),
    })
    return { user }
  },
  component: UserDetail,
})
```

**With pending UI:**

```tsx
export const Route = createFileRoute("/users/$userId")({
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: ({ error }) => <div>Error: {error.message}</div>,
  loader: async ({ params }) => {
    return { user: await fetchUser(params.userId) }
  },
  component: UserDetail,
})
```
