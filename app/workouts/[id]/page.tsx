"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { ArrowLeft, Play, SkipForward, Check, Dumbbell, Flame, Heart, Sparkles, Clock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CompletedWorkout } from "@/lib/user-store"

const workoutData: Record<string, {
  name: string
  description: string
  duration: number
  calories: number
  icon: React.ElementType
  color: "cyan" | "gold"
  warmup: { name: string; duration: number }[]
  exercises: {
    name: string; sets: number; reps: number
    restSeconds: number; muscleGroup: string
    instructions: string[]; tips: string
  }[]
  cooldown: { name: string; duration: number }[]
}> = {
  hipertrofia: {
    name: "Hipertrofia", description: "Foco em força e ganho muscular",
    duration: 45, calories: 350, icon: Dumbbell, color: "cyan",
    warmup: [
      { name: "Polichinelos", duration: 60 },
      { name: "Rotação de ombros", duration: 30 },
      { name: "Agachamento sem peso", duration: 60 },
    ],
    exercises: [
      { name: "Supino Reto", sets: 4, reps: 10, restSeconds: 90, muscleGroup: "Peito", instructions: ["Deite no banco com os pés apoiados no chão", "Segure a barra na largura dos ombros", "Desça a barra até o peito controladamente", "Empurre para cima até os braços estenderem"], tips: "Mantenha as escápulas retraídas durante todo o movimento" },
      { name: "Remada Curvada", sets: 4, reps: 10, restSeconds: 90, muscleGroup: "Costas", instructions: ["Incline o tronco para frente mantendo as costas retas", "Segure a barra ou halteres", "Puxe o peso em direção ao abdômen", "Desça controladamente"], tips: "Aperte as escápulas no topo do movimento" },
      { name: "Agachamento Livre", sets: 4, reps: 12, restSeconds: 120, muscleGroup: "Pernas", instructions: ["Posicione a barra nos trapézios", "Pés na largura dos ombros", "Desça até as coxas ficarem paralelas ao chão", "Suba empurrando pelo calcanhar"], tips: "Mantenha o core contraído e joelhos alinhados com os pés" },
      { name: "Desenvolvimento", sets: 3, reps: 12, restSeconds: 60, muscleGroup: "Ombros", instructions: ["Sente com as costas apoiadas", "Segure os halteres na altura dos ombros", "Empurre para cima até os braços estenderem", "Desça controladamente"], tips: "Não arqueie as costas durante o movimento" },
      { name: "Rosca Direta", sets: 3, reps: 12, restSeconds: 60, muscleGroup: "Bíceps", instructions: ["Em pé, segure a barra com pegada supinada", "Mantenha os cotovelos fixos ao lado do corpo", "Flexione os cotovelos levantando a barra", "Desça controladamente"], tips: "Evite balançar o corpo para levantar o peso" },
    ],
    cooldown: [{ name: "Alongamento de peito", duration: 30 }, { name: "Alongamento de costas", duration: 30 }, { name: "Alongamento de pernas", duration: 30 }],
  },
  hiit: {
    name: "HIIT Emagrecimento", description: "Alta intensidade para queima de gordura",
    duration: 30, calories: 400, icon: Flame, color: "gold",
    warmup: [{ name: "Marcha estacionária", duration: 60 }, { name: "Rotação de quadril", duration: 30 }],
    exercises: [
      { name: "Burpees", sets: 4, reps: 15, restSeconds: 30, muscleGroup: "Full Body", instructions: ["Comece em pé", "Agache e coloque as mãos no chão", "Salte os pés para trás em posição de prancha", "Faça uma flexão", "Salte os pés de volta e pule com os braços para cima"], tips: "Mantenha o ritmo mas não sacrifique a forma" },
      { name: "Mountain Climbers", sets: 4, reps: 20, restSeconds: 20, muscleGroup: "Core", instructions: ["Comece em posição de prancha", "Traga um joelho em direção ao peito", "Alterne rapidamente entre as pernas", "Mantenha o quadril baixo"], tips: "Quanto mais rápido, mais calorias queima" },
      { name: "Jump Squats", sets: 4, reps: 15, restSeconds: 30, muscleGroup: "Pernas", instructions: ["Comece em posição de agachamento", "Desça até as coxas paralelas ao chão", "Exploda para cima em um salto", "Aterrisse suavemente e repita"], tips: "Aterrisse com os joelhos levemente flexionados" },
      { name: "High Knees", sets: 4, reps: 30, restSeconds: 20, muscleGroup: "Cardio", instructions: ["Em pé, corra no lugar", "Levante os joelhos o mais alto possível", "Balance os braços naturalmente", "Mantenha o core contraído"], tips: "Tente manter um ritmo constante e rápido" },
    ],
    cooldown: [{ name: "Respiração profunda", duration: 30 }, { name: "Alongamento geral", duration: 60 }],
  },
  resistencia: {
    name: "Resistência", description: "Melhore sua capacidade cardiovascular",
    duration: 40, calories: 300, icon: Heart, color: "cyan",
    warmup: [{ name: "Caminhada leve", duration: 120 }],
    exercises: [
      { name: "Corrida Moderada", sets: 1, reps: 1, restSeconds: 0, muscleGroup: "Cardio", instructions: ["Mantenha um ritmo confortável", "Respire pelo nariz e boca", "Mantenha postura ereta", "Braços relaxados e em movimento"], tips: "Você deve conseguir conversar enquanto corre" },
      { name: "Bicicleta", sets: 1, reps: 1, restSeconds: 0, muscleGroup: "Cardio", instructions: ["Ajuste o banco na altura correta", "Mantenha pedalada constante", "Varie a resistência conforme necessário", "Mantenha as costas retas"], tips: "Foque em manter uma cadência de 80-100 RPM" },
    ],
    cooldown: [{ name: "Caminhada leve", duration: 120 }, { name: "Alongamento de pernas", duration: 60 }],
  },
  mobilidade: {
    name: "Mobilidade", description: "Recuperação e flexibilidade",
    duration: 25, calories: 150, icon: Sparkles, color: "gold",
    warmup: [{ name: "Respiração profunda", duration: 60 }],
    exercises: [
      { name: "Alongamento Dinâmico", sets: 2, reps: 10, restSeconds: 15, muscleGroup: "Full Body", instructions: ["Movimentos lentos e controlados", "Alongue até sentir leve tensão", "Nunca force além do confortável", "Respire profundamente"], tips: "Foque na qualidade do movimento" },
      { name: "Yoga Flow", sets: 1, reps: 1, restSeconds: 0, muscleGroup: "Full Body", instructions: ["Siga a sequência de posições", "Mantenha cada posição por 5 respirações", "Transicione suavemente", "Ouça seu corpo"], tips: "Use um tapete para maior conforto" },
    ],
    cooldown: [{ name: "Meditação guiada", duration: 120 }],
  },
}

