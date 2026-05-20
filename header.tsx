"use client"

import { useState, useCallback } from "react"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropZoneProps {
  onFilesDropped: (files: File[]) => void
}

export function DropZone({ onFilesDropped }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    onFilesDropped(files)
  }, [onFilesDropped])

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity pointer-events-none opacity-0",
        isDragging && "opacity-100 pointer-events-auto"
      )}
    >
      <div className="flex flex-col items-center gap-4 p-12 border-2 border-dashed border-primary rounded-2xl bg-card">
        <Upload className="h-16 w-16 text-primary" />
        <div className="text-center">
          <p className="text-xl font-semibold text-foreground">
            Déposez vos fichiers ici
          </p>
          <p className="text-muted-foreground mt-1">
            pour les importer dans NiouDem Drive
          </p>
        </div>
      </div>
    </div>
  )
}

interface UploadProgressProps {
  fileName: string
  progress: number
  onCancel: () => void
}

export function UploadProgress({ fileName, progress, onCancel }: UploadProgressProps) {
  return (
    <div className="fixed bottom-6 right-6 w-80 bg-card border border-border rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground truncate pr-4">
          {fileName}
        </span>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground mt-1 block">
        {progress}% - Import en cours...
      </span>
    </div>
  )
}
