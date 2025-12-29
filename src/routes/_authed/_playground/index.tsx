import { Button } from "@/components/ui/button"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import { createFileRoute, Link } from "@tanstack/react-router"
import { History } from "lucide-react"
import z from "zod"

export const Route = createFileRoute("/_authed/_playground/")({
  component: Index,
})

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

function LinkWithZodSchema({
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <ZodSchemaProvider schema={schema}>
      <Link {...props} to="/history">
        {children}
      </Link>
    </ZodSchemaProvider>
  )
}

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Button asChild>
        <LinkWithZodSchema>
          <History /> Go to History with Zod Schema
        </LinkWithZodSchema>
      </Button>
    </div>
  )
}
