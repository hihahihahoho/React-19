import { Button } from "@/components/ui/button"
import { CircleProgress } from "@/components/ui/circle-progress"
import type { Meta, StoryObj } from "@storybook/react"
import { useEffect, useState } from "react"

/**
 * CircleProgress component visually represents progress, completion, or usage metrics in a circular format.
 * Useful for displaying percentages, counters, timers, and resource usage indicators.
 */
const meta = {
  title: "Display/Circle Progress",
  component: CircleProgress,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
CircleProgress displays progress, completion status, or usage metrics in a circular format.
It provides visual feedback about processes, tasks completion, or resource utilization.

## When to use
- To show completion percentage of a task or process
- To display resource usage (disk space, memory, CPU)
- To create countdown or elapsed time indicators
- For data visualization that needs to show parts of a whole

## Accessibility
- Progress indicator includes ARIA attributes for screen readers
- Value text provides detailed information about current progress value
- Ensure sufficient color contrast for the progress indicator
- Consider providing text alternatives that describe the progress value
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 100 },
      description: "Current value of the progress",
    },
    maxValue: {
      control: { type: "number", min: 1 },
      description: "Maximum value for the progress",
    },
    size: {
      control: { type: "number", min: 20, max: 300 },
      description: "Size of the progress circle in pixels",
    },
    strokeWidth: {
      control: { type: "number", min: 1, max: 20 },
      description: "Width of the progress stroke",
    },
    counterClockwise: {
      control: "boolean",
      description:
        "When true, the progress fills in a counter-clockwise direction",
    },
    getColor: {
      description:
        "Function that returns color class based on percentage filled",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
    animationDuration: {
      control: { type: "number", min: 0, max: 5000 },
      description: "Duration of the animation in milliseconds",
    },
    disableAnimation: {
      control: "boolean",
      description: "When true, disables the initial animation effect",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CircleProgress>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic examples of CircleProgress with different progress values.
 * The progress animates from 0 to the target value.
 */
export const BasicExamples: Story = {
  args: {
    value: 50,
    maxValue: 100,
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <div className="flex flex-col items-center">
        <CircleProgress value={0} maxValue={100} size={80} />
        <span className="mt-2 text-sm">0%</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={25} maxValue={100} size={80} />
        <span className="mt-2 text-sm">25%</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={50} maxValue={100} size={80} />
        <span className="mt-2 text-sm">50%</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={75} maxValue={100} size={80} />
        <span className="mt-2 text-sm">75%</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={100} maxValue={100} size={80} />
        <span className="mt-2 text-sm">100%</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Basic examples showing CircleProgress with different values. Each progress indicator animates smoothly from 0 to its target value.",
      },
    },
  },
}

/**
 * CircleProgress with different sizes to fit various UI contexts.
 */
export const SizeVariants: Story = {
  args: {
    value: 66,
    maxValue: 100,
  },
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      <div className="flex flex-col items-center">
        <CircleProgress value={66} maxValue={100} size={40} />
        <span className="mt-2 text-sm">40px</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={66} maxValue={100} size={60} />
        <span className="mt-2 text-sm">60px</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={66} maxValue={100} size={80} />
        <span className="mt-2 text-sm">80px</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={66} maxValue={100} size={100} />
        <span className="mt-2 text-sm">100px</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={66} maxValue={100} size={120} />
        <span className="mt-2 text-sm">120px</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "CircleProgress can be rendered in different sizes to fit your UI requirements.",
      },
    },
  },
}

/**
 * CircleProgress with different stroke widths for varied visual emphasis.
 */
export const StrokeWidthVariants: Story = {
  args: {
    value: 60,
    maxValue: 100,
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <div className="flex flex-col items-center">
        <CircleProgress value={60} maxValue={100} size={80} strokeWidth={2} />
        <span className="mt-2 text-sm">2px</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={60} maxValue={100} size={80} strokeWidth={4} />
        <span className="mt-2 text-sm">4px</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={60} maxValue={100} size={80} strokeWidth={6} />
        <span className="mt-2 text-sm">6px</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={60} maxValue={100} size={80} strokeWidth={10} />
        <span className="mt-2 text-sm">10px</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={60} maxValue={100} size={80} strokeWidth={15} />
        <span className="mt-2 text-sm">15px</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Vary the stroke width to achieve different visual weights.",
      },
    },
  },
}

/**
 * Default color behavior based on fill percentage.
 */
