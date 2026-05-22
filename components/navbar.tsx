"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="fixed top-0 w-full z-50 px-4 md:px-8 py-3 flex items-center justify-between bg-background/85 backdrop-blur-md border-b border-border">
      <Link href="/" className="flex flex-col">
        <span className="text-xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">NiouDem</span>
          <span className="font-light text-foreground"> Drive</span>
        </span>
        <span className="text-[10px] font-black tracking-[0.15em] uppercase"
          style={{
            background: "linear-gradient(135deg, #00F5A0, #00D4FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 4px rgba(0,245,160,0.7))",
            animation: "laserPulse 2s ease-in-out infinite"
          }}>
          auto-école 2.0
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link href="/vision" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors">Notre vision</Link>
        <Link href="/#comment" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors">Comment ça marche</Link>
        <Link href="/resultats" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors">Moniteurs</Link>

        {!loading && (
          user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard"
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:opacity-90 active:scale-95 transition-all">
                Mon espace →
              </Link>
              <button onClick={handleLogout}
                className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors">
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/connexion"
                className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors">
                Se connecter
              </Link>
              <Link href="/inscription"
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:opacity-90 active:scale-95 transition-all">
                Commencer
              </Link>
            </div>
          )
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        {!loading && (
          user ? (
            <Link href="/dashboard"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background">
              Mon espace
            </Link>
          ) : (
            <Link href="/inscription"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background">
              Commencer
            </Link>
          )
        )}
      </div>
    </nav>
  )
}
