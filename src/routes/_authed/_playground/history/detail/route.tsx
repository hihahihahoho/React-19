import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/_playground/history/detail')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/_playground/history"!</div>
}