export const DefaultColorBehavior: Story = {
  args: {
    value: 60,
    maxValue: 100,
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <div className="flex flex-col items-center">
        <CircleProgress value={30} maxValue={100} size={80} />
        <span className="mt-2 text-sm">30% (Green)</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={75} maxValue={100} size={80} />
        <span className="mt-2 text-sm">75% (Yellow)</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={95} maxValue={100} size={80} />
        <span className="mt-2 text-sm">95% (Red)</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "By default, the CircleProgress uses green for values less than 70%, yellow for values between 70% and 90%, and red for values above 90%.",
      },
    },
  },
}

/**
 * Custom color functions for specialized visualizations.
 */
export const CustomColorFunctions: Story = {
  args: {
    value: 40,
    maxValue: 100,
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      {/* Inverse color scale (red → yellow → green) */}
      <div className="flex flex-col items-center">
        <CircleProgress
          value={30}
          maxValue={100}
          size={80}
          getColor={(percent) => {
            if (percent < 0.3) return "stroke-rose-500"
            if (percent < 0.7) return "stroke-amber-500"
            return "stroke-emerald-500"
          }}
        />
        <span className="mt-2 text-sm">30% (Inverted)</span>
      </div>

      {/* Multi-step gradient */}
      <div className="flex flex-col items-center">
        <CircleProgress
          value={60}
          maxValue={100}
          size={80}
          getColor={(percent) => {
            if (percent < 0.2) return "stroke-blue-500"
            if (percent < 0.4) return "stroke-indigo-500"
            if (percent < 0.6) return "stroke-violet-500"
            if (percent < 0.8) return "stroke-purple-500"
            return "stroke-fuchsia-500"
          }}
        />
        <span className="mt-2 text-sm">60% (Gradient)</span>
      </div>

      {/* Single color mode */}
      <div className="flex flex-col items-center">
        <CircleProgress
          value={85}
          maxValue={100}
          size={80}
          getColor={() => "stroke-sky-500"}
        />
        <span className="mt-2 text-sm">85% (Fixed)</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Custom color functions allow you to define your own color logic based on the progress percentage.",
      },
    },
  },
}

/**
 * CircleProgress can fill in clockwise or counter-clockwise direction.
 */
export const DirectionVariants: Story = {
  args: {
    value: 65,
    maxValue: 100,
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <div className="flex flex-col items-center">
        <CircleProgress value={65} maxValue={100} size={80} />
        <span className="mt-2 text-sm">Clockwise (default)</span>
      </div>
      <div className="flex flex-col items-center">
        <CircleProgress value={65} maxValue={100} size={80} counterClockwise />
        <span className="mt-2 text-sm">Counter-clockwise</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The progress can fill in either clockwise (default) or counter-clockwise directions.",
      },
    },
  },
}

/**
 * Countdown timer example using CircleProgress.
 */
export const CountdownTimer: Story = {
  args: {
    value: 100,
    maxValue: 100,
  },
  render: function CountdownTimerComponent() {
    // Start with 2:33 (153 seconds)
    const TOTAL_TIME = 153
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
    const [isRunning, setIsRunning] = useState(false)

    useEffect(() => {
      let intervalId: number | null = null

      if (isRunning && timeLeft > 0) {
        intervalId = window.setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1)
        }, 1000)
      } else if (timeLeft === 0) {
        setIsRunning(false)
      }

      return () => {
        if (intervalId !== null) {
          clearInterval(intervalId)
        }
      }
    }, [isRunning, timeLeft])

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const resetTimer = () => {
      setTimeLeft(TOTAL_TIME)
      setIsRunning(false)
    }

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <CircleProgress
            value={timeLeft}
            maxValue={TOTAL_TIME}
            size={200}
            strokeWidth={8}
            counterClockwise
            disableAnimation={true}
            aria-valuetext={`${formatTime(timeLeft)} remaining of ${formatTime(TOTAL_TIME)} total time`}
            getColor={(percent) =>
              percent > 0.67
                ? "stroke-emerald-500"
                : percent > 0.33
                  ? "stroke-amber-500"
                  : "stroke-rose-500"
            }
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <Button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button variant={"outline"} onClick={resetTimer}>
            Reset
          </Button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "A countdown timer starting at 2:33, with the circle representing the remaining time. " +
          "The circle starts full and empties as time runs out, changing colors from green to yellow to red as time decreases. " +
          "The animation is disabled for this example to ensure the timer starts from the full position.",
      },
    },
  },
}

