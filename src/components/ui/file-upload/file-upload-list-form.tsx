"use client"

import { ZodFileMeta } from "@/lib/zod"
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormField } from "../form/form"
import { useZodSchema } from "../form/zod-schema-context"
import { FileUploadList, FileUploadListProps } from "./file-upload-list"

export interface FileUploadListFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    Omit<ControllerProps<TFieldValues, TName>, "render">,
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
  const { isRequired, meta } = getSchemaFromPath(name)
  const metadata = meta() as ZodFileMeta | undefined
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
            maxFileSize={metadata?.maxFileSize}
            maxFiles={metadata?.maxFiles}
            accept={metadata?.accepted}
            {...props}
            ref={ref}
            value={value || []}
            onFileChange={handleFileChange}
            formComposition={{
              requiredSymbol: isRequired,
              ...props.formComposition,
            }}
          />
        )
      }}
    />
  )
}

export { FileUploadListForm }
