import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed/_playground/history")({
  component: RouteComponent,
  staticData: {
    title: "Lịch sử",
  },
})

function RouteComponent() {
  return (
    <div className="bgs-gradient-layers-2 flex-center items-end bg-blue-600">
      Hello "/_authed/_playground/history"!
    </div>
  )
}
