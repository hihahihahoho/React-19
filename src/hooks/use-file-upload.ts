import { sonnerToast } from "@/components/ui/sonner"
import { ACCEPTED_IMAGE_TYPES } from "@/lib/const"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export interface UseFileUploadProps {
  onFileChange?: (files: FileList) => void
  maxFiles?: number
  accept?: string[]
  maxFileSize?: number
  value?: File[]
  defaultValue?: File[]
}

interface FileWithMeta {
  id: string
  file: File
}

const MAX_FILE_SIZE = 500000 // 500KB

const generateFileId = (file: File) => {
  return `${file.name}-${file.size}-${file.lastModified}`
}

const isRemoteFile = (file: File): boolean => {
  return file.name.startsWith("REMOTE_FILE::")
}

export function useFileUpload({
  onFileChange,
  maxFiles = 5,
  accept = ACCEPTED_IMAGE_TYPES,
  maxFileSize = MAX_FILE_SIZE,
  value,
  defaultValue,
}: UseFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const isControlled = value !== undefined
  const isMultipleAllowed = maxFiles > 1

  const [internalFiles, setInternalFiles] = useState<FileWithMeta[]>(() => {
    const initial = (value || defaultValue || []).map((file) => ({
      id: generateFileId(file),
      file,
    }))
    return initial
  })

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<{
    url: string
    type: string
    name: string
  } | null>(null)

  const getRemoteUrl = useCallback((file: File): string | null => {
    if (!isRemoteFile(file)) return null
    return file.name.replace("REMOTE_FILE::", "")
  }, [])

  const previewUrls = useMemo(() => {
    return internalFiles.reduce(
      (acc, file) => {
        let previewUrl = null

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

  // Cleanup preview URLs
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
        filesArray = filesArray.slice(0, 1)
      }

      const validFiles: File[] = []
      const errors: string[] = []
      const duplicates: string[] = []

      const currentFiles = isControlled
        ? value || []
        : internalFiles.map((f) => f.file)

      filesArray.forEach((file) => {
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

        const fileErrors = validateFile(file)
        if (fileErrors.length > 0) {
          errors.push(...fileErrors)
        } else {
          validFiles.push(file)
        }
      })

      if (duplicates.length > 0) {
        sonnerToast({
          variant: "destructive",
          title: `${duplicates.length} tệp đã tồn tại`,
        })
      }

      if (errors.length > 0) {
        const uniqueErrors = Array.from(new Set(errors))
        sonnerToast({
          variant: "destructive",
          title: `${filesArray.length - validFiles.length} tệp ${uniqueErrors.join(", ")}`,
        })
      }

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

  const getDisplayName = (fileMeta: FileWithMeta): string => {
    return isRemoteFile(fileMeta.file)
      ? getRemoteUrl(fileMeta.file)?.split("/").pop() || "remote-file"
      : fileMeta.file.name
  }

  return {
    inputRef,
    isDragOver,
    isControlled,
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
    getRemoteUrl,
    isRemoteFile,
    getDisplayName,
  }
}