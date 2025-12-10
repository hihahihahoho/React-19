import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"
import { useMemo } from "react"
import { z } from "zod"

interface PasswordValidatorProps extends React.ComponentProps<"div"> {
  value: string
  schema: z.ZodSchema
}

export function PasswordValidator({
  value,
  schema,
  className,
  ...props
}: PasswordValidatorProps) {
  const validationResults = useMemo(() => {
    const emptyResult = schema.safeParse("")
    const allRules = emptyResult.success
      ? []
      : emptyResult.error.issues.map((issue, index) => ({
          key: `rule-${index}`,
          label: issue.message,
          path: issue.path,
          code: issue.code,
        }))

    return allRules.map((rule) => {
      let isValid = false
      try {
        // If value is empty, no rules should be valid
        if (!value) {
          isValid = false
        } else {
          const currentResult = schema.safeParse(value)
          if (currentResult.success) {
            isValid = true
          } else {
            isValid = !currentResult.error.issues.some(
              (issue) =>
                issue.message === rule.label && issue.code === rule.code
            )
          }
        }
      } catch {
        isValid = false
      }

      return {
        ...rule,
        isValid,
      }
    })
  }, [value, schema])

  return (
    <div className={cn("space-y-2 pt-2", className)} {...props}>
      <div className="flex gap-0.5">
        {Array.from({ length: validationResults.length }, (_, index) => {
          const validCount = validationResults.filter(
            (result) => result.isValid
          ).length
          return (
            <div
              key={index}
              className={cn(
                "h-1 flex-1 rounded-sm transition-colors duration-200",
                index < validCount ? "bg-primary" : "bg-muted"
              )}
            />
          )
        })}
      </div>
      <div className="flex flex-col gap-1">
        {validationResults.map(({ key, label, isValid }) => (
          <div key={key} className="flex items-center gap-2 py-0.5">
            {isValid ? (
              <Check size={16} className="text-primary" />
            ) : (
              <X size={16} className="text-muted-foreground" />
            )}
            <p
              className={cn("text-muted-foreground", isValid && "text-success")}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
