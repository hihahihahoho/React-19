"use client";

import { cn } from "@/lib/utils";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { buttonVariants } from "../button";
import { Label } from "../label";

const Form = FormProvider;
const compositionClass = " items-center relative flex-shrink-0 flex";

// Define your variants as before
const inputSizeVariants = cva("", {
  variants: {
    size: {
      sm: "",
      default: "",
      lg: "",
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
});

const inputContainerVariants = cva(
  "outline-none flex w-full rounded-lg bg-transparent ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 cursor-text px-3 gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border border-input shadow-sm",
        white: "bg-background",
        ghost:
          "!border-0 !ring-offset-0 !ring-0 !shadow-none rounded-none bg-transparent",
        empty:
          "!border-0 !ring-offset-0 !ring-0 !shadow-none rounded-none bg-transparent p-0 !block",
      },
      focusWithin: {
        true: "focus-within:ring-[3px] focus-within:ring-ring/20 transition-shadow focus-within:border-ring",
        false:
          "focus-visible:ring-[3px] focus-visible:ring-ring/20 transition-shadow focus-visible:border-ring",
      },
    },
    defaultVariants: {
      focusWithin: true,
      variant: "default",
    },
  }
);
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

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
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext() || {
    getFieldState: () => ({}),
  };

  const fieldState = getFieldState(fieldContext.name, formState);

  return {
    name: fieldContext.name,
    ...fieldState,
  };
};

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();
  const contextValue = {
    id,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
  };

  return (
    <FormItemContext.Provider value={contextValue}>
      <div
        data-slot="form-item"
        className={cn("form-item", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

type FormItemContextValue = {
  id: string;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = React.useContext(FormItemContext);

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { error } = useFormField();
  const { formMessageId } = React.useContext(FormItemContext);
  const body = error?.message || children;

  return body ? (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  ) : null;
}

export const FormContext = React.createContext<{
  labelPosition: "vertical" | "horizontal";
  isFocused?: boolean;
  size?: VariantProps<typeof inputSizeVariants>["size"];
}>({
  labelPosition: "vertical",
  isFocused: false,
});

export interface FormWrapperProps {
  labelPosition?: "vertical" | "horizontal";
  children?: React.ReactNode;
  isFocused?: boolean;
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
          "form-wrapper-class grid gap-y-1.5 text-sm items-start",
          labelPosition === "horizontal" && "md:grid-cols-12 gap-x-6",
          isFocused && "isFocused",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </FormContext.Provider>
  );
}

function FormLabelWrapper({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { labelPosition, size } = React.useContext(FormContext);

  return (
    <div
      data-slot="form-label-wrapper"
      className={cn(
        "flex items-center label-class",
        labelPosition === "horizontal" &&
          inputSizeVariants({ size, isMinHeightNormal: true }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface FormLabelProps
  extends React.ComponentProps<typeof LabelPrimitive.Root> {
  requiredSymbol?: boolean;
}

function FormLabel({
  children,
  className,
  requiredSymbol,
  ...props
}: FormLabelProps) {
  const { error } = useFormField();
  const { formItemId } = React.useContext(FormItemContext);

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
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error } = useFormField();
  const { formItemId, formDescriptionId, formMessageId } =
    React.useContext(FormItemContext);

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
  );
}

function FormControlButton({ ...props }: React.ComponentProps<"button">) {
  const { error } = useFormField();
  const { formItemId, formDescriptionId, formMessageId } =
    React.useContext(FormItemContext);

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
  );
}

export interface FormCompositionProps
  extends VariantProps<typeof inputContainerVariants>,
    VariantProps<typeof inputSizeVariants>,
    FormWrapperProps {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  iconLeft?: string | React.ReactNode;
  iconRight?: string | React.ReactNode;
  prefixNotFocusInput?: {
    order?: number;
    element: React.ReactNode;
  };
  suffixNotFocusInput?: {
    order?: number;
    element: React.ReactNode;
  };
  isFocused?: boolean;
  hasValue?: boolean;
  inputClear?: boolean;
  isMinHeight?: boolean;
  onClear?: () => void;
  onClick?: (e: React.MouseEvent) => void;
  onFormCompositionClick?: () => void;
  children?: React.ReactNode;
  clearWhenNotFocus?: boolean;
  suffixOutside?: React.ReactNode;
  prefixOutside?: React.ReactNode;
  disabled?: boolean;
  asChild?: boolean;
  showErrorMsg?: boolean;
  description?: React.ReactNode;
  label?: React.ReactNode;
  readonly?: boolean;
  styleButton?: boolean;
  subDescription?: React.ReactNode;
  requiredSymbol?: boolean;
  layout?: {
    leftColClass: string;
    rightColClass: string;
  };
  ref?: React.RefObject<HTMLDivElement>;
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
  ...props
}: FormCompositionProps) {
  const defaultLayout = {
    leftColClass: "md:col-span-4 -md:min-h-0",
    rightColClass: "md:col-span-8",
  };
  const newLayout = { ...defaultLayout, ...layout };
  const Comp = asChild ? Slot : "div";

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    onClick?.(e);
    onFormCompositionClick?.();
  };

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
            "max-w-full min-w-0 grid",
            labelPosition === "horizontal" && newLayout.rightColClass
          )}
        >
          <div className="flex flex-1 gap-1 -md:text-base">
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
                    "-ml-[2px]"
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
                  {prefixNotFocusInput.element}
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
                      e.preventDefault();
                      onClear?.();
                    }}
                    className={cn(
                      compositionClass,
                      "opacity-70 cursor-pointer focus:outline-none -mr-1",
                      inputSizeVariants({ size, isMinHeight: true })
                    )}
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      height="1em"
                      role="presentation"
                      viewBox="0 0 24 24"
                      width="1em"
                      className="!size-[18px]"
                    >
                      <path
                        d="M12 2a10 10 0 1010 10A10.016 10.016 0 0012 2zm3.36 12.3a.754.754 0 010 1.06.748.748 0 01-1.06 0l-2.3-2.3-2.3 2.3a.748.748 0 01-1.06 0 .754.754 0 010-1.06l2.3-2.3-2.3-2.3A.75.75 0 019.7 8.64l2.3 2.3 2.3-2.3a.75.75 0 011.06 1.06l-2.3 2.3z"
                        fill="currentColor"
                      ></path>
                    </svg>
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
                  {suffixNotFocusInput.element}
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
                    "-mr-[2px]"
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
                <FormDescription className="flex-1 mt-1.5">
                  {description}
                </FormDescription>
              )}
              {showErrorMsg && <FormMessage className="mt-1.5" />}
            </div>

            {subDescription && (
              <div className="text-[0.8rem] text-muted-foreground ml-auto mt-1.5">
                {subDescription}
              </div>
            )}
          </div>
        </div>
      </FormWrapper>
    </FormItem>
  );
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
  );
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
  );
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
};
