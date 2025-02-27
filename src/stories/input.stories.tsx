/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@/components/ui/button";
import { Input, OnValueChangeInput } from "@/components/ui/input/input";
import { Select } from "@/components/ui/select/select";
import type { Meta, StoryObj } from "@storybook/react";
import { Smile } from "lucide-react";
import { useState } from "react";

const meta = {
  title: "Base/Input",
  component: Input,
  parameters: {},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default input with placeholder */
export const Default: Story = {
  args: {
    placeholder: "Enter text",
  },
};

/** Default input with placeholder */
export const Controled: Story = {
  args: {
    placeholder: "Enter text",
    value: 100000,
  },
  render: (args) => {
    const [value, setValue] = useState<OnValueChangeInput>(args.value || "");

    return (
      <div className="w-full">
        <Input {...args} value={value} onValueChange={setValue} />
        <Button variant={"secondary"}>Button</Button>
      </div>
    );
  },
};

export const PlaceholderBlack: Story = {
  args: {
    placeholder: "Enter text",
    className: "placeholder:text-foreground",
  },
};

export const InputWhite: Story = {
  args: {
    placeholder: "Enter text",
    className: "placeholder:text-foreground",
    formComposition: {
      variant: "white",
    },
  },
};

/** Input with label positioned above */
export const WithLabel: Story = {
  args: {
    placeholder: "Enter your username",
    formComposition: {
      label: "Username",
    },
  },
};

/** Input with label positioned to the left */
export const WithLabelHorizontal: Story = {
  args: {
    formComposition: {
      label: "Username",
      labelPosition: "horizontal",
    },
    placeholder: "Enter your username",
  },
};

export const WithLabelHorizontalBreakpoint: Story = {
  args: {
    formComposition: {
      label: "Username",

      labelPosition: "horizontal",
    },
    placeholder: "Enter your username",
  },
};

/** Input with a prefix element */
export const WithPrefix: Story = {
  args: {
    formComposition: {
      prefix: "@",
    },
    placeholder: "Enter your handle",
  },
};

/** Input with a suffix element */
export const WithSuffix: Story = {
  args: {
    formComposition: {
      suffix: ".com",
    },
    placeholder: "Enter domain name",
  },
};

/** Input with an icon on the left */
export const WithIconLeft: Story = {
  args: {
    formComposition: {
      iconLeft: <Smile />,
    },
    placeholder: "Enter your name",
  },
};

/** Input with an icon on the right */
export const WithIconRight: Story = {
  args: {
    formComposition: {
      iconRight: <Smile />,
    },
    placeholder: "Search...",
  },
};

/** Input with both prefix and suffix */
export const WithPrefixAndSuffix: Story = {
  args: {
    formComposition: {
      prefix: "$",
      suffix: "USD",
    },
    placeholder: "Enter amount",
  },
};
/** Input with a prefixNotFocusInput element */
export const WithprefixNotFocusInput: Story = {
  args: {
    formComposition: {
      prefixNotFocusInput: {
        order: 0,
        element: (
          <div className="">
            <Select
              options={[
                {
                  value: "Option 1",
                  label: "Không có gì quầng mắt",
                  icon: "https://github.com/shadcn.png",
                  keywords: ["Tùng"],
                },
                { value: "Option 2", label: "Không có gì quầng mắt" },
                { value: "Option 3", label: "tùng Ốcc" },
              ]}
            />
          </div>
        ),
      },
    },
    placeholder: "Input with prefixNotFocusInput",
  },
};

/** Input with a suffixNotFocusInput element */
export const WithsuffixNotFocusInput: Story = {
  args: {
    formComposition: {
      suffixNotFocusInput: {
        order: 6,
        element: <span>SuffixNF</span>,
      },
    },
    placeholder: "Input with suffixNotFocusInput",
  },
};

/** Input with small size variant */
export const SmallSize: Story = {
  args: {
    formComposition: {
      size: "sm",
    },
    placeholder: "Small size input",
  },
};

/** Input with large size variant */
export const LargeSize: Story = {
  args: {
    formComposition: {
      size: "lg",
    },
    placeholder: "Large size input",
  },
};

/** Input combining all features */
export const AllFeatures: Story = {
  args: {
    formComposition: {
      label: "Email",
      labelPosition: "horizontal",
      description: "We will never share your email with anyone else.",
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

/** Input combining all features */
export const AllFeaturesDisabled: Story = {
  args: {
    disabled: true,
    formComposition: {
      label: "Email",
      labelPosition: "horizontal",
      description: "We will never share your email with anyone else.",
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
