"use client"

import { useState } from "react"
import Link from "next/link"

const MONITEUR = {
  initiales: "SM",
  nom: "Sophie Martin",
  score: 97,
  note: 4.9,
  avis: 214,
  experience: "8 ans",
  diplome: "BEPECASER",
  bio: "Monitrice indépendante depuis 8 ans, spécialisée dans l'accompagnement des élèves anxieux et la préparation à l'examen. Mon approche est bienveillante, patiente et centrée sur la progression de chaque élève à son rythme.",
  specialites: ["Élèves anxieux", "Autoroute", "Boîte automatique", "Conduite de nuit", "Préparation examen"],
  permis: ["B", "BE"],
  tarif: 58,
  zone: "Paris 15e",
  rayon: "15 km",
  boite: "Auto & Manuelle",
  vehicule: "Peugeot 208 — Boîte auto",
  tauxReponse: 98,
  delaiReponse: "< 2h",
  tauxReussite: 87,
  top: true,
}

const AVIS = [
  { prenom: "Marie L.", note: 5, date: "Il y a 3 jours", texte: "Sophie est une monitrice exceptionnelle. Grâce à elle j'ai décroché mon permis du premier coup ! Elle sait mettre à l'aise même les élèves les plus stressés." },
  { prenom: "Julien T.", note: 5, date: "Il y a 1 semaine", texte: "Très professionnelle, pédagogue et patiente. Je recommande à 100%. Le suivi entre les leçons est vraiment un plus." },
  { prenom: "Camille R.", note: 4, date: "Il y a 2 semaines", texte: "Excellente monitrice, explications claires et précises. Très à l'écoute de mes besoins." },
  { prenom: "Antoine B.", note: 5, date: "Il y a 1 mois", texte: "J'avais déjà raté 2 fois l'examen avant de trouver Sophie. Elle a su identifier mes erreurs et me faire progresser rapidement." },
]

const DISPOS = {
  "Lun": ["Matin", "Après-midi"],
  "Mar": ["Matin", "Soir"],
  "Mer": ["Après-midi", "Soir"],
  "Jeu": ["Matin", "Après-midi", "Soir"],
  "Ven": ["Matin"],
  "Sam": ["Matin", "Après-midi"],
  "Dim": [],
}

