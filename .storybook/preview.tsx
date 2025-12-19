import type { Preview } from "@storybook/react-vite"
import { AlertDialogContainer } from "../src/components/ui/alert-dialog/alert-dialog-container"
import { Toaster } from "../src/components/ui/toast/toaster"

import { sonnerToast } from "../src/components/ui/sonner"

import { withThemeByClassName } from "@storybook/addon-themes"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router"
import { Toaster as SonnerToaster } from "sonner"
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
          <RouterProvider
            router={createRouter({
              history: createMemoryHistory(),
              routeTree: createRootRoute({
                component: Story,
              }),
            })}
          />
          <Toaster />
          <SonnerToaster />
          <AlertDialogContainer />
          {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      )
    },
    withThemeByClassName<any>({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
  parameters: {
    docs: {
      codePanel: true,
    },
  },

  tags: ["autodocs"],
}

export default preview
