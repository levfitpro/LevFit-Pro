"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/user-store"
import { NavBar, TopBar } from "@/components/levfit/nav-bar"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Dumbbell, Clock, Flame, Play, Heart, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { AIAssistant } from "@/components/levfit/ai-assistant"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

const workoutTypes = [
  {
    id: "hipertrofia",
    name: "Hipertrofia",
    description: "Foco em força e ganho muscular",
    duration: 45,
    calories: 350,
    icon: Dumbbell,
    color: "cyan",
  },
  {
    id: "hiit",
    name: "HIIT Emagrecimento",
    description: "Alta intensidade para queima de gordura",
    duration: 30,
    calories: 400,
    icon: Flame,
    color: "gold",
  },
  {
    id: "resistencia",
    name: "Resistência",
    description: "Melhore sua capacidade cardiovascular",
    duration: 40,
    calories: 300,
    icon: Heart,
    color: "cyan",
  },
  {
    id: "mobilidade",
    name: "Mobilidade",
    description: "Recuperação e flexibilidade",
    duration: 25,
    calories: 150,
    icon: Sparkles,
    color: "gold",
  },
]

export default function WorkoutsPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const user = getUser()
    if (!user) {
      router.push("/login")
      return
    }
    setLoading(false)
  }, [router])

  const handleStartWorkout = (workoutId: string) => {
    router.push(`/workouts/${workoutId}`)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-24 pt-20">
      <TopBar />

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Header */}
        <section className="animate-fade-up">
          <h1 className="text-2xl font-bold">Treinos</h1>
          <p className="text-muted-foreground">Escolha seu treino para hoje</p>
        </section>

        {/* AI Recommendation */}
        <section className="animate-fade-up" style={{ animationDelay: "100ms" }}>
          <GlassCard variant="neon" neonColor="gold">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Recomendação IA</p>
                <p className="font-medium">Baseado no seu objetivo, sugerimos HIIT hoje</p>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Workout Types */}
        <section className="space-y-4">
          {workoutTypes.map((workout, index) => (
            <div key={workout.id} className="animate-fade-up" style={{ animationDelay: `${(index + 2) * 100}ms` }}>
              <GlassCard variant="elevated" className="cursor-pointer">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center",
                      workout.color === "cyan" ? "bg-secondary/20" : "bg-accent/20",
                    )}
                  >
                    <workout.icon
                      className={cn("w-7 h-7", workout.color === "cyan" ? "text-secondary" : "text-accent")}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground">{workout.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {workout.duration} min
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Flame className="w-3 h-3" />
                        {workout.calories} kcal
                      </span>
                    </div>
                  </div>
                  <NeonButton
                    variant={workout.color as "cyan" | "gold"}
                    size="sm"
                    onClick={() => handleStartWorkout(workout.id)}
                    icon={<Play className="w-4 h-4" />}
                  >
                    Iniciar
                  </NeonButton>
                </div>
              </GlassCard>
            </div>
          ))}
        </section>
      </div>

      <AIAssistant />

      <NavBar />
    </main>
  )
}
