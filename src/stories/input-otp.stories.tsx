import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/form"
import { ZodSchemaProvider } from "@/components/ui/form/zod-schema-context"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { InputOTPForm } from "@/components/ui/input-otp-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

/**
 * Input OTP component for entering one-time passwords or verification codes.
 * Use this for authentication flows, two-factor authentication, or any code verification.
 */
const meta: Meta<typeof InputOTP> = {
  title: "Forms/Input OTP",
  component: InputOTP,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/input-otp.json
\`\`\`

Input OTP components are specialized inputs for entering one-time passwords, verification codes, or PINs.
They provide individual slots for each character, making it easy for users to enter codes accurately.

## When to use
- Two-factor authentication (2FA)
- Phone number or email verification
- PIN entry
- Any code verification flow

## Accessibility
- Each slot is clearly separated for easy identification
- Supports keyboard navigation between slots
- Auto-advances to next slot after input
- Supports paste functionality for copying codes
        `,
      },
    },
  },
  argTypes: {
    maxLength: {
      control: "number",
      description: "Maximum number of characters/slots",
      table: {
        defaultValue: { summary: "6" },
      },
    },
    disabled: {
      control: "boolean",
      description: "When true, disables the input",
    },
    pattern: {
      description: "Regex pattern to restrict input characters",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof InputOTP>

/**
 * Basic 6-digit OTP input with separator.
 */
export const Basic: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
  parameters: {
    docs: {
      description: {
        story: "A basic 6-digit OTP input with separator between groups.",
      },
    },
  },
}

/**
 * OTP input that only accepts digits using REGEXP_ONLY_DIGITS pattern.
 */
export const Pattern: Story = {
  render: () => (
    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use the `pattern` prop to define a custom pattern for the OTP input. Import `REGEXP_ONLY_DIGITS` or `REGEXP_ONLY_DIGITS_AND_CHARS` from `input-otp`.",
      },
    },
  },
}

/**
 * OTP input with separator between groups.
 */
export const Separator: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "You can use the `<InputOTPSeparator />` component to add a separator between the input groups.",
      },
    },
  },
}

/**
 * Controlled OTP input with value display.
 */
export const Controlled: Story = {
  render: function ControlledOTP() {
    const [value, setValue] = useState("")

    return (
      <div className="space-y-2">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <div className="text-center text-sm">
          {value === "" ? (
            <>Enter your one-time password.</>
          ) : (
            <>You entered: {value}</>
          )}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "You can use the `value` and `onChange` props to control the input value.",
      },
    },
  },
}

/**
 * 4-digit PIN input with digits only pattern.
 */
export const FourDigitPIN: Story = {
  render: () => (
    <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A 4-digit PIN input commonly used for short verification codes, restricted to digits only.",
      },
    },
  },
}

/**
 * Disabled OTP input.
 */
export const Disabled: Story = {
  render: () => (
    <InputOTP maxLength={6} disabled>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
  parameters: {
    docs: {
      description: {
        story: "A disabled OTP input that prevents user interaction.",
      },
    },
  },
}

/**
 * Different slot configurations.
 */
export const SlotConfigurations: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">4 digits (PIN)</p>
        <InputOTP maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">6 digits (3-3)</p>
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">8 digits (2-2-2-2)</p>
        <InputOTP maxLength={8}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={6} />
            <InputOTPSlot index={7} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Various slot configurations for different use cases.",
      },
    },
  },
}

/**
 * Form validation with InputOTPForm using react-hook-form and zod.
 */
export const WithFormValidation: Story = {
  render: () => {
    const formSchema = z.object({
      pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
      }),
    })

    function FormExample() {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          pin: "",
        },
      })

      const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        alert("OTP submitted: " + values.pin)
      }

      return (
        <ZodSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <InputOTPForm
                name="pin"
                maxLength={6}
                formComposition={{
                  label: "One-Time Password",
                  description:
                    "Please enter the one-time password sent to your phone.",
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTPForm>
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </ZodSchemaProvider>
      )
    }

    return <FormExample />
  },
  parameters: {
    docs: {
      description: {
        story:
          "OTP input integrated with react-hook-form and zod validation using InputOTPForm component.",
      },
    },
  },
}

/**
 * InputOTPForm with separator.
 */
export const FormWithSeparator: Story = {
  render: () => {
    const formSchema = z.object({
      code: z.string().min(6, {
        message: "Verification code must be 6 characters.",
      }),
    })

    function FormExample() {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          code: "",
        },
      })

      const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        alert("Code submitted: " + values.code)
      }

      return (
        <ZodSchemaProvider schema={formSchema}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <InputOTPForm
                name="code"
                maxLength={6}
                formComposition={{
                  label: "Verification Code",
                  description: "Enter the 6-digit code sent to your email.",
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTPForm>
              <Button type="submit" className="w-full">
                Verify
              </Button>
            </form>
          </Form>
        </ZodSchemaProvider>
      )
    }

    return <FormExample />
  },
  parameters: {
    docs: {
      description: {
        story:
          "InputOTPForm with separator between groups for better readability.",
      },
    },
  },
}
