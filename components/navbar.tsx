"use client"

import Link from "next/link"

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-4 md:px-8 py-4 flex items-center justify-between bg-background/85 backdrop-blur-md border-b border-border">
      <Link href="/" className="text-xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">NiouDem</span>
        <span className="font-light text-foreground"> Drive</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <Link href="/#comment" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors">Comment ca marche</Link>
        <Link href="/#features" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors">Fonctionnalites</Link>
        <Link href="/#moniteurs" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors">Moniteurs</Link>
        <Link href="/inscription" className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:opacity-90 transition-opacity">
          Commencer
        </Link>
      </div>
    </nav>
  )
}
