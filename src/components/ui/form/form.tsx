"use client";

import { cn } from "@/lib/utils";
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
  "outline-none flex w-full rounded-md bg-transparent ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 cursor-text px-3 gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
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
        true: "focus-within:ring-1 focus-within:ring-ring",
        false: "focus-visible:ring-1 focus-visible:ring-ring",
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
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
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

type FormItemContextValue = {
  id: string;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();
  const contextValue = {
    id,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
  };

  return (
    <FormItemContext.Provider value={contextValue}>
      <div ref={ref} className={cn("form-item", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = React.useContext(FormItemContext);

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error } = useFormField();
  const { formMessageId } = React.useContext(FormItemContext);
  const body = error?.message || children;

  return body ? (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  ) : null;
});
FormMessage.displayName = "FormMessage";

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
  className?: string;
  isFocused?: boolean;
}

const FormWrapper = ({
  labelPosition = "vertical",
  children,
  isFocused,
}: FormWrapperProps) => {
  return (
    <FormContext.Provider value={{ labelPosition, isFocused }}>
      <div
        className={cn(
          "form-wrapper-class grid gap-y-1 text-sm items-start",
          labelPosition === "horizontal" && "md:grid-cols-12 gap-x-6",
          isFocused && "isFocused"
        )}
      >
        {children}
      </div>
    </FormContext.Provider>
  );
};

const FormLabelWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const { labelPosition, size } = React.useContext(FormContext);

  return (
    <div
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
};

FormLabelWrapper.displayName = "FormLabelWrapper";

export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  demo?: string;
  requiredSymbol?: boolean;
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ children, className, requiredSymbol, ...props }, ref) => {
    const { error } = useFormField();
    const { formItemId } = React.useContext(FormItemContext);

    return (
      <label
        ref={ref}
        htmlFor={formItemId}
        {...props}
        className={cn("text-sm", error && "text-destructive", className)}
      >
        {requiredSymbol ? (
          <div className="flex">
            <div className="w-2 text-center text-destructive">*</div>
            {children}
          </div>
        ) : (
          children
        )}
      </label>
    );
  }
);
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error } = useFormField();
  const { formItemId, formDescriptionId, formMessageId } =
    React.useContext(FormItemContext);

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});

FormControl.displayName = "FormControl";

const FormControlButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ ...props }, ref) => {
  const { error } = useFormField();
  const { formItemId, formDescriptionId, formMessageId } =
    React.useContext(FormItemContext);

  return (
    <button
      ref={ref}
      type={"button"}
      {...props}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
    />
  );
});

FormControlButton.displayName = "FormControlButton";

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
}

const FormComposition = React.forwardRef<HTMLDivElement, FormCompositionProps>(
  (
    {
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
      ...props
    },
    ref
  ) => {
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
                  <FormDescription className="flex-1 mt-1">
                    {description}
                  </FormDescription>
                )}
                {showErrorMsg && <FormMessage className="mt-1" />}
              </div>

              {subDescription && (
                <div className="text-[0.8rem] text-muted-foreground ml-auto mt-1">
                  {subDescription}
                </div>
              )}
            </div>
          </div>
        </FormWrapper>
      </FormItem>
    );
  }
);
FormComposition.displayName = "FormComposition";

const FormSuffixOutside = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn("flex-shrink-0", className)}
    >
      {children}
    </div>
  );
};

const FormPrefixOutside = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn("flex-shrink-0", className)}
    >
      {children}
    </div>
  );
};

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
