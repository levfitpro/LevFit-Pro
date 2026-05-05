"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TopBar, NavBar } from "@/components/levfit/nav-bar"
import { GlassCard } from "@/components/ui/glass-card"
import { Calculator, ChevronRight, Flame, Apple, Zap, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormData {
  weight: number
  height: number
  age: number
  gender: "M" | "F"
  activityLevel: "sedentário" | "leve" | "moderado" | "muito ativo" | "extremo"
  goal: "perda" | "manutenção" | "ganho"
}

interface Result {
  tmb: number
  tdee: number
  target: number
  protein: number
  carbs: number
  fat: number
  deficit: number
}

const activityOptions = [
  { value: "sedentário", label: "Sedentário", description: "Pouco ou nenhum exercício", multiplier: 1.2 },
  { value: "leve", label: "Levemente ativo", description: "1-3 dias/semana", multiplier: 1.375 },
  { value: "moderado", label: "Moderadamente ativo", description: "3-5 dias/semana", multiplier: 1.55 },
  { value: "muito ativo", label: "Muito ativo", description: "6-7 dias/semana", multiplier: 1.725 },
  { value: "extremo", label: "Extremamente ativo", description: "Atleta profissional", multiplier: 1.9 },
]

const goalOptions = [
  { value: "perda", label: "Perder gordura", emoji: "📉", adjustment: -500 },
  { value: "manutenção", label: "Manter peso", emoji: "⚖️", adjustment: 0 },
  { value: "ganho", label: "Ganhar massa", emoji: "📈", adjustment: 300 },
]

function calculateTMB(data: FormData): number {
  if (data.gender === "M") {
    return 88.36 + (13.4 * data.weight) + (4.8 * data.height) - (5.7 * data.age)
  }
  return 447.6 + (9.2 * data.weight) + (3.1 * data.height) - (4.3 * data.age)
}

function calculate(data: FormData): Result {
  const activity = activityOptions.find((a) => a.value === data.activityLevel)!
  const goal = goalOptions.find((g) => g.value === data.goal)!

  const tmb = Math.round(calculateTMB(data))
  const tdee = Math.round(tmb * activity.multiplier)
  const target = Math.max(1200, tdee + goal.adjustment)

  const protein = Math.round(data.weight * (data.goal === "ganho" ? 2.2 : 1.8))
  const fat = Math.round(target * 0.25 / 9)
  const carbs = Math.round((target - protein * 4 - fat * 9) / 4)
  const deficit = tdee - target

  return { tmb, tdee, target, protein, carbs: Math.max(0, carbs), fat, deficit }
}

export default function CalorieCalculatorPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    weight: 75, height: 170, age: 25, gender: "M",
    activityLevel: "moderado", goal: "manutenção",
  })
  const [result, setResult] = useState<Result | null>(null)
  const [savedToProfile, setSavedToProfile] = useState(false)

  useEffect(() => {
    // Tenta pré-preencher com dados do perfil do quiz
    const profile = localStorage.getItem("biology_profile")
    if (profile) {
      const p = JSON.parse(profile)
      const objetivo = p.answers[1] as string || ""
      if (objetivo.includes("Emagrecer")) setForm((f) => ({ ...f, goal: "perda" }))
      else if (objetivo.includes("Ganhar")) setForm((f) => ({ ...f, goal: "ganho" }))
    }

    // Carrega cálculo salvo
    const saved = localStorage.getItem("calorie_calc")
    if (saved) {
      const { formData, result: savedResult } = JSON.parse(saved)
      setForm(formData)
      setResult(savedResult)
    }
  }, [])

  const handleCalculate = () => {
    const res = calculate(form)
    setResult(res)
    localStorage.setItem("calorie_calc", JSON.stringify({ formData: form, result: res }))
    setSavedToProfile(false)
  }

  const handleSaveToProfile = () => {
    if (!result) return
    const plan = localStorage.getItem("personal_plan")
    if (plan) {
      const p = JSON.parse(plan)
      p.estimatedCalories = result.target
      p.macroSplit = {
        protein: Math.round(result.protein * 4 / result.target * 100),
        carbs: Math.round(result.carbs * 4 / result.target * 100),
        fat: Math.round(result.fat * 9 / result.target * 100),
      }
      localStorage.setItem("personal_plan", JSON.stringify(p))
    }
    setSavedToProfile(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-20">
      <TopBar />

      <div className="max-w-lg mx-auto p-4 space-y-4">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calculator className="w-6 h-6 text-secondary" />
              Calculadora de Calorias
            </h1>
            <p className="text-muted-foreground text-sm">Calcule suas necessidades diárias</p>
          </div>
          <button onClick={() => router.push("/dashboard")} className="p-2 rounded-lg hover:bg-muted/50">×</button>
        </div>

        {/* Formulário */}
        <GlassCard className="p-4 space-y-4">

          {/* Gênero */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Sexo biológico</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ value: "M", label: "Masculino" }, { value: "F", label: "Feminino" }].map((g) => (
                <button
                  key={g.value}
                  onClick={() => setForm((f) => ({ ...f, gender: g.value as "M" | "F" }))}
                  className={cn(
                    "py-2.5 rounded-xl text-sm font-medium transition-all border",
                    form.gender === g.value
                      ? "bg-secondary/20 border-secondary/50 text-secondary"
                      : "border-border/50 text-muted-foreground hover:bg-muted/30"
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dados físicos */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "weight", label: "Peso (kg)", min: 40, max: 200 },
              { key: "height", label: "Altura (cm)", min: 140, max: 220 },
              { key: "age", label: "Idade", min: 15, max: 80 },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
                <input
                  type="number"
                  min={field.min}
                  max={field.max}
                  value={form[field.key as keyof FormData] as number}
                  onChange={(e) => setForm((f) => ({ ...f, [field.key]: Number(e.target.value) }))}
                  className="w-full bg-muted/30 border border-border/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-secondary/50 text-center font-semibold"
                />
              </div>
            ))}
          </div>

          {/* Nível de atividade */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Nível de atividade</label>
            <div className="space-y-2">
              {activityOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm((f) => ({ ...f, activityLevel: opt.value as FormData["activityLevel"] }))}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                    form.activityLevel === opt.value
                      ? "bg-secondary/10 border-secondary/40 text-secondary"
                      : "border-border/30 hover:bg-muted/30 text-foreground"
                  )}
                >
                  <div>
                    <p className="text-sm font-medium">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.description}</p>
                  </div>
                  {form.activityLevel === opt.value && (
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-background" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Objetivo */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Objetivo</label>
            <div className="grid grid-cols-3 gap-2">
              {goalOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm((f) => ({ ...f, goal: opt.value as FormData["goal"] }))}
                  className={cn(
                    "py-3 rounded-xl text-xs font-medium transition-all border flex flex-col items-center gap-1",
                    form.goal === opt.value
                      ? "bg-accent/20 border-accent/50 text-accent"
                      : "border-border/50 text-muted-foreground hover:bg-muted/30"
                  )}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-secondary to-accent text-background font-bold text-base flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calcular
          </button>
        </GlassCard>

        {/* Resultado */}
        {result && (
          <>
            <GlassCard className="p-5 border border-secondary/20">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-accent" />
                Suas necessidades diárias
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center bg-muted/20 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">TMB</p>
                  <p className="text-xl font-bold">{result.tmb}</p>
                  <p className="text-xs text-muted-foreground">kcal base</p>
                </div>
                <div className="text-center bg-muted/20 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">TDEE</p>
                  <p className="text-xl font-bold text-secondary">{result.tdee}</p>
                  <p className="text-xs text-muted-foreground">kcal total</p>
                </div>
                <div className="text-center bg-accent/10 border border-accent/20 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">META</p>
                  <p className="text-xl font-bold text-accent">{result.target}</p>
                  <p className="text-xs text-muted-foreground">kcal/dia</p>
                </div>
              </div>

              {result.deficit !== 0 && (
                <p className="text-sm text-center text-muted-foreground mb-4">
                  {result.deficit > 0
                    ? `Déficit de ${result.deficit} kcal/dia — perda de ~${(result.deficit * 7 / 7700).toFixed(1)}kg/semana`
                    : `Superávit de ${Math.abs(result.deficit)} kcal/dia — ganho controlado`}
                </p>
              )}

              {/* Macros */}
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Apple className="w-4 h-4 text-accent" />
                Distribuição de macros
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center bg-blue-400/10 border border-blue-400/20 rounded-xl p-3">
                  <p className="text-xl font-bold text-blue-400">{result.protein}g</p>
                  <p className="text-xs text-muted-foreground">Proteína</p>
                  <p className="text-xs text-blue-400">{Math.round(result.protein * 4 / result.target * 100)}%</p>
                </div>
                <div className="text-center bg-amber-400/10 border border-amber-400/20 rounded-xl p-3">
                  <p className="text-xl font-bold text-amber-400">{result.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Carboidratos</p>
                  <p className="text-xs text-amber-400">{Math.round(result.carbs * 4 / result.target * 100)}%</p>
                </div>
                <div className="text-center bg-rose-400/10 border border-rose-400/20 rounded-xl p-3">
                  <p className="text-xl font-bold text-rose-400">{result.fat}g</p>
                  <p className="text-xs text-muted-foreground">Gordura</p>
                  <p className="text-xs text-rose-400">{Math.round(result.fat * 9 / result.target * 100)}%</p>
                </div>
              </div>
            </GlassCard>

            {/* Salvar no perfil */}
            <button
              onClick={handleSaveToProfile}
              className={cn(
                "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                savedToProfile
                  ? "bg-green-500/20 border border-green-500/40 text-green-400"
                  : "bg-secondary/20 border border-secondary/40 text-secondary hover:bg-secondary/30"
              )}
            >
              {savedToProfile ? "✓ Salvo no seu plano personalizado!" : (
                <><Zap className="w-4 h-4" />Usar esses valores no meu plano</>
              )}
            </button>

            <button
              onClick={() => router.push("/personal-plan")}
              className="w-full py-3 rounded-xl border border-border/50 text-muted-foreground text-sm hover:bg-muted/30 transition-colors flex items-center justify-center gap-1"
            >
              Ver meu plano personalizado <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      <NavBar />
    </div>
  )
}

