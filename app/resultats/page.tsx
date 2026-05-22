"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"

type Moniteur = {
  id: string
  user_id: string
  diplome: string
  specialites: string[]
  tarif_horaire: number
  zone: string
  rayon_km: number
  boite_auto: boolean
  bio: string
  verifie: boolean
  note_moyenne: number
  nb_avis: number
  profiles: {
    prenom: string
    nom: string
    avatar_url: string | null
  }
  score?: number
}

type SortKey = "score" | "note" | "tarif" | "dispo"

// Moniteurs fictifs pour quand la base est vide
const MONITEURS_DEMO: Moniteur[] = [
  {
    id: "demo-1", user_id: "d1", diplome: "BEPECASER",
    specialites: ["Élèves anxieux", "Autoroute", "Boîte auto"],
    tarif_horaire: 58, zone: "Paris 15e", rayon_km: 15,
    boite_auto: true, bio: "Monitrice indépendante depuis 8 ans.",
    verifie: true, note_moyenne: 4.9, nb_avis: 214,
    profiles: { prenom: "Sophie", nom: "Martin", avatar_url: null }, score: 97,
  },
  {
    id: "demo-2", user_id: "d2", diplome: "Titre Pro ECSR",
    specialites: ["Conduite accompagnée", "Préparation examen"],
    tarif_horaire: 52, zone: "Paris 14e", rayon_km: 15,
    boite_auto: false, bio: "5 ans d'expérience, taux de réussite élevé.",
    verifie: true, note_moyenne: 4.8, nb_avis: 127,
    profiles: { prenom: "Karim", nom: "Djellal", avatar_url: null }, score: 91,
  },
  {
    id: "demo-3", user_id: "d3", diplome: "BEPECASER",
    specialites: ["Seniors", "Conduite de nuit", "Boîte auto"],
    tarif_horaire: 55, zone: "Paris 13e", rayon_km: 15,
    boite_auto: true, bio: "Spécialisée seniors et reprises.",
    verifie: true, note_moyenne: 4.7, nb_avis: 89,
    profiles: { prenom: "Laura", nom: "Benoit", avatar_url: null }, score: 88,
  },
  {
    id: "demo-4", user_id: "d4", diplome: "Titre Pro ECSR",
    specialites: ["Préparation examen", "Autoroute"],
    tarif_horaire: 45, zone: "Paris 6e", rayon_km: 10,
    boite_auto: false, bio: "Jeune moniteur dynamique.",
    verifie: true, note_moyenne: 4.6, nb_avis: 63,
    profiles: { prenom: "Thomas", nom: "Roux", avatar_url: null }, score: 84,
  },
  {
    id: "demo-5", user_id: "d5", diplome: "BEPECASER",
    specialites: ["Élèves anxieux", "Conduite accompagnée"],
    tarif_horaire: 50, zone: "Paris 7e", rayon_km: 15,
    boite_auto: true, bio: "Pédagogie bienveillante.",
    verifie: true, note_moyenne: 4.5, nb_avis: 41,
    profiles: { prenom: "Amina", nom: "Ndiaye", avatar_url: null }, score: 79,
  },
  {
    id: "demo-6", user_id: "d6", diplome: "Titre Pro ECSR",
    specialites: ["Conduite en ville", "Préparation examen"],
    tarif_horaire: 42, zone: "Paris 16e", rayon_km: 10,
    boite_auto: false, bio: "Spécialiste conduite urbaine.",
    verifie: true, note_moyenne: 4.4, nb_avis: 28,
    profiles: { prenom: "Pierre", nom: "Vasseur", avatar_url: null }, score: 74,
  },
]

function getInitiales(prenom: string, nom: string) {
  return `${prenom?.[0] || ""}${nom?.[0] || ""}`.toUpperCase()
}

