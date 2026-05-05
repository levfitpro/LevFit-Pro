"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import { NavBar, TopBar } from "@/components/levfit/nav-bar"
import { GlassCard } from "@/components/ui/glass-card"
import { XPBar } from "@/components/ui/xp-bar"
import { Crown, Lock, CheckCircle2, Star, Zap, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { saveUser } from "@/lib/user-store"

// Definição de todas as conquistas possíveis
const ALL_ACHIEVEMENTS = [
  // Treinos
  { id: "first_workout", title: "Primeiro Passo", description: "Complete seu primeiro treino", icon: "🏃", xp: 100, category: "Treino" },
  { id: "workouts_5", title: "Guerreiro", description: "Complete 5 treinos", icon: "💪", xp: 200, category: "Treino" },
  { id: "workouts_10", title: "Dedicado", description: "Complete 10 treinos", icon: "🔥", xp: 300, category: "Treino" },
  { id: "workouts_25", title: "Atleta", description: "Complete 25 treinos", icon: "🏋️", xp: 500, category: "Treino" },
  { id: "workouts_50", title: "Campeão", description: "Complete 50 treinos", icon: "🏆", xp: 1000, category: "Treino" },
  // Streak
  { id: "streak_3", title: "Sequência Inicial", description: "3 dias seguidos treinando", icon: "📅", xp: 150, category: "Sequência" },
  { id: "streak_7", title: "Semana Perfeita", description: "7 dias seguidos treinando", icon: "🗓️", xp: 300, category: "Sequência" },
  { id: "streak_30", title: "Mês Imparável", description: "30 dias seguidos treinando", icon: "💎", xp: 1000, category: "Sequência" },
  // Calorias
  { id: "calories_1000", title: "Queima Inicial", description: "Queime 1.000 calorias no total", icon: "🔥", xp: 150, category: "Calorias" },
  { id: "calories_5000", title: "Fornalha", description: "Queime 5.000 calorias no total", icon: "☄️", xp: 400, category: "Calorias" },
  { id: "calories_10000", title: "Inferno", description: "Queime 10.000 calorias no total", icon: "🌋", xp: 800, category: "Calorias" },
  // Nutrição
  { id: "meals_5", title: "Nutrição Consciente", description: "Registre 5 refeições", icon: "🥗", xp: 100, category: "Nutrição" },
  { id: "meals_30", title: "Mestre Nutricional", description: "Registre 30 refeições", icon: "👨‍🍳", xp: 400, category: "Nutrição" },
  // Hidratação
  { id: "water_goal", title: "Hidratado", description: "Atinja a meta de água por 1 dia", icon: "💧", xp: 100, category: "Hidratação" },
  { id: "water_7days", title: "Fonte Viva", description: "Atinja a meta de água por 7 dias", icon: "🌊", xp: 350, category: "Hidratação" },
  // Nível
  { id: "level_2", title: "Evoluindo", description: "Alcance o nível 2", icon: "⬆️", xp: 0, category: "Nível" },
  { id: "level_5", title: "Lendário", description: "Alcance o nível 5", icon: "⚡", xp: 0, category: "Nível" },
  { id: "level_10", title: "Mestre", description: "Alcance o nível 10", icon: "👑", xp: 0, category: "Nível" },
  // Quiz
  { id: "quiz_done", title: "Autoconhecimento", description: "Complete o quiz biológico", icon: "🧬", xp: 200, category: "Especial" },
  // Desafios
  { id: "challenges_5", title: "Aceitador de Desafios", description: "Complete 5 desafios diários", icon: "🎯", xp: 250, category: "Desafios" },
]

function checkUnlocked(achievementId: string, stats: {
  totalWorkouts: number
  streak: number
  totalCalories: number
  totalMeals: number
  waterGoalDays: number
  level: number
  quizDone: boolean
  challengesCompleted: number
}): boolean {
  switch (achievementId) {
    case "first_workout": return stats.totalWorkouts >= 1
    case "workouts_5": return stats.totalWorkouts >= 5
    case "workouts_10": return stats.totalWorkouts >= 10
    case "workouts_25": return stats.totalWorkouts >= 25
    case "workouts_50": return stats.totalWorkouts >= 50
    case "streak_3": return stats.streak >= 3
    case "streak_7": return stats.streak >= 7
    case "streak_30": return stats.streak >= 30
    case "calories_1000": return stats.totalCalories >= 1000
    case "calories_5000": return stats.totalCalories >= 5000
    case "calories_10000": return stats.totalCalories >= 10000
    case "meals_5": return stats.totalMeals >= 5
    case "meals_30": return stats.totalMeals >= 30
    case "water_goal": return stats.waterGoalDays >= 1
    case "water_7days": return stats.waterGoalDays >= 7
    case "level_2": return stats.level >= 2
    case "level_5": return stats.level >= 5
    case "level_10": return stats.level >= 10
    case "quiz_done": return stats.quizDone
    case "challenges_5": return stats.challengesCompleted >= 5
    default: return false
  }
}

function getProgress(achievementId: string, stats: ReturnType<typeof buildStats>): { current: number; target: number } {
  switch (achievementId) {
    case "first_workout": return { current: Math.min(stats.totalWorkouts, 1), target: 1 }
    case "workouts_5": return { current: Math.min(stats.totalWorkouts, 5), target: 5 }
    case "workouts_10": return { current: Math.min(stats.totalWorkouts, 10), target: 10 }
    case "workouts_25": return { current: Math.min(stats.totalWorkouts, 25), target: 25 }
    case "workouts_50": return { current: Math.min(stats.totalWorkouts, 50), target: 50 }
    case "streak_3": return { current: Math.min(stats.streak, 3), target: 3 }
    case "streak_7": return { current: Math.min(stats.streak, 7), target: 7 }
    case "streak_30": return { current: Math.min(stats.streak, 30), target: 30 }
    case "calories_1000": return { current: Math.min(stats.totalCalories, 1000), target: 1000 }
    case "calories_5000": return { current: Math.min(stats.totalCalories, 5000), target: 5000 }
    case "calories_10000": return { current: Math.min(stats.totalCalories, 10000), target: 10000 }
    case "meals_5": return { current: Math.min(stats.totalMeals, 5), target: 5 }
    case "meals_30": return { current: Math.min(stats.totalMeals, 30), target: 30 }
    case "water_goal": return { current: Math.min(stats.waterGoalDays, 1), target: 1 }
    case "water_7days": return { current: Math.min(stats.waterGoalDays, 7), target: 7 }
    case "level_2": return { current: Math.min(stats.level, 2), target: 2 }
    case "level_5": return { current: Math.min(stats.level, 5), target: 5 }
    case "level_10": return { current: Math.min(stats.level, 10), target: 10 }
    case "quiz_done": return { current: stats.quizDone ? 1 : 0, target: 1 }
    case "challenges_5": return { current: Math.min(stats.challengesCompleted, 5), target: 5 }
    default: return { current: 0, target: 1 }
  }
}

function buildStats(completedWorkouts: any[], meals: any[], user: any) {
  const totalCalories = completedWorkouts.reduce((s, w) => s + (w.caloriesBurned || w.calories || 0), 0)
  const challenges = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("levfit_daily_challenges") || "[]") : []
  const challengesCompleted = challenges.filter((c: any) => c.completed).length
  const waterGoalDays = typeof window !== "undefined" ? parseInt(localStorage.getItem("water_goal_days") || "0") : 0
  const quizDone = typeof window !== "undefined" && !!localStorage.getItem("biology_profile")

  return {
    totalWorkouts: completedWorkouts.length,
    streak: user?.streak || 0,
    totalCalories,
    totalMeals: meals.length,
    waterGoalDays,
    level: user?.level || 1,
    quizDone,
    challengesCompleted,
  }
}

