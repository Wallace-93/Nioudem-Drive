"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

type Profile = {
  id: string
  role: string
  prenom: string
  nom: string
  telephone: string
}

type Moniteur = {
  id: string
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
}

type Reservation = {
  id: string
  date_heure: string
  statut: string
  montant: number
  eleves: {
    profiles: { prenom: string; nom: string }
  }
}

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const CRENEAUX = ["Matin", "Après-midi", "Soir"]

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [moniteur, setMoniteur] = useState<Moniteur | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [disponibilites, setDisponibilites] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "reservations" | "profil" | "dispos">("overview")
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/connexion"); return }

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(prof)

      if (prof?.role === "moniteur") {
        const { data: mon } = await supabase
          .from("moniteurs")
          .select("*")
          .eq("user_id", user.id)
          .single()

        setMoniteur(mon)

        if (mon) {
          const { data: dispos } = await supabase
            .from("disponibilites")
            .select("*")
            .eq("moniteur_id", mon.id)

          const dispoMap: Record<string, boolean> = {}
          dispos?.forEach((d: any) => {
            dispoMap[`${d.jour_semaine}-${d.creneau}`] = d.actif
          })
          setDisponibilites(dispoMap)

          const { data: res } = await supabase
            .from("reservations")
            .select(`*, eleves(profiles(prenom, nom))`)
            .eq("moniteur_id", mon.id)
            .order("date_heure", { ascending: true })

          setReservations(res || [])
        }
      }

      setLoading(false)
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  async function toggleDispo(jour: string, creneau: string) {
    if (!moniteur) return
    const key = `${jour}-${creneau}`
    const newVal = !disponibilites[key]
    setDisponibilites(prev => ({ ...prev, [key]: newVal }))

    await supabase.from("disponibilites").upsert({
      moniteur_id: moniteur.id,
      jour_semaine: jour,
      creneau,
      actif: newVal,
    }, { onConflict: "moniteur_id,jour_semaine,creneau" })
  }

  async function saveProfil() {
    if (!moniteur || !profile) return
    setSaving(true)

    await supabase.from("moniteurs")
      .update({
        bio: moniteur.bio,
        tarif_horaire: moniteur.tarif_horaire,
        zone: moniteur.zone,
        rayon_km: moniteur.rayon_km,
      })
      .eq("id", moniteur.id)

    setSaving(false)
    setSaveMsg("Profil sauvegardé ✓")
    setTimeout(() => setSaveMsg(""), 3000)
  }

  const revenusMois = reservations
    .filter(r => r.statut === "termine" && new Date(r.date_heure).getMonth() === new Date().getMonth())
    .reduce((sum, r) => sum + (r.montant || 0) * 0.85, 0)

  const reservationsAVenir = reservations.filter(r =>
    r.statut === "confirme" && new Date(r.date_heure) > new Date()
  )

  const leconsMois = reservations.filter(r =>
    r.statut === "termine" && new Date(r.date_heure).getMonth() === new Date().getMonth()
  ).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span className="text-muted-foreground text-sm">Chargement de votre espace...</span>
        </div>
      </div>
    )
  }

  const isMoniteur = profile?.role === "moniteur"

  return (
    <div className="font-sans text-foreground min-h-screen">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-8 py-3 flex items-center justify-between bg-background/85 backdrop-blur-md border-b border-border">
        <Link href="/" className="flex flex-col">
          <span className="text-xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">NiouDem</span>
            <span className="font-light"> Drive</span>
          </span>
          <span className="text-[10px] font-black tracking-[0.15em] uppercase"
            style={{ background: "linear-gradient(135deg,#00F5A0,#00D4FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            auto-école 2.0
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden md:block">
            {profile?.prenom} {profile?.nom} · {isMoniteur ? "Moniteur" : "Élève"}
          </span>
          <button onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-border hover:border-primary hover:text-primary active:scale-95 transition-all">
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="pt-20 pb-16 px-4 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 pt-4">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Bonjour,{" "}
            <span className="bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">
              {profile?.prenom} 👋
            </span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isMoniteur
              ? moniteur?.verifie
                ? "✅ Votre profil est vérifié et visible par les élèves"
                : "⏳ Votre diplôme est en cours de vérification — sous 48h"
              : "Trouvez et réservez votre prochain moniteur"}
          </p>
        </div>

        {/* MONITEUR DASHBOARD */}
        {isMoniteur && (
          <>
            {/* Tabs */}
            <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-8 w-fit">
              {([
                ["overview", "📊 Vue d'ensemble"],
                ["reservations", "📅 Réservations"],
                ["dispos", "🗓 Disponibilités"],
                ["profil", "✏️ Mon profil"],
              ] as const).map(([tab, label]) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}>{label}</button>
              ))}
            </div>

            {/* Vue d'ensemble */}
            {activeTab === "overview" && (
              <div className="flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Réservations à venir", value: reservationsAVenir.length, icon: "📅", color: "#00D4FF" },
                    { label: "Leçons ce mois", value: leconsMois, icon: "✅", color: "#00F5A0" },
                    { label: "Revenus nets (mois)", value: `${Math.round(revenusMois)}€`, icon: "💳", color: "#C9A84C" },
                    { label: "Note moyenne", value: moniteur?.note_moyenne ? `${moniteur.note_moyenne.toFixed(1)}★` : "—", icon: "⭐", color: "#C9A84C" },
                  ].map((s) => (
                    <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
                      <div className="text-2xl mb-2">{s.icon}</div>
                      <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Prochaine réservation */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-base font-bold mb-4">Prochaines leçons</h2>
                  {reservationsAVenir.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-3xl mb-3">📭</div>
                      <p className="text-muted-foreground text-sm">Aucune réservation à venir pour l'instant.</p>
                      <p className="text-xs text-muted-foreground mt-1">Complétez votre profil et vos disponibilités pour apparaître dans les résultats.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {reservationsAVenir.slice(0, 3).map((r) => (
                        <div key={r.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F5A0]/20 to-[#00D4FF]/20 flex items-center justify-center text-sm font-bold text-primary">
                              {r.eleves?.profiles?.prenom?.[0]}{r.eleves?.profiles?.nom?.[0]}
                            </div>
                            <div>
                              <div className="text-sm font-semibold">{r.eleves?.profiles?.prenom} {r.eleves?.profiles?.nom}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(r.date_heure).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-bold text-[#00F5A0]">{r.montant}€</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Complétion profil */}
                {!moniteur?.verifie && (
                  <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-2xl p-5 flex items-start gap-4">
                    <div className="text-2xl flex-shrink-0">⏳</div>
                    <div>
                      <div className="font-bold text-sm mb-1">Vérification en cours</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        Notre équipe vérifie votre diplôme. Sous 48h, votre profil sera visible par les élèves. En attendant, complétez vos disponibilités et votre bio.
                      </div>
                      <button onClick={() => setActiveTab("dispos")}
                        className="mt-3 px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:opacity-90 active:scale-95 transition-all">
                        Remplir mes disponibilités →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Réservations */}
            {activeTab === "reservations" && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-base font-bold mb-5">Toutes mes réservations</h2>
                {reservations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">📭</div>
                    <p className="text-muted-foreground">Aucune réservation pour l'instant.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {reservations.map((r) => {
                      const statutColor: Record<string, string> = {
                        en_attente: "text-[#C9A84C] bg-[#C9A84C]/10 border-[#C9A84C]/30",
                        confirme: "text-[#00F5A0] bg-[#00F5A0]/10 border-[#00F5A0]/30",
                        refuse: "text-red-400 bg-red-500/10 border-red-500/30",
                        annule: "text-muted-foreground bg-border/30 border-border",
                        termine: "text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30",
                      }
                      const statutLabel: Record<string, string> = {
                        en_attente: "En attente",
                        confirme: "Confirmée",
                        refuse: "Refusée",
                        annule: "Annulée",
                        termine: "Terminée",
                      }
                      return (
                        <div key={r.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F5A0]/20 to-[#00D4FF]/20 flex items-center justify-center text-sm font-bold text-primary">
                              {r.eleves?.profiles?.prenom?.[0]}{r.eleves?.profiles?.nom?.[0]}
                            </div>
                            <div>
                              <div className="text-sm font-semibold">{r.eleves?.profiles?.prenom} {r.eleves?.profiles?.nom}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(r.date_heure).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${statutColor[r.statut]}`}>
                              {statutLabel[r.statut]}
                            </span>
                            <span className="text-sm font-bold">{r.montant}€</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Disponibilités */}
            {activeTab === "dispos" && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-base font-bold mb-2">Mes disponibilités hebdomadaires</h2>
                <p className="text-xs text-muted-foreground mb-6">Cliquez pour activer ou désactiver un créneau. Les modifications sont sauvegardées automatiquement.</p>
                <div className="grid grid-cols-7 gap-2">
                  {JOURS.map((jour) => (
                    <div key={jour} className="flex flex-col gap-2">
                      <div className="text-xs font-bold text-center text-muted-foreground pb-1 border-b border-border">{jour}</div>
                      {CRENEAUX.map((creneau) => {
                        const key = `${jour}-${creneau}`
                        const actif = disponibilites[key]
                        return (
                          <button key={creneau} onClick={() => toggleDispo(jour, creneau)}
                            className={`text-[10px] py-2 rounded-lg font-semibold transition-all active:scale-95 ${
                              actif
                                ? "bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background"
                                : "bg-background border border-border text-muted-foreground hover:border-primary/50"
                            }`}>
                            {creneau.slice(0, 3)}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#00F5A0] mt-4">✓ Les créneaux verts sont visibles par les élèves</p>
              </div>
            )}

            {/* Profil */}
            {activeTab === "profil" && moniteur && (
              <div className="flex flex-col gap-5">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-base font-bold mb-5">Mon profil moniteur</h2>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Bio / présentation</label>
                      <textarea
                        value={moniteur.bio || ""}
                        onChange={(e) => setMoniteur({ ...moniteur, bio: e.target.value })}
                        rows={4}
                        placeholder="Décrivez votre approche pédagogique, vos spécialités..."
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm transition-colors resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium block mb-2">Tarif / leçon (€)</label>
                        <input type="number" min={30} max={150}
                          value={moniteur.tarif_horaire || ""}
                          onChange={(e) => setMoniteur({ ...moniteur, tarif_horaire: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-2">Zone principale</label>
                        <input type="text"
                          value={moniteur.zone || ""}
                          onChange={(e) => setMoniteur({ ...moniteur, zone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-2">Rayon d'intervention (km)</label>
                        <input type="number" min={5} max={50}
                          value={moniteur.rayon_km || ""}
                          onChange={(e) => setMoniteur({ ...moniteur, rayon_km: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-2">Diplôme</label>
                        <input type="text" disabled value={moniteur.diplome || ""}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm text-muted-foreground cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-2">Spécialités</label>
                      <div className="flex flex-wrap gap-2">
                        {(moniteur.specialites || []).map((s) => (
                          <span key={s} className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button onClick={saveProfil} disabled={saving}
                        className="px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:opacity-90 active:scale-95 transition-all disabled:opacity-50">
                        {saving ? "Sauvegarde..." : "Sauvegarder"}
                      </button>
                      {saveMsg && <span className="text-sm text-[#00F5A0] font-semibold">{saveMsg}</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ELEVE DASHBOARD */}
        {!isMoniteur && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="text-2xl mb-3">🔍</div>
              <div className="text-base font-bold mb-2">Trouver un moniteur</div>
              <div className="text-sm text-muted-foreground mb-5 leading-relaxed">Accédez à tous les moniteurs disponibles près de chez vous, filtrés selon votre profil.</div>
              <Link href="/resultats" className="inline-block px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:opacity-90 active:scale-95 transition-all">
                Voir les moniteurs →
              </Link>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="text-2xl mb-3">📅</div>
              <div className="text-base font-bold mb-2">Mes réservations</div>
              <div className="text-sm text-muted-foreground mb-5 leading-relaxed">Aucune réservation pour l'instant. Réservez votre première leçon dès maintenant.</div>
              <Link href="/resultats" className="inline-block px-5 py-3 rounded-xl text-sm font-semibold border border-border hover:border-primary hover:text-primary active:scale-95 transition-all">
                Réserver une leçon
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
