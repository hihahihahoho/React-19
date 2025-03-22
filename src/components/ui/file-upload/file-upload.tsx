"use client"

import { ACCEPTED_IMAGE_TYPES } from "@/lib/const"
import { formatFileSize } from "@/lib/file-size"
import { cn } from "@/lib/utils"
import {
  AlignLeft,
  CloudUpload,
  Eye,
  Image,
  Music,
  Play,
  SquareArrowOutUpRight,
  X,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "../button"
import { CloseCircle } from "../custom-icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../dialog"
import {
  FormComposition,
  FormCompositionProps,
  FormControl,
} from "../form/form"
import { GlassIcon } from "../glass-icon"
import { sonnerToast } from "../sonner"

type TAccept = string

const fileIcon = {
  image: (
    <GlassIcon color="blue" variant="card">
      <Image />
    </GlassIcon>
  ),
  audio: (
    <GlassIcon color="blue" variant="card">
      <Music />
    </GlassIcon>
  ),
  video: (
    <GlassIcon color="red" variant="card">
      <Play />
    </GlassIcon>
  ),
  other: (
    <GlassIcon color="red" variant="card">
      <AlignLeft />
    </GlassIcon>
  ),
}

export interface FileUploadProps
  extends Omit<
    React.ComponentProps<"input">,
    "value" | "accept" | "defaultValue"
  > {
  onFileChange?: (files: FileList) => void
  maxFiles?: number
  display?: "grid" | "list"
  accept?: TAccept[]
  buttonLabel?: string
  maxFileSize?: number
  disabled?: boolean
  value?: File[]
  defaultValue?: File[]
  formComposition?: FormCompositionProps
}

interface FileWithMeta {
  id: string
  file: File
}

const MAX_FILE_SIZE = 500000 // 500

const generateFileId = (file: File) => {
  return `${file.name}-${file.size}-${file.lastModified}`
}

const isRemoteFile = (file: File): boolean => {
  return file.name.startsWith("REMOTE_FILE::")
}
function FileUpload({
  onFileChange,
  maxFiles = 5,
  display = "grid",
  accept = ACCEPTED_IMAGE_TYPES,
  maxFileSize = MAX_FILE_SIZE,
  formComposition,
  disabled,
  value,
  defaultValue,
  ...props
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const isControlled = value !== undefined
  const isMultipleAllowed = maxFiles > 1
  const acceptString = accept.map((type) => `${type.split("/")[1]}`).join(",")

  const [internalFiles, setInternalFiles] = useState<FileWithMeta[]>(() => {
    const initial = (value || defaultValue || []).map((file) => ({
      id: generateFileId(file),
      file,
    }))
    return initial
  })

  // Replace the existing isRemoteFile and getRemoteUrl functions with these:

  const getRemoteUrl = useCallback((file: File): string | null => {
    if (!isRemoteFile(file)) return null
    // Extract URL from filename (removes the prefix)
    return file.name.replace("REMOTE_FILE::", "")
  }, [])

  const previewUrls = useMemo(() => {
    return internalFiles.reduce(
      (acc, file) => {
        let previewUrl = null

        // Check if it's a remote file

        if (isRemoteFile(file.file)) {
          previewUrl = getRemoteUrl(file.file)
        } else if (file.file.type.startsWith("image/")) {
          previewUrl = URL.createObjectURL(file.file)
        }

        acc[file.id] = previewUrl
        return acc
      },
      {} as Record<string, string | null>
    )
  }, [internalFiles, getRemoteUrl])

  useEffect(() => {
    if (isControlled) {
      const newFiles = (value || []).map((file) => ({
        id: generateFileId(file),
        file,
      }))
      setInternalFiles(newFiles)
    }
  }, [value, isControlled])

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<{
    url: string
    type: string
    name: string
  } | null>(null)

  // Add a function to open the preview
  const handlePreviewFile = useCallback(
    (fileMeta: FileWithMeta) => {
      let previewUrl: string | null = null
      let fileType: string = ""
      let fileName: string = ""

      if (isRemoteFile(fileMeta.file)) {
        previewUrl = getRemoteUrl(fileMeta.file)
        fileType = fileMeta.file.type
        fileName = previewUrl?.split("/").pop() || "File"
      } else {
        previewUrl = URL.createObjectURL(fileMeta.file)
        fileType = fileMeta.file.type
        fileName = fileMeta.file.name
      }

      if (previewUrl) {
        setPreviewFile({
          url: previewUrl,
          type: fileType,
          name: fileName,
        })
        setPreviewOpen(true)
      }
    },
    [getRemoteUrl]
  )

  // Add cleanup for preview URLs
  useEffect(() => {
    return () => {
      if (previewFile && !previewFile.url.startsWith("http")) {
        URL.revokeObjectURL(previewFile.url)
      }
    }
  }, [previewFile])

  useEffect(() => {
    return () => {
      Object.values(previewUrls)
        .filter((url): url is string => url !== null)
        .forEach(URL.revokeObjectURL)
    }
  }, [previewUrls])

  const syncInput = useCallback(
    (files: File[]) => {
      if (!inputRef.current) return
      const dt = new DataTransfer()
      files.forEach((file) => dt.items.add(file))
      inputRef.current.files = dt.files
      onFileChange?.(dt.files)
    },
    [onFileChange]
  )

  const validateFile = useCallback(
    (file: File) => {
      const errors = []
      if (!accept.includes(file.type)) {
        errors.push("sai định dạng")
      }
      if (file.size > maxFileSize) {
        errors.push(`quá dung lượng`)
      }
      return errors
    },
    [accept, maxFileSize]
  )

  const handleFiles = useCallback(
    (newFiles: FileList) => {
      let filesArray = Array.from(newFiles)

      if (!isMultipleAllowed && filesArray.length > 1) {
        filesArray = filesArray.slice(0, 1) // Take only the first file if multiple not allowed
      }
      const validFiles: File[] = []
      const errors: string[] = []
      const duplicates: string[] = []

      // Get current files list
      const currentFiles = isControlled
        ? value || []
        : internalFiles.map((f) => f.file)

      filesArray.forEach((file) => {
        // Check for duplicates
        const isDuplicate = currentFiles.some(
          (existingFile) =>
            existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified
        )

        if (isDuplicate) {
          duplicates.push(file.name)
          return
        }

        // Validate other criteria
        const fileErrors = validateFile(file)
        if (fileErrors.length > 0) {
          errors.push(...fileErrors)
        } else {
          validFiles.push(file)
        }
      })

      // Show duplicate error
      if (duplicates.length > 0) {
        sonnerToast({
          variant: "destructive",
          title: `${duplicates.length} tệp đã tồn tại`,
        })
      }

      // Show validation errors - Simplified error message
      if (errors.length > 0) {
        // Create a unique list of error types
        const uniqueErrors = Array.from(new Set(errors))
        sonnerToast({
          variant: "destructive",
          title: `${filesArray.length - validFiles.length} tệp ${uniqueErrors.join(", ")}`,
        })
      }

      // Process valid files
      if (validFiles.length > 0) {
        let updatedFiles: File[]
        if (maxFiles === 1) {
          updatedFiles = validFiles
        } else {
          updatedFiles = [...currentFiles, ...validFiles].slice(0, maxFiles)
        }

        const newFilesWithMeta = updatedFiles.map((file) => ({
          id: generateFileId(file),
          file,
        }))

        if (isControlled) {
          syncInput(updatedFiles)
        } else {
          setInternalFiles(newFilesWithMeta)
          syncInput(updatedFiles)
        }
      }

      // Clear the input field after processing
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    },
    [
      validateFile,
      maxFiles,
      isControlled,
      value,
      internalFiles,
      syncInput,
      isMultipleAllowed,
    ]
  )

  const removeFile = useCallback(
    (id: string) => {
      const updatedFiles = internalFiles.filter((f) => f.id !== id)
      if (isControlled) {
        syncInput(updatedFiles.map((f) => f.file))
      } else {
        setInternalFiles(updatedFiles)
        syncInput(updatedFiles.map((f) => f.file))
      }
    },
    [internalFiles, isControlled, syncInput]
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(e.type === "dragover")
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      handleFiles(e.dataTransfer.files)
      setIsDragOver(false)
    },
    [handleFiles]
  )

  return (
    <FormComposition
      data-slot="file-upload"
      {...formComposition}
      className="flex-col border-0 p-0 !shadow-none !ring-0"
      variant="ghost"
      isMinHeight
    >
      <div
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() =>
          (internalFiles.length < maxFiles || maxFiles === 1) &&
          inputRef.current?.click()
        }
        className={cn(
          "min-h-[126px] w-full items-center justify-center rounded-xl border border-dashed p-3 transition-all",
          isDragOver && "ring-2 ring-primary ring-offset-2",
          (internalFiles.length < maxFiles || maxFiles === 1) &&
            "cursor-pointer"
        )}
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
        {internalFiles.length > 0 ? (
          display === "grid" ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {internalFiles.map((fileMeta) => (
                <div key={fileMeta.id} className="group relative">
                  <div
                    className="h-[100px] cursor-default"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {fileMeta.file.type.startsWith("image/") ? (
                      <img
                        src={previewUrls[fileMeta.id] || ""}
                        alt={fileMeta.file.name}
                        className="h-full w-full rounded-lg border object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-secondary px-3">
                        {fileMeta.file.type.startsWith("image/")
                          ? fileIcon.image
                          : fileMeta.file.type.startsWith("audio/")
                            ? fileIcon.audio
                            : fileMeta.file.type.startsWith("video/")
                              ? fileIcon.video
                              : fileIcon.other}
                        <div className="w-full space-y-[2px] text-center text-xs text-muted-foreground">
                          <div className="truncate">{fileMeta.file.name}</div>
                          <div className="">
                            {fileMeta.file.type.split("/")[1].toUpperCase()} -
                            {formatFileSize(fileMeta.file.size)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute right-1 top-1 flex gap-1">
                    <Button
                      size="xs"
                      variant="ghost"
                      isRounded
                      iconOnly
                      className="size-5 min-w-0 border-0 bg-black/60 text-white backdrop-blur"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePreviewFile(fileMeta)
                      }}
                      iconLeft={<Eye className="!size-3.5" />}
                    />
                    <Button
                      size="xs"
                      variant="ghost"
                      isRounded
                      iconOnly
                      className="size-5 min-w-0 border-0 bg-black/60 text-white backdrop-blur"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(fileMeta.id)
                      }}
                      iconLeft={<X />}
                    />
                  </div>
                </div>
              ))}
              {(internalFiles.length < maxFiles || maxFiles === 1) && (
                <div className="flex h-[100px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed">
                  <GlassIcon>
                    <CloudUpload />
                  </GlassIcon>
                  <div className="text-xs text-muted-foreground">
                    {maxFiles === 1 ? (
                      <>Chọn lại</>
                    ) : (
                      internalFiles.length + "/" + maxFiles
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              {(internalFiles.length < maxFiles || maxFiles === 1) && (
                <div className="flex min-h-6 items-center gap-2 text-xs text-muted-foreground">
                  <CloudUpload />
                  <div className="flex-1">
                    {maxFiles === 1 ? (
                      <>Chọn lại</>
                    ) : (
                      <>
                        <span className="text-primary">Tải lên</span> hoặc kéo
                        thả vào đây
                      </>
                    )}
                  </div>
                  {maxFiles !== 1 && internalFiles.length + "/" + maxFiles}
                </div>
              )}
              {internalFiles.map((fileMeta) => {
                const displayName = isRemoteFile(fileMeta.file)
                  ? getRemoteUrl(fileMeta.file)?.split("/").pop() ||
                    "remote-image"
                  : fileMeta.file.name
                return (
                  <div
                    key={fileMeta.id}
                    className="flex min-w-0 cursor-default items-center gap-3 rounded-lg bg-secondary p-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {fileMeta.file.type.startsWith("image/") ? (
                      <img
                        src={previewUrls[fileMeta.id] || ""}
                        alt={displayName}
                        className="size-12 rounded-lg border object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    ) : (
                      <div className="flex size-12 items-center justify-center">
                        {fileMeta.file.type.startsWith("image/")
                          ? fileIcon.image
                          : fileMeta.file.type.startsWith("audio/")
                            ? fileIcon.audio
                            : fileMeta.file.type.startsWith("video/")
                              ? fileIcon.video
                              : fileIcon.other}
                      </div>
                    )}
                    <div className="grid flex-1 gap-1">
                      <div className="truncate text-sm">{displayName}</div>
                      <div className="text-xs text-muted-foreground">
                        {fileMeta.file.type.split("/")[1].toUpperCase()} -{" "}
                        {formatFileSize(fileMeta.file.size)}
                      </div>
                    </div>
                    <div className="flex gap-0">
                      <Button
                        variant="ghost"
                        isRounded
                        iconOnly
                        className="size-8 min-w-0 border-0 opacity-70 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePreviewFile(fileMeta)
                        }}
                      >
                        <Eye className="!size-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        isRounded
                        iconOnly
                        className="size-8 min-w-0 border-0 opacity-70 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile(fileMeta.id)
                        }}
                      >
                        <CloseCircle className="!size-5" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center gap-3">
            <GlassIcon>
              <CloudUpload />
            </GlassIcon>
            <div className="space-y-1 text-center text-xs text-muted-foreground">
              <div className="">
                <span className="text-primary">Tải lên</span> hoặc kéo thả vào
                đây
              </div>
              <div className="">
                <span className="uppercase">{acceptString}</span>{" "}
                {maxFileSize && `(Tối đa ${formatFileSize(maxFileSize)})`}{" "}
                {isMultipleAllowed && `(Tối đa ${maxFiles} tệp)`}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* File Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex h-full w-full justify-center">
            {previewFile?.type.startsWith("image/") ? (
              <img
                src={previewFile.url}
                alt={previewFile.name}
                className="max-h-[80vh] object-contain"
              />
            ) : previewFile?.type === "application/pdf" ? (
              <iframe
                src={previewFile.url}
                title={previewFile.name}
                className="h-[80vh] w-full"
              />
            ) : (
              <div className="flex h-40 w-full items-center justify-center">
                <a
                  href={previewFile?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                >
                  <SquareArrowOutUpRight className="size-4" />
                  Open file in new tab
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </FormComposition>
  )
}

export { FileUpload }
