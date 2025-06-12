import { NavGroupTanstack } from "@/components/layout/sidebar/nav-interface";
import { BookOpen, SquareTerminal } from "lucide-react";

export const NAV_DATA_MAIN: NavGroupTanstack[] = [
  {
    groupLabel: "Platform",
    items: [
      {
        title: "Playground",
        icon: SquareTerminal,
        items: [
          {
            title: "History",
            url: '/history'
          },
          {
            title: "Starred",
            url: '/starred',
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
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
          },
          {
            title: "Get Started",
          },
          {
            title: "Tutorials",
          },
          {
            title: "Changelog",
          },
        ],
      },

    ],
  },
]
