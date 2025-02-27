"use client";

import { useToast } from "@/hooks/use-toast";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/const";
import { formatFileSize } from "@/lib/file-size";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "../badge/badge";
import { Button } from "../button";
import {
  FormComposition,
  FormCompositionProps,
  FormControl,
} from "../form/form";

type TAccept = string;

export interface FileUploadProps
  extends Omit<
    React.ComponentProps<"input">,
    "value" | "accept" | "defaultValue"
  > {
  onFileChange?: (files: FileList) => void;
  maxFiles?: number;
  display?: "image" | "chip";
  accept?: TAccept[];
  buttonLabel?: string;
  maxFileSize?: number;
  disabled?: boolean;
  value?: File[];
  defaultValue?: File[];
  formComposition?: FormCompositionProps;
}

interface FileWithMeta {
  id: string;
  file: File;
}

const MAX_FILE_SIZE = 500000; // 500KB

const generateFileId = (file: File) => {
  return `${file.name}-${file.size}-${file.lastModified}`;
};

const truncateFileName = (fileName: string, maxLength = 20) => {
  if (fileName.length <= maxLength) return fileName;
  const extension = fileName.split(".").pop() || "";
  const baseName = fileName.slice(0, fileName.lastIndexOf("."));
  return `${baseName.slice(
    0,
    maxLength - extension.length - 3
  )}...${extension}`;
};

