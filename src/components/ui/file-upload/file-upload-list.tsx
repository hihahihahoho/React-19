// components/file-upload-list.tsx

"use client"

import { useFileUpload } from "@/hooks/use-file-upload"
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
} from "lucide-react"
import { Button } from "../button"
import { CloseCircle } from "../custom-icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../dialog"
import {
  FormComposition,
  FormCompositionProps,
  FormControl,
} from "../form/form"
import { GlassIcon } from "../glass-icon"

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

export interface FileUploadListProps
  extends Omit<
    React.ComponentProps<"input">,
    "value" | "accept" | "defaultValue"
  > {
  onFileChange?: (files: FileList) => void
  maxFiles?: number
  accept?: TAccept[]
  buttonLabel?: string
  maxFileSize?: number
  disabled?: boolean
  value?: File[]
  defaultValue?: File[]
  formComposition?: FormCompositionProps
}

const MAX_FILE_SIZE = 500000 // 500

function FileUploadList({
  onFileChange,
  maxFiles = 5,
  accept = ACCEPTED_IMAGE_TYPES,
  maxFileSize = MAX_FILE_SIZE,
  formComposition,
  disabled,
  value,
  defaultValue,
  ...props
}: FileUploadListProps) {
  const {
    inputRef,
    isDragOver,
    isMultipleAllowed,
    internalFiles,
    previewUrls,
    previewOpen,
    previewFile,
    setPreviewOpen,
    handleFiles,
    removeFile,
    handlePreviewFile,
    handleDrag,
    handleDrop,
    getDisplayName,
  } = useFileUpload({
    onFileChange,
    maxFiles,
    accept,
    maxFileSize,
    value,
    defaultValue,
  })

  const acceptString = accept.map((type) => `${type.split("/")[1]}`).join(",")

  return (
    <FormComposition
      data-slot="file-upload"
      {...formComposition}
      className="flex-col border-0 p-0 shadow-none! ring-0!"
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
          isDragOver && "ring-primary ring-2 ring-offset-2",
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
          <div className="grid gap-3">
            {(internalFiles.length < maxFiles || maxFiles === 1) && (
              <div className="text-muted-foreground flex min-h-6 items-center gap-2 text-xs">
                <CloudUpload />
                <div className="flex-1">
                  {maxFiles === 1 ? (
                    <>Chọn lại</>
                  ) : (
                    <>
                      <span className="text-primary">Tải lên</span> hoặc kéo thả
                      vào đây
                    </>
                  )}
                </div>
                {maxFiles !== 1 && internalFiles.length + "/" + maxFiles}
              </div>
            )}
            {internalFiles.map((fileMeta) => {
              return (
                <div
                  key={fileMeta.id}
                  className="bg-secondary flex min-w-0 cursor-default items-center gap-3 rounded-lg p-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {fileMeta.file.type.startsWith("image/") ? (
                    <img
                      src={previewUrls[fileMeta.id] || ""}
                      alt={getDisplayName(fileMeta)}
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
                    <div className="truncate text-sm">
                      {getDisplayName(fileMeta)}
                    </div>
                    <div className="text-muted-foreground text-xs">
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
                      <Eye className="size-5!" />
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
                      <CloseCircle className="size-5!" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <GlassIcon>
              <CloudUpload />
            </GlassIcon>
            <div className="text-muted-foreground space-y-1 text-center text-xs">
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
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded px-4 py-2"
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

export { FileUploadList }
