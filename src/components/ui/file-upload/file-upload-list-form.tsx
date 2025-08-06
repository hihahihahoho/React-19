import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import { FileUploadList, FileUploadListProps } from "./file-upload-list"

type JsonDescriptionType = {
  accepted?: string[]
  maxFiles?: number
  maxFileSize?: number
}

export interface FileUploadListFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render">,
    Omit<
      FileUploadListProps,
      "name" | "value" | "onFileChange" | "defaultValue"
    > {}

const FileUploadListForm = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  defaultValue,
  ...props
}: FileUploadListFormProps<TFieldValues, TName>) => {
  const { getSchemaFromPath } = useZodSchema()
  const { isOptional, _def } = getSchemaFromPath(name)
  const jsonDescription: JsonDescriptionType = JSON.parse(
    _def.description || "{}"
  )
  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue as TFieldValues[TName]}
      render={({ field: { value, onChange, ref } }) => {
        const handleFileChange = (files: FileList) => {
          onChange(Array.from(files))
        }

        return (
          <FileUploadList
            maxFileSize={jsonDescription.maxFileSize}
            maxFiles={jsonDescription.maxFiles}
            accept={jsonDescription.accepted}
            {...props}
            ref={ref}
            value={value || []}
            onFileChange={handleFileChange}
            formComposition={{
              requiredSymbol: !isOptional(),
              ...props.formComposition,
            }}
          />
        )
      }}
    />
  )
}

FileUploadListForm.displayName = "FileUploadListForm"

export { FileUploadListForm }
