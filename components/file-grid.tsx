"use client"

import { useState } from "react"
import {
  Folder,
  FileText,
  FileImage,
  FileVideo,
  File,
  MoreVertical,
  Star,
  Download,
  Trash2,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export interface FileItem {
  id: string
  name: string
  type: "folder" | "document" | "image" | "video" | "other"
  size?: string
  modified: string
  starred?: boolean
}

interface FileGridProps {
  files: FileItem[]
  onFileClick: (file: FileItem) => void
  onToggleStar: (id: string) => void
}

function getFileIcon(type: FileItem["type"]) {
  switch (type) {
    case "folder":
      return Folder
    case "document":
      return FileText
    case "image":
      return FileImage
    case "video":
      return FileVideo
    default:
      return File
  }
}

function getIconColor(type: FileItem["type"]) {
  switch (type) {
    case "folder":
      return "text-primary"
    case "document":
      return "text-blue-400"
    case "image":
      return "text-green-400"
    case "video":
      return "text-red-400"
    default:
      return "text-muted-foreground"
  }
}

export function FileGrid({ files, onFileClick, onToggleStar }: FileGridProps) {
  const [viewMode] = useState<"grid" | "list">("grid")

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {files.map((file) => {
          const Icon = getFileIcon(file.type)
          return (
            <div
              key={file.id}
              className="group relative bg-card border border-border rounded-lg p-4 hover:border-primary/50 hover:bg-card/80 transition-all cursor-pointer"
              onClick={() => onFileClick(file)}
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleStar(file.id); }}>
                      <Star className="h-4 w-4 mr-2" />
                      {file.starred ? "Retirer des favoris" : "Ajouter aux favoris"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {file.starred && (
                <Star className="absolute top-2 left-2 h-4 w-4 text-yellow-400 fill-yellow-400" />
              )}

              <div className="flex flex-col items-center text-center">
                <Icon className={cn("h-12 w-12 mb-3", getIconColor(file.type))} />
                <span className="text-sm font-medium text-foreground truncate w-full">
                  {file.name}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {file.modified}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return null
}
