import type { Preview } from "@storybook/react";
import { AlertDialogContainer } from "../src/components/ui/alert-dialog/alert-dialog-container";
import { Toaster } from "../src/components/ui/toast/toaster";

import React from "react";
import { Toaster as SonnerToaster } from "sonner";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";
import "../src/index.css";

const preview: Preview = {
  decorators: [
    (Story, context) => {
      // Check the background color to determine the theme
      const background = context.globals?.backgrounds?.value;
      document.documentElement.classList.toggle(
        "dark",
        background === "#09090B"
      );
      document.documentElement.classList.toggle(
        "light",
        background === "#ffffff"
      );
      return (
        <>
          <Story />
          <Toaster />
          <SonnerToaster />
          <AlertDialogContainer />
        </>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    themes: {
      default: "light", // Ensure the themes parameter is defined
      list: [
        { name: "light", class: "light", color: "#ffffff" },
        { name: "dark", class: "dark", color: "#09090B" },
      ],
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#09090B" },
      ],
    },
  },
  tags: ["autodocs", "autodocs"],
};

export default preview;
