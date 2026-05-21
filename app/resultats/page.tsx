"use client"

import { useState } from "react"
import Link from "next/link"

const MONITEURS = [
  {
    id: 1,
    initiales: "SM",
    nom: "Sophie Martin",
    score: 97,
    note: 4.9,
    avis: 214,
    experience: "8 ans",
    specialites: ["Élèves anxieux", "Autoroute", "Boîte auto"],
    tarif: 58,
    zone: "Paris 15e",
    distance: 1.2,
    dispo: "Disponible dès demain",
    boite: "Auto & Manuelle",
    top: true,
  },
  {
    id: 2,
    initiales: "KD",
    nom: "Karim Djellal",
    score: 91,
    note: 4.8,
    avis: 127,
    experience: "5 ans",
    specialites: ["Conduite accompagnée", "Préparation examen"],
    tarif: 52,
    zone: "Paris 14e",
    distance: 2.3,
    dispo: "Prochain créneau : jeudi 14h",
    boite: "Manuelle",
    top: false,
  },
  {
    id: 3,
    initiales: "LB",
    nom: "Laura Benoit",
    score: 88,
    note: 4.7,
    avis: 89,
    experience: "6 ans",
    specialites: ["Seniors", "Conduite de nuit", "Boîte auto"],
    tarif: 55,
    zone: "Paris 13e",
    distance: 3.1,
    dispo: "Disponible dès demain",
    boite: "Automatique",
    top: false,
  },
  {
    id: 4,
    initiales: "TR",
    nom: "Thomas Roux",
    score: 84,
    note: 4.6,
    avis: 63,
    experience: "3 ans",
    specialites: ["Préparation examen", "Autoroute"],
    tarif: 45,
    zone: "Paris 6e",
    distance: 4.0,
    dispo: "Prochain créneau : vendredi 10h",
    boite: "Manuelle",
    top: false,
  },
  {
    id: 5,
    initiales: "AN",
    nom: "Amina Ndiaye",
    score: 79,
    note: 4.5,
    avis: 41,
    experience: "4 ans",
    specialites: ["Élèves anxieux", "Conduite accompagnée"],
    tarif: 50,
    zone: "Paris 7e",
    distance: 4.8,
    dispo: "Prochain créneau : lundi 9h",
    boite: "Les deux",
    top: false,
  },
  {
    id: 6,
    initiales: "PV",
    nom: "Pierre Vasseur",
    score: 74,
    note: 4.4,
    avis: 28,
    experience: "2 ans",
    specialites: ["Conduite en ville", "Préparation examen"],
    tarif: 42,
    zone: "Paris 16e",
    distance: 5.5,
    dispo: "Prochain créneau : mercredi 15h",
    boite: "Manuelle",
    top: false,
  },
]

type SortKey = "score" | "note" | "tarif" | "dispo"

export default function Resultats() {
  const [tri, setTri] = useState<SortKey>("score")
  const [budget, setBudget] = useState(90)

  const sorted = [...MONITEURS]
    .filter((m) => m.tarif <= budget)
    .sort((a, b) => {
      if (tri === "score") return b.score - a.score
      if (tri === "note") return b.note - a.note
      if (tri === "tarif") return a.tarif - b.tarif
      return a.distance - b.distance
    })

  return (
    <div className="font-sans text-foreground overflow-x-hidden min-h-screen">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-8 py-4 flex items-center justify-between bg-background/85 backdrop-blur-md border-b border-border">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">NiouDem</span>
          <span className="font-light text-foreground"> Drive</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#comment" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors">Comment ça marche</Link>
          <Link href="/#features" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors">Fonctionnalités</Link>
          <button className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:opacity-90 transition-opacity">
            Mon compte
          </button>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-muted-foreground text-sm mb-1">Recherche · Paris 15e · Permis B</p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">{sorted.length} moniteurs</span> trouvés près de vous
          </h1>
        </div>

        {/* FILTRES */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-8 flex flex-col gap-5">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mr-1">Trier par</span>
            {([
              ["score", "⚡ Meilleur match"],
              ["note", "★ Mieux noté"],
              ["tarif", "€ Moins cher"],
              ["dispo", "📅 Plus disponible"],
            ] as [SortKey, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTri(key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all border ${
                  tri === key
                    ? "bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background border-transparent"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider whitespace-nowrap">Budget max</span>
              <input
                type="range" min={30} max={90} value={budget}
                onChange={(e) => setBudget(+e.target.value)}
                className="flex-1 accent-[#00F5A0]"
              />
              <span className="text-sm font-bold text-[#00F5A0] min-w-[48px]">{budget}€</span>
            </div>
          </div>
        </div>

        {/* CARTES */}
        <div className="flex flex-col gap-5">
          {sorted.map((m) => (
            <div
              key={m.id}
              className={`bg-card rounded-2xl p-6 flex flex-col md:flex-row gap-5 transition-all hover:-translate-y-0.5 ${
                m.top
                  ? "border-2 border-[#C9A84C] shadow-[0_0_30px_rgba(201,168,76,0.1)]"
                  : "border border-border hover:border-primary/40"
              }`}
            >
              <div className="flex gap-4 flex-1 min-w-0">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-background font-black text-xl bg-gradient-to-br from-[#00F5A0] to-[#00D4FF]">
                    {m.initiales}
                  </div>
                  {m.top && (
                    <div className="absolute -top-2 -right-2 bg-[#C9A84C] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                      TOP ⭐
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-base font-bold">{m.nom}</h2>
                    <span className="text-[10px] font-semibold text-[#00F5A0] border border-[#00F5A0]/30 bg-[#00F5A0]/10 px-2 py-0.5 rounded-full">
                      ✓ Diplôme vérifié
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                      {m.experience}
                    </span>
                  </div>

                  {/* Note */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(m.note) ? "text-[#C9A84C]" : "text-border"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-bold">{m.note}</span>
                    <span className="text-xs text-muted-foreground">({m.avis} avis)</span>
                  </div>

                  {/* Spécialités */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {m.specialites.map((s) => (
                      <span key={s} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Zone + dispo */}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>📍 {m.zone} · {m.distance} km</span>
                    <span className={m.dispo.startsWith("Disponible") ? "text-[#00F5A0] font-semibold" : ""}>
                      🗓 {m.dispo}
                    </span>
                    <span>🚗 {m.boite}</span>
                  </div>
                </div>
              </div>

              {/* Score + prix + boutons */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:min-w-[160px]">
                <div className="text-center md:text-right">
                  <div className="text-2xl font-black bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">
                    {m.score}%
                  </div>
                  <div className="text-[10px] text-muted-foreground font-medium">compatible</div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-xl font-extrabold">{m.tarif}€</div>
                  <div className="text-[10px] text-muted-foreground">/ leçon 45 min</div>
                </div>
                <div className="flex md:flex-col gap-2 w-full md:w-auto">
                  <Link href={`/moniteur/${m.id}`} className="px-4 py-2 rounded-xl text-sm font-semibold border border-border hover:border-primary hover:text-primary transition-all text-center whitespace-nowrap">
                    Voir profil
                  </Link>
                  <button className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:opacity-90 hover:shadow-[0_4px_20px_rgba(0,245,160,0.3)] transition-all whitespace-nowrap">
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LOAD MORE */}
        <div className="text-center mt-10">
          <button className="px-8 py-3 rounded-xl text-sm font-semibold border border-border hover:border-primary hover:text-primary transition-all">
            Afficher plus de moniteurs
          </button>
        </div>
      </div>
    </div>
  )
}
