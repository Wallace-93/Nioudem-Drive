"use client"

import { Search, Bell, Grid, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher dans Drive"
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Grid className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center ml-2">
          <User className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
    </header>
  )
}
