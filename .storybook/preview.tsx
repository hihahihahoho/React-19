import type { Preview } from "@storybook/react";
import { AlertDialogContainer } from "../src/components/ui/alert-dialog/alert-dialog-container";
import { Toaster } from "../src/components/ui/toast/toaster";

import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";
import "../src/index.css";

const preview: Preview = {
  decorators: [
    (Story) => {
      return (
        <>
          <Story />
          <Toaster />
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
  },
  tags: ["autodocs"],
};

export default preview;
