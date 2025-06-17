"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { SVGInline } from "@/components/ui/SVGInline/SVGInline"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import * as React from "react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      groupLabel: "Platform",
      items: [
        {
          title: "Playground",
          url: "#",
          icon: SquareTerminal,
          items: [
            {
              title: "History",
            },
            {
              title: "Starred",
              url: "#",
            },
            {
              title: "Settings",
              url: "#",
              items: [
                {
                  title: "History",
                },
                {
                  title: "Starred",
                  url: "#",
                },
                {
                  title: "Settings",
                  url: "#",
                },
              ],
            },
          ],
        },
        {
          title: "Models",
          url: "#",
          icon: Bot,
          items: [
            {
              title: "Genesis",
              url: "#",
            },
            {
              title: "Explorer",
              url: "#",
            },
            {
              title: "Quantum",
              url: "#",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Resources",
      items: [
        {
          title: "Documentation",
          url: "#",
          icon: BookOpen,
          items: [
            {
              title: "Introduction",
              url: "#",
            },
            {
              title: "Get Started",
              url: "#",
            },
            {
              title: "Tutorials",
              url: "#",
            },
            {
              title: "Changelog",
              url: "#",
            },
          ],
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings2,
          items: [
            {
              title: "General",
              url: "#",
            },
            {
              title: "Team",
              url: "#",
            },
            {
              title: "Billing",
              url: "#",
            },
            {
              title: "Limits",
              url: "#",
            },
          ],
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings,
        },
      ],
    },
  ],
}

export function AppSidebar({
  navMain,
  ...props
}: React.ComponentProps<typeof Sidebar> & { navMain?: any[] }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-base-border-light box-content flex h-10 justify-start border-b p-4">
        <SVGInline
          src={"/public/images/logo/Logo.svg"}
          className="h-full w-fit"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain || data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