function Stars({ note }: { note: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(note) ? "text-[#C9A84C]" : "text-border"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Resultats() {
  const [moniteurs, setMoniteurs] = useState<Moniteur[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [tri, setTri] = useState<SortKey>("score")
  const [budget, setBudget] = useState(90)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMoniteurs() {
      const { data, error } = await supabase
        .from("moniteurs")
        .select(`
          *,
          profiles (prenom, nom, avatar_url)
        `)
        .eq("verifie", true)
        .order("note_moyenne", { ascending: false })

      if (error || !data || data.length === 0) {
        // Pas de moniteurs réels → mode démo
        setMoniteurs(MONITEURS_DEMO)
        setIsDemoMode(true)
      } else {
        // Calcul du score pour chaque moniteur réel
        const avec_score = data.map((m: any, i: number) => ({
          ...m,
          score: Math.max(60, 97 - i * 5),
        }))
        setMoniteurs(avec_score)
        setIsDemoMode(false)
      }
      setLoading(false)
    }
    fetchMoniteurs()
  }, [])

  const sorted = [...moniteurs]
    .filter((m) => m.tarif_horaire <= budget)
    .sort((a, b) => {
      if (tri === "score") return (b.score || 0) - (a.score || 0)
      if (tri === "note") return b.note_moyenne - a.note_moyenne
      if (tri === "tarif") return a.tarif_horaire - b.tarif_horaire
      return 0
    })

  return (
    <div className="font-sans text-foreground overflow-x-hidden min-h-screen">
      {/* NAV */}
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
            }}>
            auto-école 2.0
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#comment" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors">Comment ça marche</Link>
          <Link href="/inscription" className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:opacity-90 active:scale-95 transition-all">
            Commencer
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-muted-foreground text-sm mb-1">Recherche · Île-de-France · Permis B</p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {loading ? (
              "Recherche en cours..."
            ) : (
              <>
                <span className="bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">
                  {sorted.length} moniteur{sorted.length > 1 ? "s" : ""}
                </span> trouvé{sorted.length > 1 ? "s" : ""} près de vous
              </>
            )}
          </h1>
          {isDemoMode && (
            <p className="text-xs text-[#C9A84C] mt-1 border border-[#C9A84C]/30 bg-[#C9A84C]/10 rounded-lg px-3 py-1.5 inline-block mt-2">
              ✨ Aperçu — Les vrais moniteurs apparaîtront ici dès leur inscription sur la plateforme
            </p>
          )}
        </div>

        {/* Filtres */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-8 flex flex-col gap-5">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mr-1">Trier par</span>
            {([
              ["score", "⚡ Meilleur match"],
              ["note", "★ Mieux noté"],
              ["tarif", "€ Moins cher"],
            ] as [SortKey, string][]).map(([key, label]) => (
              <button key={key} onClick={() => setTri(key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all border active:scale-95 ${
                  tri === key
                    ? "bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background border-transparent"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}>{label}</button>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider whitespace-nowrap">Budget max</span>
            <input type="range" min={30} max={90} value={budget}
              onChange={(e) => setBudget(+e.target.value)}
              className="flex-1 accent-[#00F5A0]" />
            <span className="text-sm font-bold text-[#00F5A0] min-w-[48px]">{budget}€</span>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-border flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-border rounded w-1/3" />
                    <div className="h-3 bg-border rounded w-1/2" />
                    <div className="h-3 bg-border rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {sorted.map((m, idx) => (
              <div key={m.id}
                className={`bg-card rounded-2xl p-6 flex flex-col md:flex-row gap-5 transition-all hover:-translate-y-0.5 ${
                  idx === 0
                    ? "border-2 border-[#C9A84C] shadow-[0_0_30px_rgba(201,168,76,0.1)]"
                    : "border border-border hover:border-primary/40"
                }`}>

                {/* Gauche */}
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-background font-black text-xl bg-gradient-to-br from-[#00F5A0] to-[#00D4FF]">
                      {getInitiales(m.profiles?.prenom || "", m.profiles?.nom || "")}
                    </div>
                    {idx === 0 && (
                      <div className="absolute -top-2 -right-2 bg-[#C9A84C] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">TOP ⭐</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-base font-bold">{m.profiles?.prenom} {m.profiles?.nom}</h2>
                      {m.verifie && (
                        <span className="text-[10px] font-semibold text-[#00F5A0] border border-[#00F5A0]/30 bg-[#00F5A0]/10 px-2 py-0.5 rounded-full">
                          ✓ Diplôme vérifié
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                        {m.diplome}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-2">
                      <Stars note={m.note_moyenne} />
                      <span className="text-sm font-bold">{m.note_moyenne.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({m.nb_avis} avis)</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(m.specialites || []).map((s) => (
                        <span key={s} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>📍 {m.zone} · {m.rayon_km} km</span>
                      <span>🚗 {m.boite_auto ? "Boîte auto & manuelle" : "Boîte manuelle"}</span>
                    </div>
                  </div>
                </div>

                {/* Droite */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:min-w-[160px]">
                  <div className="text-center md:text-right">
                    <div className="text-2xl font-black bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">
                      {m.score}%
                    </div>
                    <div className="text-[10px] text-muted-foreground font-medium">compatible</div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-xl font-extrabold">{m.tarif_horaire}€</div>
                    <div className="text-[10px] text-muted-foreground">/ leçon 45 min</div>
                  </div>
                  <div className="flex md:flex-col gap-2 w-full md:w-auto">
                    <Link href={`/moniteur/${m.id}`}
                      className="px-4 py-2 rounded-xl text-sm font-semibold border border-border hover:border-primary hover:text-primary active:scale-95 transition-all text-center whitespace-nowrap">
                      Voir profil
                    </Link>
                    <Link href={`/reserver/${m.id}`}
                      className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:opacity-90 active:scale-95 transition-all text-center whitespace-nowrap">
                      Réserver
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && sorted.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-bold mb-2">Aucun moniteur trouvé</h3>
            <p className="text-muted-foreground text-sm">Essayez d'augmenter votre budget ou d'élargir vos critères.</p>
          </div>
        )}

        {!loading && sorted.length > 0 && (
          <div className="text-center mt-10">
            <button className="px-8 py-3 rounded-xl text-sm font-semibold border border-border hover:border-primary hover:text-primary active:scale-95 transition-all">
              Afficher plus de moniteurs
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
