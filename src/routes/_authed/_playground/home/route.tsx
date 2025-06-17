import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed/_playground/home")({
  component: RouteComponent,
  staticData: {
    title: "Trang chủ",
  },
})

function RouteComponent() {
  return <div>Hello "/_authed/_playground/home"!</div>
}
