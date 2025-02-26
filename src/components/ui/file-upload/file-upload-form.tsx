import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { FormField } from "../form/form";
import { useZodSchema } from "../form/zod-schema-context";
import { FileUpload, FileUploadProps } from "./file-upload";

type JsonSchemaType = {
  isRequired: boolean;
  maxLength?: number | undefined;
  description?: string;
};

type JsonDescriptionType = {
  accept?: string;
  maxFiles?: number;
  maxFileSize?: number;
};

export interface FileUploadFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "render">,
    Omit<FileUploadProps, "name" | "value" | "onFileChange" | "defaultValue"> {}

const FileUploadForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  name,
  control,
  defaultValue,
  ...props
}: FileUploadFormProps<TFieldValues, TName>) => {
  const { getJsonSchema } = useZodSchema();
  const { isRequired, description }: JsonSchemaType = getJsonSchema(name);
  const jsonDescription: JsonDescriptionType = JSON.parse(description || "{}");
  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue as TFieldValues[TName]}
      render={({ field: { value, onChange, ref } }) => {
        const handleFileChange = (files: FileList) => {
          onChange(Array.from(files));
        };

        return (
          <FileUpload
            maxFileSize={jsonDescription.maxFileSize}
            maxFiles={jsonDescription.maxFiles}
            accept={jsonDescription.accept?.split(",")}
            {...props}
            ref={ref}
            value={value || []}
            onFileChange={handleFileChange}
            formComposition={{
              requiredSymbol: isRequired,
              ...props.formComposition,
            }}
          />
        );
      }}
    />
  );
};

FileUploadForm.displayName = "FileUploadForm";

export { FileUploadForm };
