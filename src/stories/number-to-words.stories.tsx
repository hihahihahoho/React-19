import { numberToWords } from "@/lib/number-to-words"
import { type Meta, type StoryObj } from "@storybook/react-vite"

/**
 * Number to Words utility - Converts numeric values to Vietnamese words.
 * Supports integers, decimals, negative numbers, and bigint.
 */
const meta = {
  title: "Utils/Number To Words",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Utility function for converting numeric values to Vietnamese words.

## Features
- **Vietnamese Pronunciation**: Correct handling of "lẻ", "mốt", "lăm" rules
- **Multiple Input Types**: Supports number, string, and bigint
- **Decimal Support**: Handles decimal numbers with "phẩy" separator
- **Negative Numbers**: Prefixes with "âm"
- **Large Numbers**: Supports up to vigintillion (10^63)
- **Locale Support**: Extensible for future locales (default: vi-VN)

## Usage
\`\`\`tsx
import { numberToWords } from "@/lib/number-to-words"

// Basic usage
numberToWords(42)         // "bốn mươi hai"
numberToWords(101)        // "một trăm lẻ một"
numberToWords(1000000)    // "một triệu"

// Negative numbers
numberToWords(-123)       // "âm một trăm hai mươi ba"

// Decimal numbers
numberToWords(3.14)       // "ba phẩy mười bốn"

// With locale option (default: vi-VN)
numberToWords(42, { locale: "vi-VN" })  // "bốn mươi hai"
\`\`\`

## Vietnamese Pronunciation Rules
- **"lẻ"**: Used when tens place is zero after hundreds/scales (101 → "một trăm lẻ một")
- **"mốt"**: Used for 1 in tens position (21 → "hai mươi mốt")
- **"lăm"**: Used for 5 in tens position (25 → "hai mươi lăm")
- **"năm"**: Used for 5 after "lẻ" (105 → "một trăm lẻ năm")
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic number conversion examples.
 */
export const BasicNumbers: Story = {
  render: () => {
    const numbers = [
      { value: 0, label: "Zero" },
      { value: 1, label: "One" },
      { value: 5, label: "Five" },
      { value: 10, label: "Ten" },
      { value: 11, label: "Eleven" },
      { value: 15, label: "Fifteen" },
      { value: 19, label: "Nineteen" },
      { value: 20, label: "Twenty" },
      { value: 21, label: "Twenty-one (mốt)" },
      { value: 25, label: "Twenty-five (lăm)" },
      { value: 42, label: "Forty-two" },
      { value: 99, label: "Ninety-nine" },
      { value: 100, label: "Hundred" },
    ]

    return (
      <div className="w-full max-w-2xl space-y-2">
        <h3 className="mb-4 text-lg font-semibold">Basic Numbers (0-100)</h3>
        {numbers.map((item, index) => (
          <div
            key={index}
            className="flex justify-between border-b pb-2 last:border-0"
          >
            <span className="text-muted-foreground">
              {item.label} ({item.value}):
            </span>
            <div className="text-right">
              <code className="font-mono text-sm font-semibold">
                {numberToWords(item.value)}
              </code>
              <p className="text-muted-foreground text-xs">
                {numberToWords(item.value, { locale: "en-US" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Basic number conversion from 0 to 100, demonstrating special Vietnamese pronunciation rules.",
      },
    },
  },
}

/**
 * Vietnamese-specific pronunciation rules.
 */
export const VietnameseRules: Story = {
  render: () => {
    const rules = [
      {
        category: '"Lẻ" Rule',
        description: "Used when tens place is zero after hundreds or scales",
        items: [
          { value: 101, note: "lẻ một" },
          { value: 105, note: "lẻ năm (not lăm)" },
          { value: 202, note: "lẻ hai" },
          { value: 1001, note: "không trăm lẻ một" },
          { value: 1050, note: "không trăm năm mươi" },
        ],
      },
      {
        category: '"Mốt" Rule (1 in tens)',
        description: "Used for 1 in tens position (21, 31, 41...)",
        items: [
          { value: 21, note: "mốt" },
          { value: 31, note: "mốt" },
          { value: 51, note: "mốt" },
          { value: 121, note: "mốt at the end" },
        ],
      },
      {
        category: '"Lăm" Rule (5 in tens)',
        description: "Used for 5 in tens position (25, 35, 45...)",
        items: [
          { value: 15, note: "lăm (special teen)" },
          { value: 25, note: "lăm" },
          { value: 35, note: "lăm" },
          { value: 125, note: "lăm at the end" },
        ],
      },
    ]

    return (
      <div className="w-full max-w-2xl space-y-6">
        <h3 className="text-lg font-semibold">
          Vietnamese Pronunciation Rules
        </h3>
        {rules.map((rule, ruleIndex) => (
          <div key={ruleIndex} className="space-y-2">
            <div>
              <h4 className="text-sm font-semibold">{rule.category}</h4>
              <p className="text-muted-foreground text-xs">
                {rule.description}
              </p>
            </div>
            {rule.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex justify-between border-b pb-2 pl-4 last:border-0"
              >
                <span className="text-muted-foreground text-sm">
                  {item.value} <span className="text-xs">({item.note})</span>:
                </span>
                <div className="text-right">
                  <code className="font-mono text-sm font-semibold">
                    {numberToWords(item.value)}
                  </code>
                  <p className="text-muted-foreground text-xs">
                    {numberToWords(item.value, { locale: "en-US" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates Vietnamese-specific pronunciation rules: lẻ, mốt, and lăm.",
      },
    },
  },
}

/**
 * Large numbers with scale words.
 */
export const LargeNumbers: Story = {
  render: () => {
    const numbers = [
      { value: 1000, label: "Thousand" },
      { value: 1001, label: "Thousand and one" },
      { value: 1100, label: "One thousand one hundred" },
      { value: 10000, label: "Ten thousand" },
      { value: 100000, label: "Hundred thousand" },
      { value: 1000000, label: "Million" },
      { value: 1000001, label: "Million and one" },
      { value: 10000000, label: "Ten million" },
      { value: 100000000, label: "Hundred million" },
      { value: 1000000000, label: "Billion (tỷ)" },
      { value: 1234567890, label: "Complex number" },
    ]

    return (
      <div className="w-full max-w-2xl space-y-2">
        <h3 className="mb-4 text-lg font-semibold">Large Numbers</h3>
        {numbers.map((item, index) => (
          <div
            key={index}
            className="flex justify-between border-b pb-2 last:border-0"
          >
            <span className="text-muted-foreground text-sm">
              {item.label} ({item.value.toLocaleString("vi-VN")}):
            </span>
            <div className="text-right">
              <code className="font-mono text-sm font-semibold">
                {numberToWords(item.value)}
              </code>
              <p className="text-muted-foreground text-xs">
                {numberToWords(item.value, { locale: "en-US" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Large number conversion with Vietnamese scale words: nghìn (thousand), triệu (million), tỷ (billion).",
      },
    },
  },
}

/**
 * Negative and decimal numbers.
 */
export const NegativeAndDecimals: Story = {
  render: () => {
    const numbers = [
      {
        category: "Negative Numbers",
        items: [
          { value: -1, label: "Negative one" },
          { value: -42, label: "Negative forty-two" },
          { value: -100, label: "Negative hundred" },
          { value: -1000, label: "Negative thousand" },
        ],
      },
      {
        category: "Decimal Numbers",
        items: [
          { value: 0.5, label: "Zero point five" },
          { value: 1.5, label: "One point five" },
          { value: 3.14, label: "Pi (3.14)" },
          { value: 3.14159, label: "Pi extended" },
          { value: 100.01, label: "Hundred point zero one" },
          { value: 1.001, label: "One point zero zero one" },
        ],
      },
    ]

    return (
      <div className="w-full max-w-2xl space-y-6">
        <h3 className="text-lg font-semibold">Negative & Decimal Numbers</h3>
        {numbers.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <h4 className="text-muted-foreground text-sm font-semibold">
              {section.category}
            </h4>
            {section.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex justify-between border-b pb-2 pl-4 last:border-0"
              >
                <span className="text-muted-foreground text-sm">
                  {item.label} ({item.value}):
                </span>
                <div className="text-right">
                  <code className="font-mono text-sm font-semibold">
                    {numberToWords(item.value)}
                  </code>
                  <p className="text-muted-foreground text-xs">
                    {numberToWords(item.value, { locale: "en-US" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Negative numbers use 'âm' prefix. Decimals use 'phẩy' as separator.",
      },
    },
  },
}

/**
 * String and BigInt inputs.
 */
export const DifferentInputTypes: Story = {
  render: () => {
    const inputs = [
      {
        category: "String Inputs",
        items: [
          { input: "42", type: "string", label: "" },
          { input: "1000000", type: "string", label: "" },
          { input: "-123", type: "string", label: "" },
          { input: "3.14", type: "string", label: "" },
        ],
      },
      {
        category: "BigInt Inputs",
        items: [
          {
            input: 9007199254740991n,
            type: "bigint",
            label: "MAX_SAFE_INTEGER",
          },
          {
            input: 9007199254740992n,
            type: "bigint",
            label: "Beyond safe integer",
          },
          {
            input: 123456789012345678901234567890n,
            type: "bigint",
            label: "Very large",
          },
        ],
      },
    ]

    return (
      <div className="w-full max-w-2xl space-y-6">
        <h3 className="text-lg font-semibold">Different Input Types</h3>
        {inputs.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <h4 className="text-muted-foreground text-sm font-semibold">
              {section.category}
            </h4>
            {section.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex justify-between border-b pb-2 pl-4 last:border-0"
              >
                <span className="text-muted-foreground text-sm">
                  {item.type === "bigint" && item.label
                    ? item.label
                    : `"${item.input}"`}{" "}
                  <span className="text-xs">({item.type})</span>:
                </span>
                <code className="max-w-xs truncate font-mono text-sm font-semibold">
                  {numberToWords(item.input)}
                </code>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Supports multiple input types: number, string, and bigint. BigInt is useful for very large numbers beyond JavaScript's safe integer range.",
      },
    },
  },
}

/**
 * Real-world use cases.
 */
export const RealWorldUseCases: Story = {
  render: () => {
    const useCases = [
      {
        category: "Money (VND)",
        items: [
          { value: 50000, label: "Fifty thousand" },
          { value: 100000, label: "One hundred thousand" },
          { value: 500000, label: "Five hundred thousand" },
          { value: 1000000, label: "One million" },
          { value: 10000000, label: "Ten million" },
          { value: 150000000, label: "Contract value" },
        ],
      },
      {
        category: "Check/Invoice Writing",
        items: [
          { value: 1234567, label: "Invoice amount" },
          { value: 9876543, label: "Check amount" },
          { value: 50000000, label: "Deposit" },
        ],
      },
    ]

    return (
      <div className="w-full max-w-2xl space-y-6">
        <h3 className="text-lg font-semibold">Real-World Use Cases</h3>
        {useCases.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <h4 className="text-muted-foreground text-sm font-semibold">
              {section.category}
            </h4>
            {section.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex flex-col gap-1 border-b pb-2 pl-4 last:border-0"
              >
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    {item.label}:
                  </span>
                  <span className="font-mono text-sm">
                    {item.value.toLocaleString("vi-VN")} VND
                  </span>
                </div>
                <code className="text-primary text-sm font-semibold">
                  {numberToWords(item.value)} đồng
                </code>
                <p className="text-muted-foreground text-xs">
                  {numberToWords(item.value, { locale: "en-US" })} dong
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Common use cases in Vietnam: writing amounts on checks, invoices, contracts where numbers must be spelled out.",
      },
    },
  },
}

/**
 * Interactive demo with input.
 */
function InteractiveDemoComponent() {
  const [inputValue, setInputValue] = React.useState("1234567")
  const [resultVi, setResultVi] = React.useState("")
  const [resultEn, setResultEn] = React.useState("")
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    try {
      if (inputValue.trim()) {
        setResultVi(numberToWords(inputValue))
        setResultEn(numberToWords(inputValue, { locale: "en-US" }))
        setError("")
      } else {
        setResultVi("")
        setResultEn("")
        setError("")
      }
    } catch (e) {
      setResultVi("")
      setResultEn("")
      setError(e instanceof Error ? e.message : "Invalid input")
    }
  }, [inputValue])

  return (
    <div className="w-full max-w-2xl space-y-4">
      <h3 className="text-lg font-semibold">Interactive Demo</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium">Enter a number:</label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border-input bg-background w-full rounded-md border px-3 py-2 font-mono"
          placeholder="Enter a number..."
        />
      </div>
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      ) : resultVi ? (
        <div className="space-y-3 rounded-md border p-4">
          <div>
            <p className="text-muted-foreground mb-1 text-sm">Vietnamese:</p>
            <p className="text-primary text-lg font-semibold">{resultVi}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-sm">English:</p>
            <p className="text-muted-foreground text-sm">{resultEn}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export const InteractiveDemo: Story = {
  render: () => <InteractiveDemoComponent />,
  parameters: {
    docs: {
      description: {
        story: "Try converting any number to Vietnamese words interactively.",
      },
    },
  },
}

// Need React for interactive demo
import React from "react"
