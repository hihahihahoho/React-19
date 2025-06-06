import type { Preview } from "@storybook/react-vite"
import { AlertDialogContainer } from "../src/components/ui/alert-dialog/alert-dialog-container"
import { Toaster } from "../src/components/ui/toast/toaster"

import { sonnerToast } from "../src/components/ui/sonner"

import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster as SonnerToaster } from "sonner"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/zoom"
import "../src/index.css"
import "./story-style.css"

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const showDevtools = context.parameters?.reactQuery?.devtools === true
      // Check the background color to determine the theme
      const background = context.globals?.backgrounds?.value
      document.documentElement.classList.toggle(
        "dark",
        background === "#0a0a0a"
      )
      document.documentElement.classList.toggle(
        "light",
        background === "#ffffff"
      )

      const queryClient = new QueryClient({
        queryCache: new QueryCache({
          onError: (error) =>
            sonnerToast({
              title: error.message,
              variant: "destructive",
            }),
        }),
      })
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
          <Toaster />
          <SonnerToaster />
          <AlertDialogContainer />
          {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      )
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      codePanel: true,
    },
    themes: {
      default: "light", // Ensure the themes parameter is defined
      list: [
        { name: "light", class: "light", color: "#ffffff" },
        { name: "dark", class: "dark", color: "#0a0a0a" },
      ],
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0a0a0a" },
      ],
    },
  },
  tags: ["autodocs"],
}

export default preview