/**
 * Resource usage indicators using CircleProgress.
 */
export const ResourceUsage: Story = {
  args: {
    value: 65,
    maxValue: 100,
  },
  render: () => (
    <div className="flex flex-wrap gap-8">
      {/* CPU Usage */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <CircleProgress
            value={65}
            maxValue={100}
            size={100}
            strokeWidth={8}
            aria-valuetext="CPU usage at 65%"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold">65%</span>
            <span className="text-xs text-gray-500">CPU</span>
          </div>
        </div>
      </div>

      {/* Memory Usage */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <CircleProgress
            value={82}
            maxValue={100}
            size={100}
            strokeWidth={8}
            aria-valuetext="Memory usage at 82%"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold">82%</span>
            <span className="text-xs text-gray-500">Memory</span>
          </div>
        </div>
      </div>

      {/* Disk Usage */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <CircleProgress
            value={93}
            maxValue={100}
            size={100}
            strokeWidth={8}
            aria-valuetext="Disk usage at 93%"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold">93%</span>
            <span className="text-xs text-gray-500">Disk</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "CircleProgress is ideal for showing resource usage metrics like CPU, memory, or disk usage. Custom aria-valuetext attributes provide clear context for screen readers.",
      },
    },
  },
}

/**
 * Custom animations and interactions with CircleProgress.
 */
export const AnimatedProgress: Story = {
  args: {
    value: 0,
    maxValue: 100,
  },
  render: function AnimatedProgressComponent() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
      const timer = setTimeout(() => {
        if (progress < 100) {
          setProgress((prev) => Math.min(prev + 5, 100))
        }
      }, 300)

      return () => clearTimeout(timer)
    }, [progress])

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <CircleProgress
            value={progress}
            maxValue={100}
            size={150}
            strokeWidth={10}
            animationDuration={200}
            aria-valuetext={`Progress at ${progress}%`}
            getColor={(percent) => {
              // Rainbow gradient
              if (percent < 0.2) return "stroke-blue-500"
              if (percent < 0.4) return "stroke-indigo-500"
              if (percent < 0.6) return "stroke-purple-500"
              if (percent < 0.8) return "stroke-pink-500"
              return "stroke-rose-500"
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-semibold">{progress}%</span>
          </div>
        </div>
        <Button className="mt-4" onClick={() => setProgress(0)}>
          Reset
        </Button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example showing auto-incrementing progress with color transitions and custom animation duration for a smoother experience.",
      },
    },
  },
}

// ...existing imports and code...

/**
 * Gradient progress examples with custom color transitions.
 */
export const GradientProgress: Story = {
  args: {
    value: 75,
    maxValue: 100,
    useGradient: true,
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      {/* Default gradient */}
      <div className="flex flex-col items-center">
        <CircleProgress
          value={75}
          maxValue={100}
          size={100}
          strokeWidth={10}
          useGradient
          animationDuration={1000}
        />
        <span className="mt-2 text-sm">Default Gradient</span>
      </div>

      {/* Custom blue-purple gradient */}
      <div className="flex flex-col items-center">
        <CircleProgress
          value={75}
          maxValue={100}
          size={100}
          strokeWidth={10}
          useGradient
          gradientColors={["#3b82f6", "#8b5cf6", "#d946ef"]}
          animationDuration={1000}
        />
        <span className="mt-2 text-sm">Blue-Purple</span>
      </div>

      {/* Custom sunset gradient */}
      <div className="flex flex-col items-center">
        <CircleProgress
          value={75}
          maxValue={100}
          size={100}
          strokeWidth={10}
          useGradient
          gradientColors={["#f97316", "#db2777", "#7c3aed"]}
          animationDuration={1000}
        />
        <span className="mt-2 text-sm">Sunset</span>
      </div>

      {/* Custom teal-lime gradient */}
      <div className="flex flex-col items-center">
        <CircleProgress
          value={75}
          maxValue={100}
          size={100}
          strokeWidth={10}
          useGradient
          gradientColors={["#14b8a6", "#84cc16", "#eab308"]}
          animationDuration={1000}
        />
        <span className="mt-2 text-sm">Teal-Lime</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "CircleProgress can display beautiful gradients for a more visually appealing effect. Customize the gradient colors to match your application's design system.",
      },
    },
  },
}

/**
 * A comprehensive showcase of all CircleProgress variants and features.
 */