export default function ProfilMoniteur() {
  const [creneauSelectionne, setCreneauSelectionne] = useState<string | null>(null)

  return (
    <div className="font-sans text-foreground overflow-x-hidden min-h-screen">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-8 py-4 flex items-center justify-between bg-background/85 backdrop-blur-md border-b border-border">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">NiouDem</span>
          <span className="font-light text-foreground"> Drive</span>
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/resultats" className="text-muted-foreground text-sm hover:text-primary transition-colors">← Retour aux résultats</Link>
          <button className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:opacity-90 transition-opacity">
            Mon compte
          </button>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* COLONNE GAUCHE — Profil */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Carte identité */}
            <div className={`bg-card rounded-2xl p-6 ${MONITEUR.top ? "border-2 border-[#C9A84C]" : "border border-border"}`}>
              <div className="flex gap-5 items-start">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-background font-black text-2xl bg-gradient-to-br from-[#00F5A0] to-[#00D4FF]">
                    {MONITEUR.initiales}
                  </div>
                  {MONITEUR.top && (
                    <div className="absolute -top-2 -right-2 bg-[#C9A84C] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">TOP ⭐</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-xl font-bold">{MONITEUR.nom}</h1>
                    <span className="text-[11px] font-semibold text-[#00F5A0] border border-[#00F5A0]/30 bg-[#00F5A0]/10 px-2 py-0.5 rounded-full">✓ Diplôme vérifié</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <svg key={s} className={`w-4 h-4 ${s <= Math.round(MONITEUR.note) ? "text-[#C9A84C]" : "text-border"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="font-bold">{MONITEUR.note}</span>
                    <span className="text-sm text-muted-foreground">({MONITEUR.avis} avis)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>📍 {MONITEUR.zone} · {MONITEUR.rayon}</span>
                    <span>🎓 {MONITEUR.diplome} · {MONITEUR.experience}</span>
                    <span>🚗 {MONITEUR.vehicule}</span>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-5">
                {MONITEUR.bio}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Taux de réponse", value: `${MONITEUR.tauxReponse}%`, sub: `Délai moyen ${MONITEUR.delaiReponse}` },
                { label: "Taux de réussite", value: `${MONITEUR.tauxReussite}%`, sub: "à l'examen" },
                { label: "Score matching", value: `${MONITEUR.score}%`, sub: "compatible" },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">{s.value}</div>
                  <div className="text-xs font-semibold mt-1">{s.label}</div>
                  <div className="text-[11px] text-muted-foreground">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Spécialités */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold mb-4">Spécialités</h2>
              <div className="flex flex-wrap gap-2">
                {MONITEUR.specialites.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full text-sm font-medium bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">{s}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Permis :</span>
                {MONITEUR.permis.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded text-xs font-bold bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/20">{p}</span>
                ))}
              </div>
            </div>

            {/* Disponibilités */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold mb-4">Disponibilités cette semaine</h2>
              <div className="grid grid-cols-7 gap-2">
                {Object.entries(DISPOS).map(([jour, creneaux]) => (
                  <div key={jour} className="flex flex-col gap-1.5">
                    <div className="text-xs font-bold text-center text-muted-foreground">{jour}</div>
                    {["Matin", "Après-midi", "Soir"].map((c) => {
                      const dispo = creneaux.includes(c)
                      const key = `${jour}-${c}`
                      return (
                        <button
                          key={c}
                          disabled={!dispo}
                          onClick={() => dispo && setCreneauSelectionne(key === creneauSelectionne ? null : key)}
                          className={`text-[10px] py-1 rounded-lg font-semibold transition-all ${
                            creneauSelectionne === key
                              ? "bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background"
                              : dispo
                              ? "bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/20 hover:bg-[#00F5A0]/20"
                              : "bg-card border border-border text-border cursor-not-allowed"
                          }`}
                        >
                          {c.slice(0, 3)}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
              {creneauSelectionne && (
                <p className="mt-4 text-xs text-[#00F5A0] font-semibold">
                  ✓ Créneau sélectionné : {creneauSelectionne.replace("-", " · ")}
                </p>
              )}
            </div>

            {/* Avis */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold mb-5">Avis des élèves</h2>
              <div className="flex flex-col gap-4">
                {AVIS.map((a, i) => (
                  <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F5A0]/20 to-[#00D4FF]/20 border border-border flex items-center justify-center text-xs font-bold text-[#00D4FF]">
                          {a.prenom[0]}
                        </div>
                        <span className="text-sm font-semibold">{a.prenom}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1,2,3,4,5].map((s) => (
                            <svg key={s} className={`w-3 h-3 ${s <= a.note ? "text-[#C9A84C]" : "text-border"}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{a.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{a.texte}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLONNE DROITE — Réservation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 flex flex-col gap-5">
              <div className="text-center">
                <div className="text-3xl font-black">{MONITEUR.tarif}€</div>
                <div className="text-xs text-muted-foreground">/ leçon de 45 minutes</div>
              </div>

              <div className="bg-background/50 rounded-xl p-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diplôme</span>
                  <span className="font-semibold">{MONITEUR.diplome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expérience</span>
                  <span className="font-semibold">{MONITEUR.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Boîte</span>
                  <span className="font-semibold">{MONITEUR.boite}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zone</span>
                  <span className="font-semibold">{MONITEUR.zone}</span>
                </div>
              </div>

              {creneauSelectionne ? (
                <div className="bg-[#00F5A0]/10 border border-[#00F5A0]/30 rounded-xl p-3 text-center">
                  <p className="text-xs text-[#00F5A0] font-semibold">Créneau sélectionné</p>
                  <p className="text-sm font-bold mt-0.5">{creneauSelectionne.replace("-", " · ")}</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center">← Sélectionnez un créneau dans le calendrier</p>
              )}

              <button
                disabled={!creneauSelectionne}
                className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
                  creneauSelectionne
                    ? "bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:opacity-90 hover:shadow-[0_4px_20px_rgba(0,245,160,0.3)]"
                    : "bg-border text-muted-foreground cursor-not-allowed"
                }`}
              >
                Réserver cette leçon
              </button>

              <button className="w-full py-3 rounded-xl text-sm font-semibold border border-border hover:border-primary hover:text-primary transition-all">
                💬 Envoyer un message
              </button>

              <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                Paiement sécurisé · Annulation gratuite 24h avant · Diplôme vérifié par NiouDem
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
