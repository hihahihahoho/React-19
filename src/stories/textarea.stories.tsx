import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea/textarea";
import type { Meta, StoryObj } from "@storybook/react";
import { Smile } from "lucide-react";

const meta = {
  title: "Base/Textarea",
  component: Textarea,
  parameters: {},
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default textarea with placeholder */
export const Default: Story = {
  args: {
    placeholder: "Enter text",
  },
};

export const PlaceholderBlack: Story = {
  args: {
    placeholder: "Enter text",
    className: "placeholder:text-foreground",
  },
};

export const TextareaWhite: Story = {
  args: {
    placeholder: "Enter text",
    className: "placeholder:text-foreground",
    formComposition: {
      variant: "white",
    },
  },
};

/** Textarea with label positioned above */
export const WithLabel: Story = {
  args: {
    placeholder: "Enter your username",
    formComposition: {
      label: "Username",
    },
  },
};

/** Textarea with label positioned to the left */
export const WithLabelHorizontal: Story = {
  args: {
    formComposition: {
      labelPosition: "horizontal",
      label: "Username",
    },
    placeholder: "Enter your username",
  },
};

export const WithLabelHorizontalBreakpoint: Story = {
  args: {
    formComposition: {
      labelPosition: "horizontal",
      label: "Username",
    },
    placeholder: "Enter your username",
  },
};

/** Textarea with a prefix element */
export const WithPrefix: Story = {
  args: {
    formComposition: {
      prefix: "@",
    },
    placeholder: "Enter your handle",
  },
};

/** Textarea with a suffix element */
export const WithSuffix: Story = {
  args: {
    formComposition: {
      suffix: ".com",
    },
    placeholder: "Enter domain name",
  },
};

/** Textarea with an icon on the left */
export const WithIconLeft: Story = {
  args: {
    formComposition: {
      iconLeft: <Smile />,
    },
    placeholder: "Enter your name",
  },
};

/** Textarea with an icon on the right */
export const WithIconRight: Story = {
  args: {
    formComposition: {
      iconRight: <Smile />,
    },
    placeholder: "Search...",
  },
};

/** Textarea with both prefix and suffix */
export const WithPrefixAndSuffix: Story = {
  args: {
    formComposition: {
      prefix: "$",
      suffix: "USD",
    },
    placeholder: "Enter amount",
  },
};

/** Textarea with icons on both sides */
export const WithIconLeftAndRight: Story = {
  args: {
    formComposition: {
      iconLeft: <Smile />,
      iconRight: <Smile />,
    },
    placeholder: "Enter password",
    type: "password",
  },
};

/** Textarea with a prefixNotFocusInput element */
export const WithprefixNotFInput: Story = {
  args: {
    formComposition: {
      prefixNotFocusInput: {
        order: 0,
        element: <Button size={"xs"}>Button</Button>,
      },
    },
    placeholder: "Textarea with prefixNotFocusInput",
  },
};

/** Textarea with a suffixNotFocusInput element */
export const WithsuffixNotFocusInput: Story = {
  args: {
    formComposition: {
      suffixNotFocusInput: {
        order: 6,
        element: <span>SuffixNF</span>,
      },
    },
    placeholder: "Textarea with suffixNotFocusInput",
  },
};

/** Textarea with small size variant */
export const SmallSize: Story = {
  args: {
    formComposition: {
      size: "sm",
    },
    placeholder: "Small size textarea",
  },
};

/** Textarea with large size variant */
export const LargeSize: Story = {
  args: {
    formComposition: {
      size: "lg",
    },
    placeholder: "Large size textarea",
  },
};

/** Textarea combining all features */
export const AllFeatures: Story = {
  args: {
    formComposition: {
      labelPosition: "vertical",
      label: "Email",
      prefix: "@",
      suffix: ".com",
      iconLeft: <Smile />,
      iconRight: <Smile />,
      prefixNotFocusInput: {
        order: 0,
        element: <span>PrefixNF</span>,
      },
      suffixNotFocusInput: {
        order: 6,
        element: <span>SuffixNF</span>,
      },
      prefixOutside: <Button variant={"secondary"}>Button</Button>,
    },
    placeholder: "Enter your email",
  },
};
