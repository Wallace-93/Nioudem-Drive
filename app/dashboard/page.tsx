"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/connexion"); return }
      setUser(user)

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(profile)
      setLoading(false)
    }
    loadUser()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="font-sans text-foreground min-h-screen">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-8 py-4 flex items-center justify-between bg-background/85 backdrop-blur-md border-b border-border">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">NiouDem</span>
          <span className="font-light text-foreground"> Drive</span>
        </Link>
        <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-sm font-semibold border border-border hover:border-primary hover:text-primary transition-all">
          Déconnexion
        </button>
      </nav>

      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-muted-foreground text-sm mb-1">Tableau de bord</p>
          <h1 className="text-3xl font-black tracking-tight">
            Bonjour{" "}
            <span className="bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">
              {profile?.prenom || user?.email} 👋
            </span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Compte {profile?.role === "moniteur" ? "moniteur" : "élève"} · {user?.email}
          </p>
        </div>

        {/* Cards selon le rôle */}
        {profile?.role === "moniteur" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: "Réservations à venir", value: "0", icon: "📅", desc: "Aucune pour l'instant" },
              { label: "Leçons ce mois", value: "0", icon: "✅", desc: "Commencez à recevoir des élèves" },
              { label: "Revenus du mois", value: "0€", icon: "💳", desc: "Vos gains nets" },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-6">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-2xl font-black bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">{s.value}</div>
                <div className="text-sm font-semibold mt-1">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-base font-bold mb-1">Trouver un moniteur</div>
              <div className="text-sm text-muted-foreground mb-4">Accédez à tous les moniteurs disponibles près de chez vous.</div>
              <Link href="/resultats" className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:opacity-90 transition-all">
                Voir les moniteurs
              </Link>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-base font-bold mb-1">Mes réservations</div>
              <div className="text-sm text-muted-foreground mb-4">Aucune réservation pour l'instant.</div>
              <Link href="/resultats" className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold border border-border hover:border-primary hover:text-primary transition-all">
                Réserver une leçon
              </Link>
            </div>
          </div>
        )}

        {/* Compléter le profil */}
        <div className="mt-8 bg-gradient-to-r from-[#00F5A0]/8 to-[#00D4FF]/8 border border-border rounded-2xl p-6 flex items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm mb-1">⚡ Complétez votre profil</div>
            <div className="text-xs text-muted-foreground">Un profil complet augmente vos chances d'être mis en relation.</div>
          </div>
          <Link href={profile?.role === "moniteur" ? "/inscription-moniteur" : "/inscription"} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:opacity-90 transition-all whitespace-nowrap">
            Compléter →
          </Link>
        </div>
      </div>
    </div>
  )
}
