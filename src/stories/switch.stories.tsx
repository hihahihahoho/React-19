import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/form";
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context";
import { SelectionGroup } from "@/components/ui/selection-controls/selection-group";
import { Switch } from "@/components/ui/selection-controls/switch";
import { SwitchForm } from "@/components/ui/selection-controls/switch-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/**
 * Switch component allows users to toggle between two states.
 * Use switches when users need to toggle a setting on or off.
 */
const meta = {
  title: "Base/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Switch components provide a way for users to toggle between two states: on and off.
They are commonly used for enabling or disabling features, settings, or preferences.

## When to use
- When users need to toggle a single option on or off
- For immediate effect on system state or preferences
- For binary choices where the result of the selection is immediately applied
- When you need a compact UI element for toggling settings

## Accessibility
- Switches are keyboard accessible and can be toggled using the Space key
- Always provide visible labels for switches to explain their purpose
- Use proper ARIA attributes for custom switches
- Group related switches with appropriate labels for screen readers
        `,
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Controls whether the switch is checked or not",
    },
    defaultChecked: {
      control: "boolean",
      description: "Sets the initial checked state of an uncontrolled switch",
    },
    disabled: {
      control: "boolean",
      description: "When true, prevents user interaction with the switch",
    },
    required: {
      control: "boolean",
      description: "When true, indicates the field is required",
    },
    onCheckedChange: {
      description: "Function called when the switch state changes",
      action: "checked changed",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the switch",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The basic switch variants showing different states.
 */
export const BasicVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <SelectionGroup control={<Switch />}>Off</SelectionGroup>
      <SelectionGroup control={<Switch defaultChecked />}>On</SelectionGroup>
      <SelectionGroup control={<Switch disabled />}>
        Disabled Off
      </SelectionGroup>
      <SelectionGroup control={<Switch disabled defaultChecked />}>
        Disabled On
      </SelectionGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Basic switch variants showing different states.",
      },
    },
  },
};

/**
 * Switches with different label positions and styles.
 */
export const LabelVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">Standard Labels</h3>
        <div className="flex flex-wrap gap-4">
          <SelectionGroup control={<Switch />}>Notifications</SelectionGroup>
          <SelectionGroup control={<Switch defaultChecked />}>
            Dark Mode
          </SelectionGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Description</h3>
        <div className="space-y-4">
          <SelectionGroup variant="card" control={<Switch />}>
            <div className="space-y-1">
              <h4 className="font-medium leading-none">Email notifications</h4>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for account activity
              </p>
            </div>
          </SelectionGroup>
          <SelectionGroup variant="card" control={<Switch defaultChecked />}>
            <div className="space-y-1">
              <h4 className="font-medium leading-none">Push notifications</h4>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your mobile device
              </p>
            </div>
          </SelectionGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Rich Content Labels</h3>
        <div className="space-y-4">
          <SelectionGroup control={<Switch />}>
            <div className="flex items-center gap-2">
              <span className="font-medium">Do Not Disturb</span>
              <Badge variant={"red"}>Priority</Badge>
            </div>
          </SelectionGroup>
          <SelectionGroup control={<Switch defaultChecked />}>
            <div className="flex items-center gap-2">
              <span className="font-medium">Automatic Updates</span>
              <Badge variant={"green"}>Recommended</Badge>
            </div>
          </SelectionGroup>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Switches with different label positions and content styles.",
      },
    },
  },
};

/**
 * Example of switches in a list with different states.
 */
export const SwitchList: Story = {
  render: () => {
    const options = [
      { id: "1", label: "Email notifications", checked: true },
      { id: "2", label: "Push notifications", checked: false },
      { id: "3", label: "Sound alerts", checked: true },
      { id: "4", label: "Marketing emails", checked: false, disabled: true },
      { id: "5", label: "App updates", checked: false },
    ];

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [items, setItems] = useState(options);

    const handleCheckedChange = (id: string, checked: boolean) => {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, checked } : item))
      );
    };

    return (
      <div className="p-4 space-y-2 border rounded-lg w-72">
        <h3 className="mb-3 font-medium">Notification Settings</h3>
        {items.map((item) => (
          <SelectionGroup
            key={item.id}
            control={
              <Switch
                checked={item.checked}
                disabled={item.disabled}
                onCheckedChange={(checked) =>
                  handleCheckedChange(item.id, checked)
                }
              />
            }
          >
            {item.label}
          </SelectionGroup>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example of switches in a list representing settings or preferences.",
      },
    },
  },
};

/**
 * Examples of using switches in different layouts.
 */
export const LayoutVariants: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <h3 className="mb-2 text-sm font-medium">Vertical Layout</h3>
        <div className="p-4 space-y-2 border rounded-lg">
          <SelectionGroup control={<Switch />}>WiFi</SelectionGroup>
          <SelectionGroup control={<Switch defaultChecked />}>
            Bluetooth
          </SelectionGroup>
          <SelectionGroup control={<Switch />}>Airplane Mode</SelectionGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Horizontal Layout</h3>
        <div className="flex flex-wrap gap-6 p-4 border rounded-lg">
          <SelectionGroup control={<Switch />}>Dark Mode</SelectionGroup>
          <SelectionGroup control={<Switch defaultChecked />}>
            Auto-Save
          </SelectionGroup>
          <SelectionGroup control={<Switch />}>Sync</SelectionGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Grid Layout</h3>
        <div className="grid grid-cols-2 gap-2 p-4 border rounded-lg">
          <SelectionGroup control={<Switch />}>Notifications</SelectionGroup>
          <SelectionGroup control={<Switch />}>Sound</SelectionGroup>
          <SelectionGroup control={<Switch defaultChecked />}>
            Vibration
          </SelectionGroup>
          <SelectionGroup control={<Switch />}>Location</SelectionGroup>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Examples of switch arrangements in different layout patterns.",
      },
    },
  },
};

/**
 * Custom styled switches for different visual appearances.
 */
export const CustomStyledSwitches: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div className="p-4 space-y-3 border rounded-lg">
        <h3 className="mb-2 text-sm font-medium">Feature Toggles</h3>

        <SelectionGroup
          control={<Switch className="data-[state=checked]:bg-blue-500" />}
        >
          <div className="flex flex-col">
            <span className="font-medium">Analytics Dashboard</span>
            <span className="text-xs text-muted-foreground">
              Track your app performance
            </span>
          </div>
        </SelectionGroup>

        <SelectionGroup
          control={<Switch className="data-[state=checked]:bg-purple-500" />}
        >
          <div className="flex flex-col">
            <span className="font-medium">Team Collaboration</span>
            <span className="text-xs text-muted-foreground">
              Work together seamlessly
            </span>
          </div>
        </SelectionGroup>

        <SelectionGroup
          control={<Switch className="data-[state=checked]:bg-green-500" />}
        >
          <div className="flex flex-col">
            <span className="font-medium">API Access</span>
            <span className="text-xs text-muted-foreground">
              Connect with your tools
            </span>
          </div>
        </SelectionGroup>
      </div>

      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
        <SelectionGroup control={<Switch className="h-6 w-11" />}>
          <span className="font-medium">Larger switch style</span>
        </SelectionGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Examples of customized switch styles using CSS classes.",
      },
    },
  },
};

/**
 * Form with Switch validation
 */
export const WithFormValidation: Story = {
  render: () => {
    const formSchema = z.object({
      darkMode: z.boolean().default(false),
      notifications: z
        .boolean()
        .default(true)
        .refine((val) => val === true, {
          message: "Notifications must be enabled for this application.",
        }),
    });

    function FormValidationExample() {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          darkMode: false,
          notifications: true,
        },
      });

      const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
        alert(
          `Form submitted with:\nDark Mode: ${data.darkMode}\nNotifications: ${data.notifications}`
        );
      };

      return (
        <ZodSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 space-y-6 border rounded-lg w-96"
            >
              <SwitchForm
                control={form.control}
                name="darkMode"
                formComposition={{
                  label: "Dark Mode",
                  description: "Use dark theme across the application",
                  labelPosition: "horizontal",
                }}
              />

              <SwitchForm
                control={form.control}
                name="notifications"
                formComposition={{
                  label: "Notifications",
                  description: "Required for important system alerts",
                  labelPosition: "horizontal",
                }}
              />

              <Button type="submit" className="w-full">
                Save Preferences
              </Button>
            </form>
          </Form>
        </ZodSchemaProvider>
      );
    }

    return <FormValidationExample />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example of form validation with switches using react-hook-form and zod.",
      },
    },
  },
};

/**
 * Card variant of SelectionGroup for more prominent selection options.
 */
export const CardVariants: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [settings, setSettings] = useState({
      notifications: true,
      darkMode: false,
      analytics: true,
      marketing: false,
    });

    const handleToggle = (setting: keyof typeof settings, checked: boolean) => {
      setSettings((prev) => ({
        ...prev,
        [setting]: checked,
      }));
    };

    return (
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectionGroup
          variant="card"
          control={
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) =>
                handleToggle("notifications", checked)
              }
            />
          }
        >
          <div className="ml-2">
            <h3 className="font-medium">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Stay updated with important alerts
            </p>
          </div>
        </SelectionGroup>

        <SelectionGroup
          variant="card"
          control={
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => handleToggle("darkMode", checked)}
            />
          }
        >
          <div className="ml-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Dark Mode</h3>
              <Badge variant={"blue"}>New</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Easier on the eyes at night
            </p>
          </div>
        </SelectionGroup>

        <SelectionGroup
          variant="card"
          control={
            <Switch
              checked={settings.analytics}
              onCheckedChange={(checked) => handleToggle("analytics", checked)}
            />
          }
        >
          <div className="ml-2">
            <h3 className="font-medium">Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Help improve our services
            </p>
          </div>
        </SelectionGroup>

        <SelectionGroup
          variant="card"
          control={
            <Switch
              checked={settings.marketing}
              onCheckedChange={(checked) => handleToggle("marketing", checked)}
              disabled
            />
          }
        >
          <div className="ml-2">
            <h3 className="font-medium">Marketing Emails</h3>
            <p className="text-sm text-muted-foreground">
              Disabled during free trial
            </p>
          </div>
        </SelectionGroup>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The card variant of SelectionGroup provides a more prominent visual container for switch options. It shows a border around the entire content and highlights the selected items with a primary-colored ring.",
      },
    },
  },
};

/**
 * A comprehensive showcase of all switch variants and use cases.
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div className="grid w-full max-w-2xl gap-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">Basic States</h3>
        <div className="flex flex-wrap gap-6 p-4 border rounded-lg">
          <SelectionGroup control={<Switch />}>Off</SelectionGroup>
          <SelectionGroup control={<Switch defaultChecked />}>
            On
          </SelectionGroup>
          <SelectionGroup control={<Switch disabled />}>
            Disabled Off
          </SelectionGroup>
          <SelectionGroup control={<Switch disabled defaultChecked />}>
            Disabled On
          </SelectionGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">With Status Indicators</h3>
        <div className="p-4 space-y-2 border rounded-lg">
          <SelectionGroup control={<Switch defaultChecked />}>
            <div className="flex items-center gap-2">
              <span>Online Status</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </SelectionGroup>
          <SelectionGroup control={<Switch />}>
            <div className="flex items-center gap-2">
              <span>Do Not Disturb</span>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </SelectionGroup>
          <SelectionGroup control={<Switch />}>
            <div className="flex items-center gap-2">
              <span>Maintenance Mode</span>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
          </SelectionGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Common Use Cases</h3>
        <div className="p-4 space-y-4 border rounded-lg">
          <SelectionGroup control={<Switch />}>Dark Mode</SelectionGroup>

          <SelectionGroup control={<Switch defaultChecked />}>
            <div className="flex items-center">
              <span>Auto-save</span>
              <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs">
                Recommended
              </span>
            </div>
          </SelectionGroup>

          <SelectionGroup control={<Switch />}>
            <div className="flex items-center gap-1">
              <span>Allow third-party cookies</span>
              <a href="#" className="text-xs text-primary hover:underline">
                (Learn more)
              </a>
            </div>
          </SelectionGroup>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive showcase displaying switch variations and common use cases.",
      },
    },
  },
};

/**
 * Fully interactive example with all available props.
 */
export const Interactive: Story = {
  args: {
    checked: false,
    disabled: false,
    required: false,
  },
  render: (args) => (
    <SelectionGroup control={<Switch {...args} />}>
      Interactive Switch
    </SelectionGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A fully interactive switch that can be customized using the Controls panel.",
      },
    },
  },
};
