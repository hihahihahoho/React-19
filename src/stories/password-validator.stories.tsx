import { PasswordValidator } from "@/components/ui/password-validator"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { z } from "zod"

const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "At least 1 uppercase letter")
  .regex(/[a-z]/, "At least 1 lowercase letter")
  .regex(/[0-9]/, "At least 1 number")
  .regex(/[^a-zA-Z0-9]/, "At least 1 special character")

const meta = {
  title: "Forms/PasswordValidator",
  component: PasswordValidator,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`\`\`bash
pnpm dlx shadcn@latest add https://react-19.octung112.workers.dev/r/password-validator.json
\`\`\`

Password validator component displays validation rules extracted from a Zod schema with real-time feedback.
        `,
      },
    },
  },
} satisfies Meta<typeof PasswordValidator>

export default meta
type Story = StoryObj<typeof meta>

function InteractiveDemo() {
  const [value, setValue] = useState("")
  return (
    <div className="w-80 space-y-2">
      <input
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter password"
        className="w-full rounded-md border px-3 py-2"
      />
      <PasswordValidator value={value} schema={passwordSchema} />
    </div>
  )
}

/**
 * Interactive demo showing real-time password validation.
 */
export const Default: Story = {
  args: {
    value: "",
    schema: passwordSchema,
  },
  render: () => <InteractiveDemo />,
}

/**
 * Password validator with partial progress.
 */
export const PartialProgress: Story = {
  args: {
    value: "Test123",
    schema: passwordSchema,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

/**
 * Password validator with all rules passed.
 */
export const AllPassed: Story = {
  args: {
    value: "Test123!@#",
    schema: passwordSchema,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}
