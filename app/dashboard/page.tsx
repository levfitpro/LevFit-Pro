"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import { NavBar, TopBar } from "@/components/levfit/nav-bar"
import { GlassCard } from "@/components/ui/glass-card"
import { StatCard } from "@/components/ui/stat-card"
import { ProgressRing } from "@/components/ui/progress-ring"
import { XPBar } from "@/components/ui/xp-bar"
import { NeonButton } from "@/components/ui/neon-button"
import { Flame, Droplets, Moon, Dumbbell, Apple, ChevronRight, Zap, Target, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { AIAssistant } from "@/components/levfit/ai-assistant"
import { OnboardingModal } from "@/components/ui/onboarding-modal"
import { SuccessAnimation } from "@/components/ui/success-animation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function DashboardPage() {
  const router = useRouter()
  const { user, todayProgress, addWater, challenges, earnXP } = useApp()
  const [greeting, setGreeting] = React.useState("")
  const [showOnboarding, setShowOnboarding] = React.useState(false)
  const [successAnimation, setSuccessAnimation] = React.useState<{
    type: "xp" | "achievement" | "workout" | "challenge"
    message: string
  } | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (user === null) {
      // Dá um tempo para o contexto carregar do localStorage
      const timer = setTimeout(() => {
        const { getUser } = require("@/lib/user-store")
        if (!getUser()) router.push("/login")
        setLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    }
    setLoading(false)

    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Bom dia")
    else if (hour < 18) setGreeting("Boa tarde")
    else setGreeting("Boa noite")

    const hasSeenOnboarding = localStorage.getItem("has_seen_onboarding")
    if (!hasSeenOnboarding) setShowOnboarding(true)
  }, [user, router])

  const handleAddWater = () => {
    addWater(250)
    if (todayProgress.waterIntake + 250 >= 2000 && todayProgress.waterIntake < 2000) {
      earnXP(50)
      setSuccessAnimation({ type: "achievement", message: "+50 XP - Meta de hidratação atingida!" })
      setTimeout(() => setSuccessAnimation(null), 3000)
    }
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem("has_seen_onboarding", "true")
    setShowOnboarding(false)
  }

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </main>
    )
  }

  const xpPerLevel = 1000
  const currentLevelXP = user.xp % xpPerLevel
  const completedChallenges = challenges.filter((c) => c.completed).length

  const savedPlan = typeof window !== "undefined" ? localStorage.getItem("personal_plan") : null
  const plan = savedPlan ? JSON.parse(savedPlan) : null
  const caloriasMeta = plan?.estimatedCalories ?? 2000

  const dailyGoals = [
    {
      label: "Kcal Queimadas",
      current: todayProgress.caloriesBurned,
      goal: 500,
      color: "cyan" as const,
      icon: Flame,
    },
    {
      label: "Kcal Consumidas",
      current: todayProgress.caloriesConsumed,
      goal: caloriasMeta,
      color: "gold" as const,
      icon: Apple,
    },
    {
      label: "Água",
      current: todayProgress.waterIntake,
      goal: 2000,
      color: "cyan" as const,
      icon: Droplets,
      unit: "ml",
    },
  ]

  const quickActions = [
    { label: "Iniciar Treino", icon: Dumbbell, href: "/workouts", color: "cyan" },
    { label: "Registrar Refeição", icon: Apple, href: "/nutrition", color: "gold" },
  ]

  return (
    <main className="min-h-screen pb-24 pt-20">
      <TopBar />

      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      {successAnimation && (
        <SuccessAnimation
          type={successAnimation.type}
          message={successAnimation.message}
        />
      )}

      <AIAssistant />

      <div className="max-w-lg mx-auto px-4 space-y-4">
        {/* Saudação */}
        <div className="pt-2">
          <h1 className="text-2xl font-bold">
            {greeting}, <span className="text-secondary">{user.name.split(" ")[0]}</span>!
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Nível {user.level} · {user.streak} dias seguidos
          </p>
        </div>

        {/* XP Bar */}
        <XPBar xp={currentLevelXP} maxXP={xpPerLevel} level={user.level} />

        {/* Metas do dia */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Metas de Hoje</h2>
            <span className="text-xs text-muted-foreground">
              {completedChallenges}/{challenges.length} desafios
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {dailyGoals.map((goal) => (
              <div key={goal.label} className="flex flex-col items-center gap-2">
                <div className="relative w-[72px] h-[72px]">
                  <ProgressRing
                    value={Math.min((goal.current / goal.goal) * 100, 100)}
                    size={72}
                    color={goal.color}
                    showValue={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <goal.icon className="w-5 h-5 text-secondary" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium">{goal.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {goal.current}{goal.unit ?? ""} / {goal.goal}{goal.unit ?? ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddWater}
            className="mt-3 w-full text-sm text-secondary hover:underline flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" /> Adicionar 250ml de água
          </button>
        </GlassCard>

        {/* Ações rápidas */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <NeonButton
              key={action.label}
              color={action.color as "cyan" | "gold"}
              onClick={() => router.push(action.href)}
              className="flex items-center gap-2 justify-center py-3"
            >
              <action.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{action.label}</span>
            </NeonButton>
          ))}
        </div>

        {/* Stats rápidos */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Treinos este mês"
            value={todayProgress.workoutsCompleted}
            icon={<Dumbbell className="w-4 h-4" />}
          />
          <StatCard
            label="Kcal queimadas hoje"
            value={todayProgress.caloriesBurned}
            icon={<Flame className="w-4 h-4" />}
          />
        </div>

        {/* Links rápidos */}
        <GlassCard className="p-4 space-y-2">
          <h2 className="font-semibold mb-1">Acesso rápido</h2>
          {[
            { label: "Ver meu histórico", href: "/history", icon: Target },
            { label: "Desafios do dia", href: "/challenges", icon: Zap },
            { label: "Relatórios", href: "/reports", icon: ChevronRight },
            { label: "Meu plano personalizado", href: "/personal-plan", icon: ChevronRight },
          ].map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="w-full flex items-center justify-between py-2 px-1 rounded-lg hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm">
                <item.icon className="w-4 h-4 text-secondary" />
                {item.label}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </GlassCard>
      </div>

      <NavBar />
    </main>
  )
}