const categoryColors: Record<string, string> = {
  "Treino": "text-secondary border-secondary/20 bg-secondary/5",
  "Sequência": "text-orange-400 border-orange-400/20 bg-orange-400/5",
  "Calorias": "text-red-400 border-red-400/20 bg-red-400/5",
  "Nutrição": "text-green-400 border-green-400/20 bg-green-400/5",
  "Hidratação": "text-blue-400 border-blue-400/20 bg-blue-400/5",
  "Nível": "text-purple-400 border-purple-400/20 bg-purple-400/5",
  "Especial": "text-accent border-accent/20 bg-accent/5",
  "Desafios": "text-yellow-400 border-yellow-400/20 bg-yellow-400/5",
}

const categories = ["Todos", "Treino", "Sequência", "Calorias", "Nutrição", "Hidratação", "Nível", "Desafios", "Especial"]

export default function AchievementsPage() {
  const router = useRouter()
  const { user, completedWorkouts, meals } = useApp()
  const [selectedCategory, setSelectedCategory] = React.useState("Todos")
  const [newlyUnlocked, setNewlyUnlocked] = React.useState<string[]>([])

  const stats = React.useMemo(() => {
    if (!user) return null
    return buildStats(completedWorkouts, meals, user)
  }, [user, completedWorkouts, meals])

  // Verifica e credita XP de conquistas novas
  React.useEffect(() => {
    if (!user || !stats) return
    const unlockedIds: string[] = JSON.parse(localStorage.getItem("unlocked_achievements") || "[]")
    const newOnes: string[] = []

    ALL_ACHIEVEMENTS.forEach((ach) => {
      const isUnlocked = checkUnlocked(ach.id, stats)
      if (isUnlocked && !unlockedIds.includes(ach.id)) {
        newOnes.push(ach.id)
        unlockedIds.push(ach.id)
      }
    })

    if (newOnes.length > 0) {
      localStorage.setItem("unlocked_achievements", JSON.stringify(unlockedIds))
      setNewlyUnlocked(newOnes)
      setTimeout(() => setNewlyUnlocked([]), 4000)
    }
  }, [user, stats])

  if (!user || !stats) return null

  const unlockedIds: string[] = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("unlocked_achievements") || "[]") : []
  const unlockedCount = unlockedIds.length
  const totalCount = ALL_ACHIEVEMENTS.length

  const filtered = selectedCategory === "Todos"
    ? ALL_ACHIEVEMENTS
    : ALL_ACHIEVEMENTS.filter((a) => a.category === selectedCategory)

  const sorted = [...filtered].sort((a, b) => {
    const aUnlocked = checkUnlocked(a.id, stats)
    const bUnlocked = checkUnlocked(b.id, stats)
    if (aUnlocked && !bUnlocked) return -1
    if (!aUnlocked && bUnlocked) return 1
    return 0
  })

  return (
    <main className="min-h-screen pb-24 pt-20">
      <TopBar />

      {/* Notificação de conquista nova */}
      {newlyUnlocked.length > 0 && (
        <div className="fixed top-20 left-0 right-0 z-50 flex justify-center px-4">
          <div className="bg-accent text-background px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-bounce">
            <Trophy className="w-5 h-5" />
            <span className="font-bold text-sm">
              {newlyUnlocked.length === 1
                ? `Conquista desbloqueada: ${ALL_ACHIEVEMENTS.find(a => a.id === newlyUnlocked[0])?.title}!`
                : `${newlyUnlocked.length} conquistas desbloqueadas!`}
            </span>
          </div>
        </div>
      )}

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-accent" />
              Conquistas
            </h1>
            <p className="text-muted-foreground text-sm">{unlockedCount} de {totalCount} desbloqueadas</p>
          </div>
          <button onClick={() => router.push("/dashboard")} className="p-2 rounded-lg hover:bg-muted/50">×</button>
        </div>

        {/* Card de nível */}
        <GlassCard variant="neon" neonColor="gold">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
              <Crown className="w-8 h-8 text-background" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Seu nível atual</p>
              <p className="text-3xl font-bold text-accent">Nível {user.level}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-secondary">{user.xp}</p>
              <p className="text-xs text-muted-foreground">XP Total</p>
            </div>
          </div>
          <XPBar xp={user.xp} level={user.level} />
        </GlassCard>

        {/* Barra de progresso geral */}
        <GlassCard className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Progresso geral</span>
            <span className="text-sm text-accent font-bold">{Math.round((unlockedCount / totalCount) * 100)}%</span>
          </div>
          <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-secondary rounded-full transition-all duration-700"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div>
              <p className="text-lg font-bold text-secondary">{stats.totalWorkouts}</p>
              <p className="text-xs text-muted-foreground">Treinos</p>
            </div>
            <div>
              <p className="text-lg font-bold text-orange-400">{user.streak}</p>
              <p className="text-xs text-muted-foreground">Dias seguidos</p>
            </div>
            <div>
              <p className="text-lg font-bold text-accent">{stats.totalCalories}</p>
              <p className="text-xs text-muted-foreground">Kcal queimadas</p>
            </div>
          </div>
        </GlassCard>

        {/* Filtro por categoria */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0",
                selectedCategory === cat
                  ? "bg-secondary text-background"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lista de conquistas */}
        <div className="space-y-2">
          {sorted.map((ach) => {
            const unlocked = checkUnlocked(ach.id, stats)
            const prog = getProgress(ach.id, stats)
            const percent = (prog.current / prog.target) * 100
            const isNew = newlyUnlocked.includes(ach.id)

            return (
              <div
                key={ach.id}
                className={cn(
                  "rounded-2xl border p-4 transition-all duration-300",
                  unlocked
                    ? cn("border", categoryColors[ach.category] || "border-secondary/20 bg-secondary/5")
                    : "border-border/30 bg-muted/10",
                  isNew && "ring-2 ring-accent animate-pulse"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0",
                    unlocked ? "bg-background/50" : "bg-muted/20 grayscale opacity-50"
                  )}>
                    {ach.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={cn("font-semibold text-sm", !unlocked && "text-muted-foreground")}>
                        {ach.title}
                      </p>
                      {unlocked
                        ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        : <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">{ach.description}</p>
                    {ach.xp > 0 && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-accent">
                        <Zap className="w-3 h-3" />
                        <span>+{ach.xp} XP</span>
                      </div>
                    )}
                    {!unlocked && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{prog.current} / {prog.target}</span>
                          <span>{Math.round(percent)}%</span>
                        </div>
                        <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-secondary/50 rounded-full transition-all"
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <NavBar />
    </main>
  )
}