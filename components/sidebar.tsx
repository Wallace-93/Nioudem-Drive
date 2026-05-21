"use client"

import { useState } from "react"
import {
  Home,
  FolderClosed,
  Clock,
  Star,
  Trash2,
  Cloud,
  Settings,
  Plus,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const navItems = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "files", label: "Mes fichiers", icon: FolderClosed },
  { id: "recent", label: "Récents", icon: Clock },
  { id: "starred", label: "Favoris", icon: Star },
  { id: "trash", label: "Corbeille", icon: Trash2 },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [storageUsed] = useState(2.4)
  const storageTotal = 15

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <Cloud className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold text-sidebar-foreground">
            NiouDem Drive
          </span>
        </div>

        <Button className="w-full justify-start gap-2 mb-6" variant="default">
          <Plus className="h-4 w-4" />
          Nouveau
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </div>

      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeSection === item.id
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Stockage</span>
            <span className="text-sidebar-foreground">
              {storageUsed} Go / {storageTotal} Go
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
            />
          </div>
        </div>

        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent/50 transition-colors">
          <Settings className="h-5 w-5" />
          Paramètres
        </button>
      </div>
    </aside>
  )
}