type Phase = "warmup" | "exercise" | "rest" | "cooldown" | "complete"

export default function WorkoutDetailPage() {
  const router = useRouter()
  const params = useParams()
  const workoutId = params.id as string
  const { user, addCompletedWorkout, earnXP } = useApp()

  const workout = workoutData[workoutId]

  const [phase, setPhase] = React.useState<Phase>("warmup")
  const [currentWarmupIndex, setCurrentWarmupIndex] = React.useState(0)
  const [currentExerciseIndex, setCurrentExerciseIndex] = React.useState(0)
  const [currentSet, setCurrentSet] = React.useState(1)
  const [currentCooldownIndex, setCurrentCooldownIndex] = React.useState(0)
  const [timer, setTimer] = React.useState(0)
  const [restTimer, setRestTimer] = React.useState(0)
  const [isActive, setIsActive] = React.useState(false)
  const [totalTime, setTotalTime] = React.useState(0)
  const [showInstructions, setShowInstructions] = React.useState(true)
  const [completedData, setCompletedData] = React.useState<{ duration: number; calories: number; xp: number } | null>(null)

  React.useEffect(() => {
    if (!user) router.push("/login")
    if (!workout) router.push("/workouts")
  }, [user, workout, router])

  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && phase !== "complete") {
      interval = setInterval(() => {
        setTotalTime((t) => t + 1)
        if (phase === "warmup" || phase === "cooldown") setTimer((t) => t + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, phase])

  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (phase === "rest" && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((t) => {
          if (t <= 1) { setPhase("exercise"); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [phase, restTimer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleFinishWorkout = React.useCallback(() => {
    setPhase("complete")
    setIsActive(false)

    const durationMinutes = Math.max(1, Math.floor(totalTime / 60))
    const xpEarned = 150

    const completed: CompletedWorkout = {
      id: crypto.randomUUID(),
      name: workout.name,
      type: workoutId,
      duration: durationMinutes,
      calories: workout.calories,
      caloriesBurned: workout.calories,
      completedAt: new Date().toISOString(),
      exercises: workout.exercises.map((e, i) => ({
        id: String(i),
        name: e.name,
        sets: e.sets,
        reps: e.reps,
        muscleGroup: e.muscleGroup,
      })),
    }

    // Salva via contexto global — aparece automaticamente em /history e /reports
    addCompletedWorkout(completed)
    earnXP(xpEarned)

    setCompletedData({ duration: durationMinutes, calories: workout.calories, xp: xpEarned })
  }, [totalTime, workout, workoutId, addCompletedWorkout, earnXP])

  const handleNextWarmup = () => {
    if (currentWarmupIndex < workout.warmup.length - 1) {
      setCurrentWarmupIndex((i) => i + 1); setTimer(0)
    } else {
      setPhase("exercise"); setShowInstructions(true)
    }
  }

  const handleCompleteSet = () => {
    const exercise = workout.exercises[currentExerciseIndex]
    if (currentSet < exercise.sets) {
      setCurrentSet((s) => s + 1); setRestTimer(exercise.restSeconds); setPhase("rest")
    } else {
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex((i) => i + 1); setCurrentSet(1)
        setRestTimer(exercise.restSeconds); setPhase("rest"); setShowInstructions(true)
      } else {
        setPhase("cooldown"); setCurrentCooldownIndex(0); setTimer(0)
      }
    }
  }

  const handleNextCooldown = () => {
    if (currentCooldownIndex < workout.cooldown.length - 1) {
      setCurrentCooldownIndex((i) => i + 1); setTimer(0)
    } else {
      handleFinishWorkout()
    }
  }

  if (!workout) return null

  const currentExercise = workout.exercises[currentExerciseIndex]
  const progress = phase === "complete" ? 100
    : ((currentExerciseIndex + (currentSet / (currentExercise?.sets || 1))) / workout.exercises.length) * 100
  const Icon = workout.icon

  // ── Tela de conclusão ──────────────────────────────────────────────────────
  if (phase === "complete" && completedData) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md w-full">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
            <Check className="w-12 h-12 text-background" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Treino Concluído!</h1>
            <p className="text-muted-foreground mt-1">Parabéns! Você completou {workout.name}</p>
          </div>

          <GlassCard className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-secondary">{formatTime(totalTime)}</p>
                <p className="text-xs text-muted-foreground">Duração</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">{completedData.calories}</p>
                <p className="text-xs text-muted-foreground">Calorias</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">+{completedData.xp}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
            </div>
          </GlassCard>

          <p className="text-sm text-secondary font-medium">
            ✓ Treino salvo no seu histórico!
          </p>

          <div className="grid grid-cols-2 gap-3">
            <NeonButton
              variant="ghost"
              size="lg"
              onClick={() => router.push("/history")}
            >
              Ver Histórico
            </NeonButton>
            <NeonButton
              variant="cyan"
              size="lg"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </NeonButton>
          </div>
        </div>
      </main>
    )
  }

  // ── Tela principal do treino ───────────────────────────────────────────────
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header fixo */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="p-2 -ml-2 rounded-lg hover:bg-muted/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{workout.name}</p>
              <p className="text-xl font-bold text-secondary font-mono">{formatTime(totalTime)}</p>
            </div>
            <div className="w-9" />
          </div>
          <div className="mt-3 h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-secondary to-accent rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="flex-1 pt-28 pb-8 px-4 max-w-lg mx-auto w-full">

        {/* Tela inicial */}
        {!isActive && phase === "warmup" && (
          <div className="space-y-6">
            <GlassCard variant="neon" neonColor={workout.color}>
              <div className="text-center py-4 space-y-4">
                <div className={cn("w-20 h-20 mx-auto rounded-2xl flex items-center justify-center", workout.color === "cyan" ? "bg-secondary/20" : "bg-accent/20")}>
                  <Icon className={cn("w-10 h-10", workout.color === "cyan" ? "text-secondary" : "text-accent")} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{workout.name}</h1>
                  <p className="text-muted-foreground">{workout.description}</p>
                </div>
                <div className="flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-secondary" /><span>{workout.duration} min</span></div>
                  <div className="flex items-center gap-2"><Flame className="w-4 h-4 text-accent" /><span>{workout.calories} kcal</span></div>
                  <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-secondary" /><span>+150 XP</span></div>
                </div>
              </div>
            </GlassCard>

            <div className="space-y-3">
              <h3 className="font-semibold">Exercícios ({workout.exercises.length})</h3>
              {workout.exercises.map((ex, idx) => (
                <GlassCard key={idx} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center text-sm font-bold">{idx + 1}</div>
                    <div className="flex-1">
                      <p className="font-medium">{ex.name}</p>
                      <p className="text-xs text-muted-foreground">{ex.sets}x{ex.reps} • {ex.muscleGroup}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            <NeonButton variant={workout.color} size="lg" className="w-full" onClick={() => { setIsActive(true); setPhase("warmup"); setTimer(0) }} icon={<Play className="w-5 h-5" />}>
              Iniciar Treino
            </NeonButton>
          </div>
        )}

        {/* Aquecimento */}
        {isActive && phase === "warmup" && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-accent uppercase tracking-wider font-medium">Aquecimento</p>
              <p className="text-muted-foreground text-sm">{currentWarmupIndex + 1} de {workout.warmup.length}</p>
            </div>
            <GlassCard variant="neon" neonColor="gold" className="text-center py-8">
              <h2 className="text-2xl font-bold mb-2">{workout.warmup[currentWarmupIndex].name}</h2>
              <p className="text-4xl font-bold font-mono text-accent">{formatTime(timer)}</p>
              <p className="text-sm text-muted-foreground mt-2">Duração sugerida: {workout.warmup[currentWarmupIndex].duration}s</p>
            </GlassCard>
            <NeonButton variant="gold" size="lg" className="w-full" onClick={handleNextWarmup} icon={<SkipForward className="w-5 h-5" />}>
              {currentWarmupIndex < workout.warmup.length - 1 ? "Próximo" : "Iniciar Exercícios"}
            </NeonButton>
          </div>
        )}

        {/* Exercício */}
        {isActive && phase === "exercise" && currentExercise && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-secondary uppercase tracking-wider font-medium">Exercício</p>
              <p className="text-muted-foreground text-sm">{currentExerciseIndex + 1} de {workout.exercises.length}</p>
            </div>
            <GlassCard variant="neon" neonColor="cyan">
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary/20 flex items-center justify-center mb-4">
                  <Dumbbell className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold">{currentExercise.name}</h2>
                <p className="text-muted-foreground">{currentExercise.muscleGroup}</p>
                <div className="flex justify-center gap-8 mt-4">
                  <div><p className="text-3xl font-bold text-secondary">{currentSet}/{currentExercise.sets}</p><p className="text-xs text-muted-foreground">Série</p></div>
                  <div><p className="text-3xl font-bold">{currentExercise.reps}</p><p className="text-xs text-muted-foreground">Reps</p></div>
                </div>
              </div>
            </GlassCard>

            {showInstructions && (
              <GlassCard className="p-4">
                <h3 className="font-semibold mb-3 text-sm">Instruções</h3>
                <ol className="space-y-2">
                  {currentExercise.instructions.map((inst, idx) => (
                    <li key={idx} className="flex gap-2 text-sm">
                      <span className="text-secondary font-bold">{idx + 1}.</span>
                      <span className="text-muted-foreground">{inst}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-xs text-accent"><strong>Dica:</strong> {currentExercise.tips}</p>
                </div>
                <button onClick={() => setShowInstructions(false)} className="mt-4 text-xs text-muted-foreground hover:text-foreground">Ocultar instruções</button>
              </GlassCard>
            )}
            {!showInstructions && (
              <button onClick={() => setShowInstructions(true)} className="text-sm text-secondary">Ver instruções</button>
            )}

            <NeonButton variant="cyan" size="lg" className="w-full" onClick={handleCompleteSet} icon={<Check className="w-5 h-5" />}>
              Completar Série
            </NeonButton>
          </div>
        )}

        {/* Descanso */}
        {isActive && phase === "rest" && (
          <div className="space-y-6 text-center">
            <div>
              <p className="text-sm text-accent uppercase tracking-wider font-medium">Descanso</p>
              <p className="text-muted-foreground text-sm">Prepare-se para a próxima série</p>
            </div>
            <GlassCard variant="neon" neonColor="gold" className="py-12">
              <p className="text-6xl font-bold font-mono text-accent">{restTimer}</p>
              <p className="text-muted-foreground mt-2">segundos</p>
            </GlassCard>
            <NeonButton variant="ghost" size="lg" className="w-full" onClick={() => { setRestTimer(0); setPhase("exercise") }} icon={<SkipForward className="w-5 h-5" />}>
              Pular descanso
            </NeonButton>
          </div>
        )}

        {/* Volta à calma */}
        {isActive && phase === "cooldown" && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-secondary uppercase tracking-wider font-medium">Volta à Calma</p>
              <p className="text-muted-foreground text-sm">{currentCooldownIndex + 1} de {workout.cooldown.length}</p>
            </div>
            <GlassCard variant="neon" neonColor="cyan" className="text-center py-8">
              <h2 className="text-2xl font-bold mb-2">{workout.cooldown[currentCooldownIndex].name}</h2>
              <p className="text-4xl font-bold font-mono text-secondary">{formatTime(timer)}</p>
              <p className="text-sm text-muted-foreground mt-2">Duração sugerida: {workout.cooldown[currentCooldownIndex].duration}s</p>
            </GlassCard>
            <NeonButton
              variant="cyan" size="lg" className="w-full"
              onClick={handleNextCooldown}
              icon={currentCooldownIndex < workout.cooldown.length - 1 ? <SkipForward className="w-5 h-5" /> : <Check className="w-5 h-5" />}
            >
              {currentCooldownIndex < workout.cooldown.length - 1 ? "Próximo" : "Finalizar Treino"}
            </NeonButton>
          </div>
        )}
      </div>
    </main>
  )
}

