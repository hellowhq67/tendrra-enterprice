"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  onUpload: (urls: string[]) => void
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
  className?: string
}

export function FileUpload({
  onUpload,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
  },
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const { toast } = useToast()

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file, errors }) => {
          errors.forEach((error: any) => {
            if (error.code === "file-too-large") {
              toast({
                title: "File too large",
                description: `${file.name} is larger than ${maxSize / (1024 * 1024)}MB`,
                variant: "destructive",
              })
            } else if (error.code === "file-invalid-type") {
              toast({
                title: "Invalid file type",
                description: `${file.name} is not an accepted file type`,
                variant: "destructive",
              })
            } else {
              toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
              })
            }
          })
        })
      }

      // Add accepted files
      setFiles((prev) => [...prev, ...acceptedFiles].slice(0, maxFiles))
    },
    [maxFiles, maxSize, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    try {
      // In a real app, you would upload the files to a server
      // For demo purposes, we'll just create placeholder URLs
      const urls = files.map((file, index) => {
        const color = ["4287f5", "42f54e", "f542e3", "f5a742", "f54242"][index % 5]
        return `https://via.placeholder.com/1080x1920/${color}/FFFFFF?text=${encodeURIComponent(file.name)}`
      })

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      onUpload(urls)
      setFiles([])
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${urls.length} file${urls.length > 1 ? "s" : ""}`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-pink-500 bg-pink-500/10" : "border-pink-500/20 hover:border-pink-500/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-8 w-8 text-pink-400" />
          <p className="text-sm font-medium">
            {isDragActive ? "Drop the files here..." : "Drag & drop files here, or click to select files"}
          </p>
          <p className="text-xs text-muted-foreground">
            {`Upload up to ${maxFiles} image${maxFiles > 1 ? "s" : ""} (max ${maxSize / (1024 * 1024)}MB each)`}
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-pink-400">Selected files:</p>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-md border border-pink-500/20 p-2 text-sm"
              >
                <span className="truncate max-w-[200px]">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="h-6 w-6 text-pink-400 hover:bg-pink-500/10 hover:text-pink-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full mt-2 bg-pink-600 hover:bg-pink-700 text-white"
          >
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      )}
    </div>
  )
}

