"use client"

import * as React from "react"
import {
  getUser,
  saveUser,
  getTodayProgress,
  updateProgress,
  getCompletedWorkouts,
  saveCompletedWorkout,
  getMeals,
  saveMeal,
  getDailyChallenges,
  saveDailyChallenge,
  completeDailyChallenge,
  addXP,
  type UserProfile,
  type DailyProgress,
  type CompletedWorkout,
  type Meal,
  type DailyChallenge,
} from "@/lib/user-store"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AppContextValue {
  user: UserProfile | null
  setUser: (user: UserProfile) => void
  refreshUser: () => void
  todayProgress: DailyProgress
  refreshProgress: () => void
  addWater: (ml: number) => void
  completedWorkouts: CompletedWorkout[]
  addCompletedWorkout: (workout: CompletedWorkout) => void
  meals: Meal[]
  addMeal: (meal: Meal) => void
  challenges: DailyChallenge[]
  completeChallenge: (id: string) => void
  refreshChallenges: () => void
  earnXP: (amount: number) => { leveledUp: boolean; newLevel: number }
  waterToday: number
  addWaterDirect: (ml: number) => void
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

const AppContext = React.createContext<AppContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = React.useState<UserProfile | null>(null)
  const [todayProgress, setTodayProgress] = React.useState<DailyProgress>(getTodayProgress())
  const [completedWorkouts, setCompletedWorkouts] = React.useState<CompletedWorkout[]>([])
  const [meals, setMeals] = React.useState<Meal[]>([])
  const [challenges, setChallenges] = React.useState<DailyChallenge[]>([])
  const [waterToday, setWaterToday] = React.useState(0)

  // Carrega tudo do localStorage na montagem
  React.useEffect(() => {
    const u = getUser()
    if (u) setUserState(u)

    const progress = getTodayProgress()
    setTodayProgress(progress)
    setWaterToday(progress.waterIntake)

    setCompletedWorkouts(getCompletedWorkouts())

    const today = new Date().toISOString().split("T")[0]

    // Carrega só refeições de hoje
    setMeals(getMeals().filter((m) => m.date === today))

    // Carrega ou gera desafios do dia
    const saved = getDailyChallenges().filter((c) => c.date === today)
    setChallenges(saved.length > 0 ? saved : getDefaultChallenges(today))

    // Salva data atual para detectar virada de dia
    localStorage.setItem("levfit_last_date", today)
  }, [])

  // ── Reset automático à meia-noite ─────────────────────────────────────────

  React.useEffect(() => {
    const checkNewDay = () => {
      const today = new Date().toISOString().split("T")[0]
      const lastDate = localStorage.getItem("levfit_last_date")

      if (lastDate && lastDate !== today) {
        // Novo dia! Reseta tudo
        localStorage.setItem("levfit_last_date", today)

        // Novos desafios
        const newChallenges = getDefaultChallenges(today)
        setChallenges(newChallenges)

        // Novo progresso diário
        const newProgress = getTodayProgress()
        setTodayProgress(newProgress)
        setWaterToday(0)

        // Limpa refeições do dia anterior da memória
        setMeals(getMeals().filter((m) => m.date === today))
      }
    }

    // Verifica a cada 1 minuto
    const interval = setInterval(checkNewDay, 60000)
    return () => clearInterval(interval)
  }, [])

  // ── Usuário ──────────────────────────────────────────────────────────────────

  const setUser = React.useCallback((u: UserProfile) => {
    saveUser(u)
    setUserState(u)
  }, [])

  const refreshUser = React.useCallback(() => {
    const u = getUser()
    if (u) setUserState(u)
  }, [])

  // ── Progresso ────────────────────────────────────────────────────────────────

  const refreshProgress = React.useCallback(() => {
    setTodayProgress(getTodayProgress())
  }, [])

  const addWater = React.useCallback((ml: number) => {
    setTodayProgress((prev) => {
      const newIntake = prev.waterIntake + ml
      updateProgress({ waterIntake: newIntake })
      setWaterToday(newIntake)
      return { ...prev, waterIntake: newIntake }
    })
  }, [])

  const addWaterDirect = React.useCallback((ml: number) => {
    setWaterToday((prev) => {
      const newVal = prev + ml
      updateProgress({ waterIntake: newVal })
      setTodayProgress((p) => ({ ...p, waterIntake: newVal }))
      return newVal
    })
  }, [])

  // ── Treinos ──────────────────────────────────────────────────────────────────

  const addCompletedWorkout = React.useCallback((workout: CompletedWorkout) => {
    saveCompletedWorkout(workout)
    setCompletedWorkouts((prev) => [...prev, workout])
    setTodayProgress((prev) => {
      const updated = {
        ...prev,
        workoutsCompleted: prev.workoutsCompleted + 1,
        caloriesBurned: prev.caloriesBurned + workout.caloriesBurned,
      }
      updateProgress(updated)
      return updated
    })
  }, [])

  // ── Refeições ────────────────────────────────────────────────────────────────

  const addMeal = React.useCallback((meal: Meal) => {
    saveMeal(meal)
    setMeals((prev) => [...prev, meal])
    setTodayProgress((prev) => {
      const updated = {
        ...prev,
        caloriesConsumed: prev.caloriesConsumed + meal.calories,
      }
      updateProgress(updated)
      return updated
    })
  }, [])

  // ── Desafios ─────────────────────────────────────────────────────────────────

  const completeChallenge = React.useCallback(
    (id: string) => {
      completeDailyChallenge(id)
      setChallenges((prev) =>
        prev.map((c) => (c.id === id ? { ...c, completed: true } : c))
      )
      refreshUser()
    },
    [refreshUser]
  )

  const refreshChallenges = React.useCallback(() => {
    const today = new Date().toISOString().split("T")[0]
    const saved = getDailyChallenges().filter((c) => c.date === today)
    setChallenges(saved.length > 0 ? saved : getDefaultChallenges(today))
  }, [])

  // ── XP ───────────────────────────────────────────────────────────────────────

  const earnXP = React.useCallback(
    (amount: number) => {
      const result = addXP(amount)
      refreshUser()
      return { leveledUp: result.leveledUp, newLevel: result.newLevel }
    },
    [refreshUser]
  )

  // ── Valor do contexto ────────────────────────────────────────────────────────

  const value = React.useMemo<AppContextValue>(
    () => ({
      user,
      setUser,
      refreshUser,
      todayProgress,
      refreshProgress,
      addWater,
      completedWorkouts,
      addCompletedWorkout,
      meals,
      addMeal,
      challenges,
      completeChallenge,
      refreshChallenges,
      earnXP,
      waterToday,
      addWaterDirect,
    }),
    [
      user, setUser, refreshUser,
      todayProgress, refreshProgress, addWater,
      completedWorkouts, addCompletedWorkout,
      meals, addMeal,
      challenges, completeChallenge, refreshChallenges,
      earnXP, waterToday, addWaterDirect,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = React.useContext(AppContext)
  if (!ctx) throw new Error("useApp deve ser usado dentro de <AppProvider>")
  return ctx
}

// ─── Desafios padrão do dia ───────────────────────────────────────────────────

function getDefaultChallenges(today: string): DailyChallenge[] {
  return [
    {
      id: "1", title: "Guerreiro Matinal",
      description: "Complete um treino antes das 8h",
      goal: 1, current: 0, xpReward: 150,
      difficulty: "médio", completed: false, type: "treino", date: today,
    },
    {
      id: "2", title: "Maratona de Água",
      description: "Beba 3 litros de água",
      goal: 3000, current: 0, xpReward: 100,
      difficulty: "fácil", completed: false, type: "hidratação", date: today,
    },
    {
      id: "3", title: "Noite de Descanso",
      description: "Durma 8 horas",
      goal: 8, current: 0, xpReward: 120,
      difficulty: "médio", completed: false, type: "sono", date: today,
    },
    {
      id: "4", title: "Hipertrofia Extrema",
      description: "Complete 50 repetições de musculação",
      goal: 50, current: 0, xpReward: 200,
      difficulty: "difícil", completed: false, type: "treino", date: today,
    },
    {
      id: "5", title: "Nutrição Limpa",
      description: "Coma 5 refeições saudáveis",
      goal: 5, current: 0, xpReward: 180,
      difficulty: "médio", completed: false, type: "nutrição", date: today,
    },
  ]
}

