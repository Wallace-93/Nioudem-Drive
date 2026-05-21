"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { createClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

type FormData = {
  // Step 1
  prenom: string
  nom: string
  email: string
  telephone: string
  password: string
  confirmPassword: string
  // Step 2
  niveau: string
  typePermis: string
  boiteVitesses: string
  specialites: string[]
  budget: number
  // Step 3
  zone: string
  rayon: string
  creneaux: string[]
}

const niveaux = [
  { value: "debutant", label: "Debutant complet" },
  { value: "quelques-lecons", label: "Quelques lecons deja faites" },
  { value: "reprise", label: "Reprise apres interruption" },
  { value: "echec-examen", label: "Echec a l'examen" },
]

const typesPermis = [
  { value: "B", label: "B — Voiture" },
  { value: "A", label: "A — Moto" },
  { value: "BE", label: "BE — Remorque" },
]

const boitesVitesses = [
  { value: "manuelle", label: "Manuelle" },
  { value: "automatique", label: "Automatique" },
  { value: "indifferent", label: "Indifferent" },
]

const specialitesOptions = [
  { value: "anxieux", label: "Eleve anxieux" },
  { value: "accompagnee", label: "Conduite accompagnee" },
  { value: "autoroute", label: "Conduite sur autoroute" },
  { value: "examen", label: "Preparation examen" },
  { value: "nuit", label: "Conduite de nuit" },
  { value: "seniors", label: "Seniors" },
]

const rayons = [
  { value: "5", label: "5 km" },
  { value: "10", label: "10 km" },
  { value: "15", label: "15 km" },
  { value: "20+", label: "20 km+" },
]

const creneauxOptions = [
  { value: "matin-semaine", label: "Matin semaine" },
  { value: "aprem-semaine", label: "Apres-midi semaine" },
  { value: "soir-semaine", label: "Soir semaine" },
  { value: "samedi", label: "Samedi" },
  { value: "dimanche", label: "Dimanche" },
]

