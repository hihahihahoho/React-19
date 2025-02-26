import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { FormField } from "../form/form";
import { useZodSchema } from "../form/zod-schema-context";
import { Select, SelectProps } from "./select";

export interface SelectFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends ControllerProps<TFieldValues, TName>,
    Omit<SelectProps, "defaultValue" | "name" | "value"> {}

const SelectForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  name,
  control,
  ...props
}: Omit<SelectFormProps<TFieldValues, TName>, "render">) => {
  const { getJsonSchema } = useZodSchema();
  const { isRequired } = getJsonSchema(name);
  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field } }) => {
        const handleClear = () => {
          onChange("");
          props.formComposition?.onClear?.();
        };

        return (
          <Select
            {...field}
            value={value === undefined ? "" : value || ""}
            {...props}
            onValueChange={onChange}
            formComposition={{
              onClear: handleClear,
              requiredSymbol: isRequired,
              ...props.formComposition,
            }}
          />
        );
      }}
    />
  );
};

SelectForm.displayName = "SelectForm";

export { SelectForm };