export const CompleteShowcase: Story = {
  args: {
    value: 40,
    maxValue: 100,
  },
  render: () => (
    <div className="grid gap-12">
      <div>
        <h3 className="mb-4 text-lg font-medium">Progress Values</h3>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col items-center">
            <CircleProgress value={25} maxValue={100} size={60} />
            <span className="mt-2 text-sm">25%</span>
          </div>
          <div className="flex flex-col items-center">
            <CircleProgress value={50} maxValue={100} size={60} />
            <span className="mt-2 text-sm">50%</span>
          </div>
          <div className="flex flex-col items-center">
            <CircleProgress value={75} maxValue={100} size={60} />
            <span className="mt-2 text-sm">75%</span>
          </div>
          <div className="flex flex-col items-center">
            <CircleProgress value={100} maxValue={100} size={60} />
            <span className="mt-2 text-sm">100%</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Size Variations</h3>
        <div className="flex flex-wrap items-end gap-8">
          <div className="flex flex-col items-center">
            <CircleProgress value={66} maxValue={100} size={40} />
            <span className="mt-2 text-sm">Small</span>
          </div>
          <div className="flex flex-col items-center">
            <CircleProgress value={66} maxValue={100} size={80} />
            <span className="mt-2 text-sm">Medium</span>
          </div>
          <div className="flex flex-col items-center">
            <CircleProgress value={66} maxValue={100} size={120} />
            <span className="mt-2 text-sm">Large</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Stroke Width Variations</h3>
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex flex-col items-center">
            <CircleProgress
              value={60}
              maxValue={100}
              size={80}
              strokeWidth={2}
            />
            <span className="mt-2 text-sm">Thin</span>
          </div>
          <div className="flex flex-col items-center">
            <CircleProgress
              value={60}
              maxValue={100}
              size={80}
              strokeWidth={6}
            />
            <span className="mt-2 text-sm">Medium</span>
          </div>
          <div className="flex flex-col items-center">
            <CircleProgress
              value={60}
              maxValue={100}
              size={80}
              strokeWidth={12}
            />
            <span className="mt-2 text-sm">Thick</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Direction Options</h3>
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex flex-col items-center">
            <CircleProgress value={65} maxValue={100} size={80} />
            <span className="mt-2 text-sm">Clockwise</span>
          </div>
          <div className="flex flex-col items-center">
            <CircleProgress
              value={65}
              maxValue={100}
              size={80}
              counterClockwise
            />
            <span className="mt-2 text-sm">Counter-clockwise</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Custom Color Examples</h3>
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex flex-col items-center">
            <CircleProgress
              value={40}
              maxValue={100}
              size={80}
              getColor={() => "stroke-blue-500"}
            />
            <span className="mt-2 text-sm">Blue (Fixed)</span>
          </div>
          <div className="flex flex-col items-center">
            <CircleProgress
              value={40}
              maxValue={100}
              size={80}
              getColor={(percent) => {
                if (percent < 0.3) return "stroke-rose-500"
                if (percent < 0.7) return "stroke-amber-500"
                return "stroke-emerald-500"
              }}
            />
            <span className="mt-2 text-sm">Inverted Scale</span>
          </div>
          <div className="flex flex-col items-center">
            <CircleProgress
              value={40}
              maxValue={100}
              size={80}
              getColor={(percent) => {
                if (percent < 0.2) return "stroke-blue-500"
                if (percent < 0.4) return "stroke-indigo-500"
                if (percent < 0.6) return "stroke-purple-500"
                if (percent < 0.8) return "stroke-pink-500"
                return "stroke-rose-500"
              }}
            />
            <span className="mt-2 text-sm">Multi-Color</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Animation Controls</h3>
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex flex-col items-center">
            <CircleProgress
              value={70}
              maxValue={100}
              size={80}
              animationDuration={2000}
            />
            <span className="mt-2 text-sm">Slow (2s)</span>
          </div>
          <div className="flex flex-col items-center">
            <CircleProgress
              value={70}
              maxValue={100}
              size={80}
              animationDuration={500}
            />
            <span className="mt-2 text-sm">Medium (500ms)</span>
          </div>
          <div className="flex flex-col items-center">
            <CircleProgress
              value={70}
              maxValue={100}
              size={80}
              disableAnimation={true}
            />
            <span className="mt-2 text-sm">No Animation</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A comprehensive showcase displaying all CircleProgress variants and features including sizes, colors, animations, and directions.",
      },
    },
  },
}
