"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import { NavBar, TopBar } from "@/components/levfit/nav-bar"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { CyberInput } from "@/components/ui/cyber-input"
import { ProgressRing } from "@/components/ui/progress-ring"
import { Plus, Apple, X, Zap, Flame } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Meal } from "@/lib/user-store"
import { cn } from "@/lib/utils"

const mealSuggestions = [
  { name: "Café da manhã saudável", calories: 350, protein: 20, carbs: 45, fat: 12 },
  { name: "Frango grelhado com arroz", calories: 450, protein: 35, carbs: 50, fat: 10 },
  { name: "Salada de atum", calories: 280, protein: 25, carbs: 15, fat: 14 },
  { name: "Shake proteico", calories: 200, protein: 30, carbs: 10, fat: 5 },
  { name: "Omelete com vegetais", calories: 320, protein: 22, carbs: 8, fat: 20 },
  { name: "Iogurte com granola", calories: 250, protein: 12, carbs: 38, fat: 6 },
  { name: "Batata doce com atum", calories: 380, protein: 28, carbs: 52, fat: 6 },
  { name: "Wrap integral de frango", calories: 420, protein: 32, carbs: 45, fat: 11 },
]

const macroColors = {
  protein: { bar: "bg-blue-400", text: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  carbs: { bar: "bg-amber-400", text: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  fat: { bar: "bg-rose-400", text: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/20" },
}

export default function NutritionPage() {
  const router = useRouter()
  const { user, meals, addMeal, earnXP, todayProgress } = useApp()
  const [showAddMeal, setShowAddMeal] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [newMeal, setNewMeal] = React.useState({
    name: "", calories: "", protein: "", carbs: "", fat: "",
  })

  React.useEffect(() => {
    if (!user) router.push("/login")
  }, [user, router])

  if (!user) return <main className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></main>

  // Filtra só as refeições de hoje
  const today = new Date().toISOString().split("T")[0]
  const todayMeals = meals.filter((m) => m.date === today)

  // Metas do plano personalizado ou padrão
  const savedPlan = typeof window !== "undefined" ? localStorage.getItem("personal_plan") : null
  const plan = savedPlan ? JSON.parse(savedPlan) : null
  const dailyTargets = {
    calories: plan?.estimatedCalories ?? 2000,
    protein: plan ? Math.round(plan.estimatedCalories * plan.macroSplit.protein / 100 / 4) : 150,
    carbs: plan ? Math.round(plan.estimatedCalories * plan.macroSplit.carbs / 100 / 4) : 250,
    fat: plan ? Math.round(plan.estimatedCalories * plan.macroSplit.fat / 100 / 9) : 65,
  }

  const totals = todayMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.calories) return

    const meal: Meal = {
      id: crypto.randomUUID(),
      name: newMeal.name,
      calories: Number(newMeal.calories),
      protein: Number(newMeal.protein) || 0,
      carbs: Number(newMeal.carbs) || 0,
      fat: Number(newMeal.fat) || 0,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      date: today,
    }

    // Salva via contexto global — sincroniza com dashboard e relatórios
    addMeal(meal)
    earnXP(25)

    setNewMeal({ name: "", calories: "", protein: "", carbs: "", fat: "" })
    setShowAddMeal(false)
  }

  const handleQuickAdd = (suggestion: typeof mealSuggestions[0]) => {
    const meal: Meal = {
      id: crypto.randomUUID(),
      name: suggestion.name,
      calories: suggestion.calories,
      protein: suggestion.protein,
      carbs: suggestion.carbs,
      fat: suggestion.fat,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      date: today,
    }

    addMeal(meal)
    earnXP(25)
    setShowSuggestions(false)
  }

  const caloriasRestantes = Math.max(0, dailyTargets.calories - totals.calories)
  const caloriasPercent = Math.min((totals.calories / dailyTargets.calories) * 100, 100)

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-20">
      <TopBar />

      <div className="max-w-lg mx-auto p-4 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Apple className="w-6 h-6 text-accent" />
              Nutrição
            </h1>
            <p className="text-muted-foreground text-sm">
              {plan ? "Metas do seu plano personalizado" : "Metas diárias padrão"}
            </p>
          </div>
          <button onClick={() => router.push("/dashboard")} className="p-2 rounded-lg hover:bg-muted/50">×</button>
        </div>

        {/* Calorias principais */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <ProgressRing
                value={caloriasPercent}
                size={88}
                color="gold"
                showValue={false}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-accent">{totals.calories}</span>
                <span className="text-[10px] text-muted-foreground">kcal</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold mb-1">Calorias hoje</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Meta:</span>
                  <span className="font-medium text-foreground">{dailyTargets.calories} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span>Consumido:</span>
                  <span className="font-medium text-accent">{totals.calories} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span>Restante:</span>
                  <span className={cn("font-medium", caloriasRestantes === 0 ? "text-green-400" : "text-foreground")}>
                    {caloriasRestantes} kcal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-2">
          {(["protein", "carbs", "fat"] as const).map((macro) => {
            const labels = { protein: "Proteína", carbs: "Carboidratos", fat: "Gordura" }
            const percent = Math.min((totals[macro] / dailyTargets[macro]) * 100, 100)
            return (
              <div key={macro} className={cn("rounded-2xl border p-3", macroColors[macro].bg)}>
                <p className="text-xs text-muted-foreground mb-1">{labels[macro]}</p>
                <p className={cn("text-lg font-bold", macroColors[macro].text)}>{totals[macro]}g</p>
                <p className="text-xs text-muted-foreground">/ {dailyTargets[macro]}g</p>
                <div className="mt-2 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", macroColors[macro].bar)}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Botões de ação */}
        <div className="grid grid-cols-2 gap-3">
          <NeonButton
            variant="gold"
            onClick={() => setShowAddMeal(true)}
            className="flex items-center justify-center gap-2 py-3"
          >
            <Plus className="w-4 h-4" />
            Adicionar Refeição
          </NeonButton>
          <NeonButton
            variant="ghost"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="flex items-center justify-center gap-2 py-3"
          >
            <Zap className="w-4 h-4" />
            Sugestões Rápidas
          </NeonButton>
        </div>

        {/* Sugestões rápidas */}
        {showSuggestions && (
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Adicionar rápido</h3>
              <button onClick={() => setShowSuggestions(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {mealSuggestions.map((s) => (
                <button
                  key={s.name}
                  onClick={() => handleQuickAdd(s)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">P: {s.protein}g · C: {s.carbs}g · G: {s.fat}g</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-bold text-accent">{s.calories}</p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Modal adicionar refeição */}
        {showAddMeal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-card border border-border/50 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Nova Refeição</h3>
                <button onClick={() => setShowAddMeal(false)} className="p-1 rounded-lg hover:bg-muted/50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <CyberInput
                label="Nome da refeição"
                placeholder="Ex: Frango com arroz"
                value={newMeal.name}
                onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              />
              <CyberInput
                label="Calorias (kcal)"
                type="number"
                placeholder="Ex: 450"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                icon={<Flame className="w-4 h-4" />}
              />
              <div className="grid grid-cols-3 gap-2">
                <CyberInput
                  label="Proteína (g)"
                  type="number"
                  placeholder="0"
                  value={newMeal.protein}
                  onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                />
                <CyberInput
                  label="Carboidratos (g)"
                  type="number"
                  placeholder="0"
                  value={newMeal.carbs}
                  onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                />
                <CyberInput
                  label="Gordura (g)"
                  type="number"
                  placeholder="0"
                  value={newMeal.fat}
                  onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <NeonButton variant="ghost" onClick={() => setShowAddMeal(false)}>
                  Cancelar
                </NeonButton>
                <NeonButton
                  variant="gold"
                  onClick={handleAddMeal}
                  disabled={!newMeal.name || !newMeal.calories}
                >
                  Salvar +25 XP
                </NeonButton>
              </div>
            </div>
          </div>
        )}

        {/* Lista de refeições de hoje */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">
            Refeições de hoje ({todayMeals.length})
          </h2>

          {todayMeals.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground/50">
              <Apple className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">Nenhuma refeição registrada hoje</p>
              <p className="text-xs mt-1">Adicione sua primeira refeição acima</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...todayMeals].reverse().map((meal) => (
                <GlassCard key={meal.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{meal.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        P: {meal.protein}g · C: {meal.carbs}g · G: {meal.fat}g · {meal.time}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="font-bold text-accent text-sm">{meal.calories}</p>
                      <p className="text-xs text-muted-foreground">kcal</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

      </div>
      <NavBar />
    </div>
  )
}