function FileUpload({
  buttonLabel = "Tải file",
  onFileChange,
  maxFiles = 5,
  display = "chip",
  accept = ACCEPTED_IMAGE_TYPES,
  maxFileSize = MAX_FILE_SIZE,
  formComposition,
  disabled,
  value,
  defaultValue,
  ...props
}: FileUploadProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const isControlled = value !== undefined;
  const isMultipleAllowed = maxFiles > 1;

  const [internalFiles, setInternalFiles] = useState<FileWithMeta[]>(() => {
    const initial = (value || defaultValue || []).map((file) => ({
      id: generateFileId(file),
      file,
    }));
    return initial;
  });

  const previewUrls = useMemo(() => {
    return internalFiles.reduce(
      (acc, file) => {
        let previewUrl;
        if (file.file && file.file.size > 0) {
          previewUrl = URL.createObjectURL(file.file);
        } else {
          previewUrl = file.file.name;
        }
        acc[file.id] = previewUrl;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [internalFiles]);

  useEffect(() => {
    if (isControlled) {
      const newFiles = (value || []).map((file) => ({
        id: generateFileId(file),
        file,
      }));
      setInternalFiles(newFiles);
    }
  }, [value, isControlled]);

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(URL.revokeObjectURL);
    };
  }, [previewUrls]);

  const syncInput = useCallback(
    (files: File[]) => {
      if (!inputRef.current) return;
      const dt = new DataTransfer();
      files.forEach((file) => dt.items.add(file));
      inputRef.current.files = dt.files;
      onFileChange?.(dt.files);
    },
    [onFileChange]
  );

  const validateFile = useCallback(
    (file: File) => {
      const errors = [];
      if (!accept.includes(file.type)) {
        errors.push(`File ${file.name} không đúng định dạng cho phép`);
      }
      if (file.size > maxFileSize) {
        errors.push(
          `File ${file.name} vượt quá kích thước tối đa (${formatFileSize(
            maxFileSize
          )}kb)`
        );
      }
      return errors;
    },
    [accept, maxFileSize]
  );

  const handleFiles = useCallback(
    (newFiles: FileList) => {
      let filesArray = Array.from(newFiles);

      if (!isMultipleAllowed && filesArray.length > 1) {
        filesArray = filesArray.slice(0, 1); // Take only the first file if multiple not allowed
      }
      const validFiles: File[] = [];
      const errors: string[] = [];
      const duplicates: string[] = [];

      // Get current files list
      const currentFiles = isControlled
        ? value || []
        : internalFiles.map((f) => f.file);

      filesArray.forEach((file) => {
        // Check for duplicates
        const isDuplicate = currentFiles.some(
          (existingFile) =>
            existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified
        );

        if (isDuplicate) {
          duplicates.push(file.name);
          return;
        }

        // Validate other criteria
        const fileErrors = validateFile(file);
        if (fileErrors.length > 0) {
          errors.push(...fileErrors);
        } else {
          validFiles.push(file);
        }
      });

      // Show duplicate error
      if (duplicates.length > 0) {
        toast({
          variant: "destructive",
          title: "File trùng lặp",
          description: (
            <ul className="text-xs list-disc list-inside">
              {duplicates.map((name, index) => (
                <li key={index}>Đã tồn tại file: {name}</li>
              ))}
            </ul>
          ),
        });
      }

      // Show validation errors
      if (errors.length > 0) {
        toast({
          variant: "destructive",
          title: "Không thể tải lên một số file",
          description: (
            <ul className="text-xs list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          ),
        });
      }

      // Process valid files
      if (validFiles.length > 0) {
        let updatedFiles: File[];
        if (maxFiles === 1) {
          updatedFiles = validFiles;
        } else {
          updatedFiles = [...currentFiles, ...validFiles].slice(0, maxFiles);
        }

        const newFilesWithMeta = updatedFiles.map((file) => ({
          id: generateFileId(file),
          file,
        }));

        if (isControlled) {
          syncInput(updatedFiles);
        } else {
          setInternalFiles(newFilesWithMeta);
          syncInput(updatedFiles);
        }
      }
    },
    [
      validateFile,
      maxFiles,
      isControlled,
      value,
      internalFiles,
      syncInput,
      toast,
      isMultipleAllowed,
    ]
  );

  const removeFile = useCallback(
    (id: string) => {
      const updatedFiles = internalFiles.filter((f) => f.id !== id);
      if (isControlled) {
        syncInput(updatedFiles.map((f) => f.file));
      } else {
        setInternalFiles(updatedFiles);
        syncInput(updatedFiles.map((f) => f.file));
      }
    },
    [internalFiles, isControlled, syncInput]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
      setIsDragOver(false);
    },
    [handleFiles]
  );

  return (
    <FormComposition
      data-slot="file-upload"
      {...formComposition}
      className="p-0 border-0 flex-col !ring-0 !shadow-none"
      isMinHeight
      description={null}
    >
      <div className="space-y-2">
        <div
          className="flex"
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <FormControl>
            <input
              {...props}
              ref={inputRef}
              type="file"
              hidden
              multiple={isMultipleAllowed}
              accept={accept.join(",")}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              disabled={disabled}
            />
          </FormControl>

          <Button
            type="button"
            variant="secondary"
            iconLeft={<Upload />}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "transition-all",
              isDragOver && "ring-2 ring-primary ring-offset-2"
            )}
            disabled={disabled}
          >
            {buttonLabel}
          </Button>
        </div>

        {internalFiles.length > 0 && (
          <div
            className={cn(
              "mt-4",
              display === "image"
                ? "grid grid-cols-2 md:grid-cols-4 gap-4"
                : "flex flex-wrap gap-2"
            )}
          >
            {internalFiles.map((fileMeta) =>
              display === "image" ? (
                <div key={fileMeta.id} className="relative group">
                  <div className="aspect-square">
                    <img
                      src={previewUrls[fileMeta.id]}
                      alt={fileMeta.file.name}
                      className="object-cover w-full h-full border rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <Button
                    size="xs"
                    variant="outline"
                    iconOnly
                    className="absolute -top-2 -right-2"
                    onClick={() => removeFile(fileMeta.id)}
                    iconLeft={<X />}
                  />
                </div>
              ) : (
                <Badge
                  key={fileMeta.id}
                  variant="secondary"
                  clearBtn
                  onClearBtnClick={() => removeFile(fileMeta.id)}
                  className="max-w-[200px] truncate"
                  tooltip={fileMeta.file.name}
                >
                  {truncateFileName(fileMeta.file.name)}
                </Badge>
              )
            )}
          </div>
        )}
      </div>
    </FormComposition>
  );
}

export { FileUpload };