export default function InscriptionPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<FormData>({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    niveau: "",
    typePermis: "",
    boiteVitesses: "",
    specialites: [],
    budget: 50,
    zone: "",
    rayon: "",
    creneaux: [],
  })

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const toggleArrayField = (field: "specialites" | "creneaux", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }))
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.prenom.trim()) newErrors.prenom = "Prenom requis"
    if (!formData.nom.trim()) newErrors.nom = "Nom requis"
    if (!formData.email.trim()) newErrors.email = "Email requis"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email invalide"
    if (!formData.telephone.trim()) newErrors.telephone = "Telephone requis"
    if (!formData.password) newErrors.password = "Mot de passe requis"
    else if (formData.password.length < 8) newErrors.password = "Minimum 8 caracteres"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.niveau) newErrors.niveau = "Selectionnez votre niveau"
    if (!formData.typePermis) newErrors.typePermis = "Selectionnez un type de permis"
    if (!formData.boiteVitesses) newErrors.boiteVitesses = "Selectionnez une preference"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.zone.trim()) newErrors.zone = "Entrez une ville ou code postal"
    if (!formData.rayon) newErrors.rayon = "Selectionnez un rayon"
    if (formData.creneaux.length === 0) newErrors.creneaux = "Selectionnez au moins un creneau"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep3()) return
    setLoading(true)
    setError(null)

    // 1. Créer le compte auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (authError || !authData.user) {
      setError(authError?.message || "Erreur lors de la création du compte.")
      setLoading(false)
      return
    }

    const userId = authData.user.id

    // 2. Créer le profil
    await supabase.from("profiles").insert({
      id: userId,
      role: "eleve",
      prenom: formData.prenom,
      nom: formData.nom,
      telephone: formData.telephone,
    })

    // 3. Créer le profil élève
    await supabase.from("eleves").insert({
      user_id: userId,
      niveau: formData.niveau,
      type_permis: formData.typePermis,
      zone_recherche: formData.zone,
      budget_max: formData.budget,
      specialites: formData.specialites,
      creneaux: formData.creneaux,
    })

    router.push("/dashboard")
  }

  const steps = [
    { num: 1, label: "Informations personnelles" },
    { num: 2, label: "Vos besoins" },
    { num: 3, label: "Disponibilites" },
  ]

  return (
    <div className="font-sans text-foreground min-h-screen">
      <Navbar />

      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(0,245,160,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(0,212,255,0.06)_0%,transparent_60%)]" />
      </div>

      <main className="relative z-10 pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              Inscrivez-vous en tant{" "}
              <span className="bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] bg-clip-text text-transparent">qu&apos;eleve</span>
            </h1>
            <p className="text-muted-foreground">
              Trouvez le moniteur ideal en quelques etapes
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step === s.num
                        ? "bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background"
                        : step > s.num
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-card border-2 border-border text-muted-foreground"
                    }`}
                  >
                    {step > s.num ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.num
                    )}
                  </div>
                  <span className={`text-xs mt-2 hidden sm:block ${step >= s.num ? "text-foreground" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-16 md:w-24 h-0.5 mx-2 ${step > s.num ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-3xl p-8 md:p-10">
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6">Informations personnelles</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Prenom</label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => updateField("prenom", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.prenom ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none transition-colors`}
                      placeholder="Jean"
                    />
                    {errors.prenom && <p className="text-destructive text-xs mt-1">{errors.prenom}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom</label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => updateField("nom", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.nom ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none transition-colors`}
                      placeholder="Dupont"
                    />
                    {errors.nom && <p className="text-destructive text-xs mt-1">{errors.nom}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.email ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none transition-colors`}
                    placeholder="jean.dupont@email.com"
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Telephone</label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => updateField("telephone", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.telephone ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none transition-colors`}
                    placeholder="06 12 34 56 78"
                  />
                  {errors.telephone && <p className="text-destructive text-xs mt-1">{errors.telephone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mot de passe</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.password ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none transition-colors`}
                    placeholder="Minimum 8 caracteres"
                  />
                  {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.confirmPassword ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none transition-colors`}
                    placeholder="Repetez votre mot de passe"
                  />
                  {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold mb-6">Vos besoins</h2>

                <div>
                  <label className="block text-sm font-medium mb-3">Niveau actuel</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {niveaux.map((n) => (
                      <button
                        key={n.value}
                        type="button"
                        onClick={() => updateField("niveau", n.value)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                          formData.niveau === n.value
                            ? "bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background"
                            : "bg-background border border-border hover:border-primary/50"
                        }`}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                  {errors.niveau && <p className="text-destructive text-xs mt-2">{errors.niveau}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Type de permis souhaite</label>
                  <div className="flex flex-wrap gap-3">
                    {typesPermis.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => updateField("typePermis", t.value)}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                          formData.typePermis === t.value
                            ? "bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background"
                            : "bg-background border border-border hover:border-primary/50"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  {errors.typePermis && <p className="text-destructive text-xs mt-2">{errors.typePermis}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Boite de vitesses preferee</label>
                  <div className="flex flex-wrap gap-3">
                    {boitesVitesses.map((b) => (
                      <button
                        key={b.value}
                        type="button"
                        onClick={() => updateField("boiteVitesses", b.value)}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                          formData.boiteVitesses === b.value
                            ? "bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background"
                            : "bg-background border border-border hover:border-primary/50"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                  {errors.boiteVitesses && <p className="text-destructive text-xs mt-2">{errors.boiteVitesses}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Specialites recherchees</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {specialitesOptions.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => toggleArrayField("specialites", s.value)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all flex items-center gap-2 ${
                          formData.specialites.includes(s.value)
                            ? "bg-primary/20 border-2 border-primary text-primary"
                            : "bg-background border border-border hover:border-primary/50"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                          formData.specialites.includes(s.value) ? "bg-primary border-primary" : "border-muted-foreground"
                        }`}>
                          {formData.specialites.includes(s.value) && (
                            <svg className="w-3 h-3 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Budget par lecon : <span className="text-primary font-bold">{formData.budget} EUR</span>
                  </label>
                  <div className="relative pt-2">
                    <input
                      type="range"
                      min="30"
                      max="90"
                      value={formData.budget}
                      onChange={(e) => updateField("budget", parseInt(e.target.value))}
                      className="w-full h-2 bg-background border border-border rounded-lg appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #00F5A0 0%, #00D4FF ${((formData.budget - 30) / 60) * 100}%, var(--background) ${((formData.budget - 30) / 60) * 100}%, var(--background) 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>30 EUR</span>
                      <span>90 EUR</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold mb-6">Disponibilites et zone</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Zone de conduite</label>
                  <input
                    type="text"
                    value={formData.zone}
                    onChange={(e) => updateField("zone", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.zone ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none transition-colors`}
                    placeholder="Ville ou code postal (ex: Paris, 75001)"
                  />
                  {errors.zone && <p className="text-destructive text-xs mt-1">{errors.zone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Rayon maximum</label>
                  <div className="flex flex-wrap gap-3">
                    {rayons.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => updateField("rayon", r.value)}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                          formData.rayon === r.value
                            ? "bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background"
                            : "bg-background border border-border hover:border-primary/50"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                  {errors.rayon && <p className="text-destructive text-xs mt-2">{errors.rayon}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Creneaux souhaites</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {creneauxOptions.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => toggleArrayField("creneaux", c.value)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all flex items-center gap-2 ${
                          formData.creneaux.includes(c.value)
                            ? "bg-primary/20 border-2 border-primary text-primary"
                            : "bg-background border border-border hover:border-primary/50"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                          formData.creneaux.includes(c.value) ? "bg-primary border-primary" : "border-muted-foreground"
                        }`}>
                          {formData.creneaux.includes(c.value) && (
                            <svg className="w-3 h-3 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {c.label}
                      </button>
                    ))}
                  </div>
                  {errors.creneaux && <p className="text-destructive text-xs mt-2">{errors.creneaux}</p>}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-10">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex-1 px-6 py-3.5 rounded-xl text-sm font-semibold bg-transparent text-foreground border border-border hover:border-primary hover:text-primary transition-all"
                >
                  Precedent
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:shadow-[0_8px_30px_rgba(0,245,160,0.3)] hover:-translate-y-0.5 transition-all"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-[#00F5A0] to-[#00D4FF] text-background hover:shadow-[0_8px_30px_rgba(0,245,160,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Trouver mon moniteur
                </button>
              )}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            En vous inscrivant, vous acceptez nos conditions d&apos;utilisation et notre politique de confidentialite.
          </p>
        </div>
      </main>
    </div>
  )
}