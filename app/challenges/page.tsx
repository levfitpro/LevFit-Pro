"use client"

import { useRouter } from "next/navigation"
import { TopBar, NavBar } from "@/components/levfit/nav-bar"
import { useApp } from "@/contexts/app-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { CheckCircle2, Trophy, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const difficultyColor = {
  fácil: "text-green-400 bg-green-400/10",
  médio: "text-yellow-400 bg-yellow-400/10",
  difícil: "text-red-400 bg-red-400/10",
}

export default function ChallengesPage() {
  const router = useRouter()
  const { user, challenges, completeChallenge, earnXP } = useApp()

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </main>
    )
  }

  const handleComplete = (id: string, xpReward: number) => {
    completeChallenge(id)
    earnXP(xpReward)
  }

  const completed = challenges.filter((c) => c.completed).length
  const totalXP = challenges.filter((c) => c.completed).reduce((sum, c) => sum + c.xpReward, 0)

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-20">
      <TopBar />
      <div className="max-w-lg mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-secondary" />
              Desafios do Dia
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {completed}/{challenges.length} completos · {totalXP} XP ganhos
            </p>
          </div>
          <button onClick={() => router.push("/dashboard")} className="p-2 rounded-lg hover:bg-muted/50">
            ×
          </button>
        </div>

        {/* Barra de progresso geral */}
        <div className="w-full bg-muted/30 rounded-full h-2 mb-6">
          <div
            className="bg-secondary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completed / challenges.length) * 100}%` }}
          />
        </div>

        {/* Lista de desafios */}
        <div className="space-y-3">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={cn(
                "rounded-2xl border p-4 transition-all duration-300",
                challenge.completed
                  ? "border-secondary/30 bg-secondary/5 opacity-75"
                  : "border-border/50 bg-card hover:border-secondary/30"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        difficultyColor[challenge.difficulty]
                      )}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {challenge.type}
                    </span>
                  </div>
                  <h3 className="font-semibold">{challenge.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{challenge.description}</p>
                  <div className="flex items-center gap-1 mt-2 text-secondary text-sm font-medium">
                    <Zap className="w-4 h-4" />
                    +{challenge.xpReward} XP
                  </div>
                </div>

                {challenge.completed ? (
                  <CheckCircle2 className="w-7 h-7 text-secondary flex-shrink-0 mt-1" />
                ) : (
                  <button
                    onClick={() => handleComplete(challenge.id, challenge.xpReward)}
                    className="flex-shrink-0 mt-1 px-4 py-2 rounded-xl bg-secondary/20 text-secondary text-sm font-medium hover:bg-secondary/30 transition-colors border border-secondary/30"
                  >
                    Completar
                  </button>
                )}
              </div>

              {/* Barra de progresso do desafio */}
              {!challenge.completed && challenge.goal > 1 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{challenge.current} / {challenge.goal}</span>
                    <span>{Math.round((challenge.current / challenge.goal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-1.5">
                    <div
                      className="bg-secondary h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min((challenge.current / challenge.goal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {completed === challenges.length && (
          <div className="mt-6 text-center p-6 rounded-2xl border border-secondary/30 bg-secondary/5">
            <Trophy className="w-10 h-10 text-secondary mx-auto mb-2" />
            <p className="font-bold text-lg">Todos os desafios completos!</p>
            <p className="text-muted-foreground text-sm mt-1">Volte amanhã para novos desafios</p>
          </div>
        )}
      </div>
      <NavBar />
    </div>
  )
}

