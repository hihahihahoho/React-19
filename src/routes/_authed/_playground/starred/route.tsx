import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/_playground/starred')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/_playground/starred"!</div>
}
