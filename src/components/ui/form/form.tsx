"use client"

import { cn } from "@/lib/utils"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { cva, VariantProps } from "class-variance-authority"
import * as React from "react"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"
import { buttonVariants } from "../button"
import { CloseCircle } from "../custom-icons"
import { Label } from "../label"

const Form = FormProvider
const compositionClass = " items-center relative flex-shrink-0 flex"

// Define your variants as before
const inputSizeVariants = cva("", {
  variants: {
    size: {
      sm: "[&_.form-icon_svg]:size-4",
      default: "[&_.form-icon_svg]:size-4",
      lg: "[&_.form-icon_svg]:size-5",
    },
    isMinHeight: {
      true: "",
      false: "",
    },
    isMinHeightNormal: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    size: "default",
  },
  compoundVariants: [
    {
      isMinHeight: false,
      size: "sm",
      className: "h-8",
    },
    {
      isMinHeight: false,
      size: "default",
      className: "h-9",
    },
    {
      isMinHeight: false,
      size: "lg",
      className: "h-10",
    },
    {
      isMinHeightNormal: true,
      size: "sm",
      className: "min-h-8",
    },
    {
      isMinHeightNormal: true,
      size: "default",
      className: "min-h-9",
    },
    {
      isMinHeightNormal: true,
      size: "lg",
      className: "min-h-10",
    },
    {
      isMinHeight: true,
      size: "sm",
      className: "min-h-[30px]",
    },
    {
      isMinHeight: true,
      size: "default",
      className: "min-h-[34px]",
    },
    {
      isMinHeight: true,
      size: "lg",
      className: "min-h-[38px]",
    },
  ],
})

