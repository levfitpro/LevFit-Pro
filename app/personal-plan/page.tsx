"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TopBar, NavBar } from "@/components/levfit/nav-bar"
import { generatePersonalPlan, type PersonalPlan } from "@/services/personalization-engine"
import type { BiologyProfile } from "@/data/biology-quiz"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  Dumbbell, Apple, Droplets, Moon, Target, Trophy,
  AlertTriangle, Clock, ChevronRight, Star, Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function PersonalPlanPage() {
  const router = useRouter()
  const [plan, setPlan] = useState<PersonalPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("biology_profile")
      if (saved) {
        const profile: BiologyProfile = JSON.parse(saved)
        const generated = generatePersonalPlan(profile)
        setPlan(generated)
        setHasProfile(true)
        // Garante que o plano está salvo atualizado
        localStorage.setItem("personal_plan", JSON.stringify(generated))
      }
    } catch (e) {
      console.error("Erro ao carregar plano:", e)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground mt-4">Gerando seu plano personalizado...</p>
        </div>
      </main>
    )
  }

  // Sem perfil — pede para fazer o quiz
  if (!hasProfile || !plan) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
            <Target className="w-10 h-10 text-secondary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Nenhum perfil encontrado</h2>
            <p className="text-muted-foreground mt-2">
              Complete o quiz de 17 fatores biológicos para gerar seu plano 100% personalizado.
            </p>
          </div>
          <button
            onClick={() => router.push("/quiz/biology")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-secondary to-accent text-background font-semibold"
          >
            Fazer o Quiz Agora
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-xl border border-border/50 text-muted-foreground text-sm"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </main>
    )
  }

  const scoreColor = plan.score >= 70 ? "#1D9E75" : plan.score >= 40 ? "#EF9F27" : "#E24B4A"
  const scoreLabel = plan.score >= 70 ? "Excelente" : plan.score >= 40 ? "Bom" : "Precisa Melhorar"

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-20">
      <TopBar />

      <div className="max-w-lg mx-auto p-4 space-y-4">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Seu Plano Personalizado</h1>
          <p className="text-muted-foreground text-sm mt-1">Baseado nos seus 17 fatores biológicos</p>
        </div>

        {/* Score geral */}
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="var(--color-border-tertiary)" strokeWidth="7"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke={scoreColor} strokeWidth="7"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - plan.score / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold">{plan.score}</span>
              </div>
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: scoreColor }}>{scoreLabel}</p>
              <p className="text-sm text-muted-foreground">Pontuação geral de saúde</p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Seu plano foi gerado com base nas suas respostas sobre metabolismo, composição corporal, condicionamento, sono, nutrição e estresse.
              </p>
            </div>
          </div>
        </div>

        {/* Alertas importantes */}
        {plan.warnings.length > 0 && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4 space-y-2">
            <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Alertas do seu perfil
            </h3>
            {plan.warnings.map((w, i) => (
              <p key={i} className="text-sm text-red-300/90 pl-6">{w}</p>
            ))}
          </div>
        )}

        {/* Treino recomendado */}
        <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-4 space-y-3">
          <h2 className="font-bold flex items-center gap-2 text-secondary">
            <Dumbbell className="w-5 h-5" />
            Treino Recomendado
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Tipo de treino</span>
              <span className="text-sm font-semibold text-right max-w-[55%]">{plan.workoutType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Frequência</span>
              <span className="text-sm font-semibold">{plan.workoutFrequency}</span>
            </div>
          </div>
          <button
            onClick={() => router.push("/workouts")}
            className="w-full mt-1 py-2.5 rounded-xl bg-secondary/20 text-secondary text-sm font-medium flex items-center justify-center gap-1 hover:bg-secondary/30 transition-colors"
          >
            Ver treinos compatíveis <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calorias e macros */}
        <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-3">
          <h2 className="font-bold flex items-center gap-2">
            <Apple className="w-5 h-5 text-accent" />
            Nutrição Personalizada
          </h2>
          <p className="text-sm text-muted-foreground">{plan.nutritionType}</p>
          <div className="text-center py-2">
            <span className="text-3xl font-bold text-accent">{plan.estimatedCalories}</span>
            <span className="text-muted-foreground ml-1 text-sm">kcal/dia</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 text-center">
              <p className="text-xl font-bold text-blue-400">{plan.macroSplit.protein}%</p>
              <p className="text-xs text-muted-foreground">Proteína</p>
              <p className="text-xs text-muted-foreground">{Math.round(plan.estimatedCalories * plan.macroSplit.protein / 100 / 4)}g</p>
            </div>
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-center">
              <p className="text-xl font-bold text-amber-400">{plan.macroSplit.carbs}%</p>
              <p className="text-xs text-muted-foreground">Carboidratos</p>
              <p className="text-xs text-muted-foreground">{Math.round(plan.estimatedCalories * plan.macroSplit.carbs / 100 / 4)}g</p>
            </div>
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-center">
              <p className="text-xl font-bold text-rose-400">{plan.macroSplit.fat}%</p>
              <p className="text-xs text-muted-foreground">Gordura</p>
              <p className="text-xs text-muted-foreground">{Math.round(plan.estimatedCalories * plan.macroSplit.fat / 100 / 9)}g</p>
            </div>
          </div>
        </div>

        {/* Hidratação e sono */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <Droplets className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-xs text-muted-foreground">Meta de hidratação</p>
            <p className="font-bold text-blue-400 mt-1">{plan.hydrationGoal}</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <Moon className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-xs text-muted-foreground">Sono recomendado</p>
            <p className="font-bold text-purple-400 mt-1 text-sm leading-tight">{plan.sleepRecommendation}</p>
          </div>
        </div>

        {/* Pontos fortes */}
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 space-y-2">
          <h2 className="font-bold flex items-center gap-2 text-green-400">
            <Star className="w-5 h-5" />
            Seus Pontos Fortes
          </h2>
          {plan.strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-green-400 flex-shrink-0 mt-0.5">✓</span>
              <span className="text-foreground/80">{s}</span>
            </div>
          ))}
        </div>

        {/* Áreas de foco */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
          <h2 className="font-bold flex items-center gap-2 text-amber-400">
            <Target className="w-5 h-5" />
            Áreas para Focar
          </h2>
          {plan.focusAreas.map((a, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-amber-400 flex-shrink-0 mt-0.5">→</span>
              <span className="text-foreground/80">{a}</span>
            </div>
          ))}
        </div>

        {/* Metas semanais */}
        <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-3">
          <h2 className="font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-secondary" />
            Metas Semanais
          </h2>
          <div className="space-y-2">
            {plan.weeklyGoals.map((goal, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-secondary/5 border border-secondary/10">
                <Zap className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/80">{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rotina diária */}
        <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-3">
          <h2 className="font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            Rotina Diária Recomendada
          </h2>
          <div className="space-y-1.5">
            {plan.dailySchedule.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 transition-colors">
                <span className="text-sm font-mono font-bold text-secondary w-12 flex-shrink-0">{item.time}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                <span className="text-sm text-foreground/80">{item.activity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          <button
            onClick={() => router.push("/quiz/biology")}
            className="py-3 rounded-xl border border-border/50 text-muted-foreground text-sm font-medium hover:bg-muted/30 transition-colors"
          >
            Refazer Quiz
          </button>
          <button
            onClick={() => router.push("/workouts")}
            className="py-3 rounded-xl bg-gradient-to-r from-secondary to-accent text-background text-sm font-semibold"
          >
            Começar Treino
          </button>
        </div>

      </div>

      <NavBar />
    </div>
  )
}