const inputContainerVariants = cva(
  "flex w-full cursor-text gap-2 rounded-lg bg-transparent px-3 outline-none ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border border-input shadow-sm dark:bg-neutral-900",
        white: "bg-background",
        ghost:
          "rounded-none !border-0 bg-transparent !shadow-none !ring-0 !ring-offset-0",
        empty:
          "!block rounded-none !border-0 bg-transparent p-0 !shadow-none !ring-0 !ring-offset-0",
        inline: "h-full border-none bg-transparent px-0 shadow-none",
      },
      focusWithin: {
        true: "transition-shadow focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20",
        false:
          "transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
      },
    },
    defaultVariants: {
      focusWithin: true,
      variant: "default",
    },
  }
)
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const { getFieldState, formState } = useFormContext() || {
    getFieldState: () => ({}),
  }

  const fieldState = getFieldState(fieldContext.name, formState)

  return {
    name: fieldContext.name,
    ...fieldState,
  }
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()
  const contextValue = {
    id,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
  }

  return (
    <FormItemContext.Provider value={contextValue}>
      <div
        data-slot="form-item"
        className={cn("form-item", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

type FormItemContextValue = {
  id: string
  formItemId: string
  formDescriptionId: string
  formMessageId: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = React.useContext(FormItemContext)

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { error } = useFormField()
  const { formMessageId } = React.useContext(FormItemContext)
  const body = error?.message || children

  return body ? (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  ) : null
}

export const FormContext = React.createContext<{
  labelPosition: "vertical" | "horizontal"
  isFocused?: boolean
  size?: VariantProps<typeof inputSizeVariants>["size"]
}>({
  labelPosition: "vertical",
  isFocused: false,
})

export interface FormWrapperProps {
  labelPosition?: "vertical" | "horizontal"
  children?: React.ReactNode
  isFocused?: boolean
}

function FormWrapper({
  labelPosition = "vertical",
  children,
  isFocused,
  className,
  ...props
}: FormWrapperProps & React.ComponentProps<"div">) {
  return (
    <FormContext.Provider value={{ labelPosition, isFocused }}>
      <div
        data-slot="form-wrapper"
        className={cn(
          "form-wrapper-class grid items-start gap-y-1.5 text-sm",
          labelPosition === "horizontal" && "gap-x-6 md:grid-cols-12",
          isFocused && "isFocused",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </FormContext.Provider>
  )
}

function FormLabelWrapper({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { labelPosition, size } = React.useContext(FormContext)

  return (
    <div
      data-slot="form-label-wrapper"
      className={cn(
        "label-class flex items-center",
        labelPosition === "horizontal" &&
          inputSizeVariants({ size, isMinHeightNormal: true }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface FormLabelProps
  extends React.ComponentProps<typeof LabelPrimitive.Root> {
  requiredSymbol?: boolean
}

function FormLabel({
  children,
  className,
  requiredSymbol,
  ...props
}: FormLabelProps) {
  const { error } = useFormField()
  const { formItemId } = React.useContext(FormItemContext)

  return (
    <Label
      data-slot="form-label"
      htmlFor={formItemId}
      className={cn("text-sm", error && "text-destructive", className)}
      {...props}
    >
      {children}{" "}
      {requiredSymbol && (
        <span className="w-2 text-center text-destructive">*</span>
      )}
    </Label>
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error } = useFormField()
  const { formItemId, formDescriptionId, formMessageId } =
    React.useContext(FormItemContext)

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormControlButton({ ...props }: React.ComponentProps<"button">) {
  const { error } = useFormField()
  const { formItemId, formDescriptionId, formMessageId } =
    React.useContext(FormItemContext)

  return (
    <button
      data-slot="form-control-button"
      type="button"
      {...props}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
    />
  )
}

export interface FormCompositionProps
  extends VariantProps<typeof inputContainerVariants>,
    VariantProps<typeof inputSizeVariants>,
    FormWrapperProps {
  className?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  iconLeft?: string | React.ReactNode
  iconRight?: string | React.ReactNode
  prefixNotFocusInput?: React.ReactNode
  suffixNotFocusInput?: React.ReactNode
  isFocused?: boolean
  hasValue?: boolean
  inputClear?: boolean
  isMinHeight?: boolean
  onClear?: () => void
  onClick?: (e: React.MouseEvent) => void
  onFormCompositionClick?: () => void
  children?: React.ReactNode
  clearWhenNotFocus?: boolean
  suffixOutside?: React.ReactNode
  prefixOutside?: React.ReactNode
  disabled?: boolean
  asChild?: boolean
  showErrorMsg?: boolean
  description?: React.ReactNode
  label?: React.ReactNode
  readonly?: boolean
  styleButton?: boolean
  subDescription?: React.ReactNode
  requiredSymbol?: boolean
  layout?: {
    leftColClass: string
    rightColClass: string
  }
  ref?: React.RefObject<HTMLDivElement | null>
  customError?: React.ReactNode
}

function FormComposition({
  isMinHeight = false,
  className,
  prefix,
  suffix,
  iconLeft,
  iconRight,
  prefixNotFocusInput,
  suffixNotFocusInput,
  size,
  variant,
  hasValue,
  inputClear = true,
  onClear,
  onFormCompositionClick,
  onClick,
  children,
  clearWhenNotFocus = false,
  suffixOutside,
  prefixOutside,
  disabled,
  asChild = false,
  showErrorMsg = true,
  description,
  label,
  labelPosition,
  isFocused,
  focusWithin,
  readonly,
  styleButton,
  layout,
  subDescription,
  requiredSymbol,
  ref,
  customError,
  ...props
}: FormCompositionProps) {
  const defaultLayout = {
    leftColClass: "md:col-span-4 -md:min-h-0",
    rightColClass: "md:col-span-8",
  }
  const newLayout = { ...defaultLayout, ...layout }
  const Comp = asChild ? Slot : "div"

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return
    onClick?.(e)
    onFormCompositionClick?.()
  }

  return (
    <FormItem>
      <FormWrapper labelPosition={labelPosition}>
        {label && (
          <FormLabelWrapper
            className={cn(
              labelPosition === "horizontal" && newLayout.leftColClass
            )}
          >
            <FormLabel requiredSymbol={requiredSymbol}>{label}</FormLabel>
          </FormLabelWrapper>
        )}
        <div
          className={cn(
            "grid min-w-0 max-w-full",
            labelPosition === "horizontal" && newLayout.rightColClass
          )}
        >
          <div className="flex flex-1 gap-2 -md:text-base">
            {prefixOutside && (
              <FormPrefixOutside>{prefixOutside}</FormPrefixOutside>
            )}
            <Comp
              className={cn(
                styleButton
                  ? buttonVariants({ variant: "outline" })
                  : inputContainerVariants({ variant, focusWithin }),
                styleButton && "py-0",
                inputSizeVariants({ size, isMinHeight }),
                !styleButton && "flex flex-1",
                "items-start text-left",
                disabled && "cursor-not-allowed opacity-50",
                className
              )}
              onClick={handleClick}
              ref={ref}
              {...props}
            >
              {iconLeft && (
                <span
                  className={cn(
                    compositionClass,
                    inputSizeVariants({ size, isMinHeight: true }),
                    "form-icon -ml-[2px]"
                  )}
                >
                  {iconLeft}
                </span>
              )}
              {prefix && (
                <span
                  className={cn(
                    "prefix-class",
                    compositionClass,
                    inputSizeVariants({ size, isMinHeight: true })
                  )}
                  onClick={handleClick}
                >
                  {prefix}
                </span>
              )}
              {prefixNotFocusInput && (
                <div
                  className={cn(
                    compositionClass,
                    inputSizeVariants({ size, isMinHeight: true })
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  {prefixNotFocusInput}
                </div>
              )}
              <Slottable>{children}</Slottable>
              {(isFocused || clearWhenNotFocus) &&
                hasValue &&
                inputClear &&
                !readonly &&
                !disabled && (
                  <div
                    title="Clear"
                    tabIndex={-1}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      onClear?.()
                    }}
                    className={cn(
                      compositionClass,
                      "-mr-1 cursor-pointer opacity-70 focus:outline-none",
                      inputSizeVariants({ size, isMinHeight: true })
                    )}
                  >
                    <CloseCircle />
                  </div>
                )}
              {suffixNotFocusInput && (
                <div
                  className={cn(
                    compositionClass,
                    inputSizeVariants({ size, isMinHeight: true })
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  {suffixNotFocusInput}
                </div>
              )}
              {suffix && (
                <span
                  className={cn(
                    "suffix-class",
                    compositionClass,
                    inputSizeVariants({ size, isMinHeight: true })
                  )}
                  onClick={handleClick}
                >
                  {suffix}
                </span>
              )}
              {iconRight && (
                <span
                  className={cn(
                    compositionClass,
                    inputSizeVariants({ size, isMinHeight: true }),
                    "form-icon -mr-[2px]"
                  )}
                >
                  {iconRight}
                </span>
              )}
            </Comp>
            {suffixOutside && (
              <FormSuffixOutside>{suffixOutside}</FormSuffixOutside>
            )}
          </div>
          <div className="flex gap-2">
            <div className="space-y-1">
              {description && (
                <FormDescription className="mt-1.5 flex-1">
                  {description}
                </FormDescription>
              )}
              {showErrorMsg && !customError && (
                <FormMessage className="mt-1.5" />
              )}
              {customError && <p className="text-destructive">{customError}</p>}
            </div>

            {subDescription && (
              <div className="ml-auto mt-1.5 text-[0.8rem] text-muted-foreground">
                {subDescription}
              </div>
            )}
          </div>
        </div>
      </FormWrapper>
    </FormItem>
  )
}

function FormSuffixOutside({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-suffix-outside"
      onClick={(e) => e.stopPropagation()}
      className={cn("flex-shrink-0", className)}
      {...props}
    >
      {children}
    </div>
  )
}
function FormPrefixOutside({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-prefix-outside"
      onClick={(e) => e.stopPropagation()}
      className={cn("flex-shrink-0", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  Form,
  FormComposition,
  FormControl,
  FormControlButton,
  FormDescription,
  FormField,
  FormFieldContext,
  FormItem,
  FormItemContext,
  FormLabel,
  FormMessage,
  FormPrefixOutside,
  FormSuffixOutside,
  FormWrapper,
}
