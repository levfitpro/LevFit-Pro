"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { TopBar, NavBar } from "@/components/levfit/nav-bar"
import { useApp } from "@/contexts/app-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { BarChart3, TrendingUp, Dumbbell, Flame, Clock, Trophy, Apple } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export default function ReportsPage() {
  const router = useRouter()
  const { user, completedWorkouts, meals } = useApp()
  const [view, setView] = useState<"semana" | "mes">("semana")

  const weekData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const dateStr = date.toISOString().split("T")[0]
      const dayWorkouts = completedWorkouts.filter((w) => w.completedAt.startsWith(dateStr))
      const dayMeals = meals.filter((m) => m.date === dateStr)
      return {
        label: DIAS_SEMANA[date.getDay()],
        date: dateStr,
        workouts: dayWorkouts.length,
        minutes: dayWorkouts.reduce((s, w) => s + (w.duration || 0), 0),
        calories: dayWorkouts.reduce((s, w) => s + (w.caloriesBurned || w.calories || 0), 0),
        caloriasConsumidas: dayMeals.reduce((s, m) => s + m.calories, 0),
        proteina: dayMeals.reduce((s, m) => s + m.protein, 0),
        refeicoes: dayMeals.length,
      }
    })
  }, [completedWorkouts, meals])

  const monthData = useMemo(() => {
    return MESES.map((mes, idx) => {
      const mw = completedWorkouts.filter((w) => new Date(w.completedAt).getMonth() === idx)
      return {
        mes,
        workouts: mw.length,
        calories: mw.reduce((s, w) => s + (w.caloriesBurned || w.calories || 0), 0),
        minutes: mw.reduce((s, w) => s + (w.duration || 0), 0),
      }
    })
  }, [completedWorkouts])

  const totalWorkouts = completedWorkouts.length
  const totalCalories = completedWorkouts.reduce((s, w) => s + (w.caloriesBurned || w.calories || 0), 0)
  const totalMinutes = completedWorkouts.reduce((s, w) => s + (w.duration || 0), 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const restMinutes = totalMinutes % 60

  const today = new Date().toISOString().split("T")[0]
  const todayMeals = meals.filter((m) => m.date === today)
  const totalCaloriasHoje = todayMeals.reduce((s, m) => s + m.calories, 0)
  const totalProteinaHoje = todayMeals.reduce((s, m) => s + m.protein, 0)
  const totalCarbsHoje = todayMeals.reduce((s, m) => s + m.carbs, 0)
  const totalGorduraHoje = todayMeals.reduce((s, m) => s + m.fat, 0)

  const maxWeekCal = Math.max(...weekData.map((d) => d.calories), 1)
  const maxMonthWorkouts = Math.max(...monthData.map((d) => d.workouts), 1)

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-20">
      <TopBar />

      <div className="max-w-lg mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-secondary" />
              Relatórios
            </h1>
            <p className="text-muted-foreground text-sm">Acompanhe seu progresso</p>
          </div>
          <button onClick={() => router.push("/dashboard")} className="p-2 rounded-lg hover:bg-muted/50">×</button>
        </div>

        {/* Resumo de treinos */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-3 text-center">
            <Dumbbell className="w-4 h-4 text-secondary mx-auto mb-1" />
            <p className="text-xl font-bold text-secondary">{totalWorkouts}</p>
            <p className="text-xs text-muted-foreground">Treinos</p>
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-3 text-center">
            <Flame className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="text-xl font-bold text-accent">{totalCalories}</p>
            <p className="text-xs text-muted-foreground">Kcal queimadas</p>
          </div>
          <div className="bg-muted/30 rounded-2xl p-3 text-center">
            <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-xl font-bold">{totalHours}h{restMinutes > 0 ? `${restMinutes}m` : ""}</p>
            <p className="text-xs text-muted-foreground">Tempo total</p>
          </div>
        </div>

        {/* Nutrição de hoje */}
        <GlassCard className="p-4 mb-4 border border-accent/20">
          <h2 className="font-bold flex items-center gap-2 text-accent mb-3">
            <Apple className="w-4 h-4" />
            Nutrição de Hoje
          </h2>
          {todayMeals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">
              Nenhuma refeição registrada hoje.{" "}
              <button onClick={() => router.push("/nutrition")} className="text-accent underline">
                Adicionar agora
              </button>
            </p>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-accent">{totalCaloriasHoje}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-400">{totalProteinaHoje}g</p>
                  <p className="text-xs text-muted-foreground">proteína</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-400">{totalCarbsHoje}g</p>
                  <p className="text-xs text-muted-foreground">carbos</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-rose-400">{totalGorduraHoje}g</p>
                  <p className="text-xs text-muted-foreground">gordura</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {todayMeals.map((m) => (
                  <div key={m.id} className="flex justify-between items-center text-sm py-1 border-t border-border/30">
                    <span className="text-foreground/80 truncate flex-1">{m.name}</span>
                    <span className="text-accent font-medium ml-3 flex-shrink-0">{m.calories} kcal</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </GlassCard>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView("semana")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              view === "semana" ? "bg-secondary text-background" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setView("mes")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              view === "mes" ? "bg-secondary text-background" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
            }`}
          >
            Mês
          </button>
        </div>

        {view === "semana" && (
          <div className="space-y-4">
            <GlassCard className="p-4">
              <h2 className="text-sm font-semibold text-muted-foreground mb-4">Calorias Queimadas — Últimos 7 dias</h2>
              {totalWorkouts === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground/50">
                  <Dumbbell className="w-8 h-8 mb-2" />
                  <p className="text-sm">Complete treinos para ver os dados</p>
                </div>
              ) : (
                <div className="flex items-end justify-around h-32 gap-1">
                  {weekData.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                      <span className="text-xs text-muted-foreground font-medium">
                        {day.calories > 0 ? day.calories : ""}
                      </span>
                      <div className="w-full flex items-end" style={{ height: "80px" }}>
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            day.calories > 0 ? "bg-gradient-to-t from-secondary to-accent" : "bg-muted/20"
                          }`}
                          style={{ height: `${day.calories > 0 ? Math.max((day.calories / maxWeekCal) * 100, 10) : 6}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{day.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            <div className="space-y-2">
              {weekData.filter((d) => d.workouts > 0 || d.refeicoes > 0).length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">Nenhuma atividade nessa semana ainda</p>
              ) : (
                weekData.filter((d) => d.workouts > 0 || d.refeicoes > 0).map((day, idx) => (
                  <GlassCard key={idx} className="p-3">
                    <p className="text-sm font-medium mb-2">
                      {day.label} — {new Date(day.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    </p>
                    <div className="space-y-1 text-xs">
                      {day.workouts > 0 && (
                        <div className="flex items-center gap-1.5 text-secondary">
                          <Dumbbell className="w-3 h-3" />
                          <span>{day.workouts} treino · {day.calories} kcal queimadas · {day.minutes} min</span>
                        </div>
                      )}
                      {day.refeicoes > 0 && (
                        <div className="flex items-center gap-1.5 text-accent">
                          <Apple className="w-3 h-3" />
                          <span>{day.refeicoes} refeições · {day.caloriasConsumidas} kcal · {day.proteina}g proteína</span>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                ))
              )}
            </div>
          </div>
        )}

        {view === "mes" && (
          <div className="space-y-4">
            <GlassCard className="p-4">
              <h2 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Treinos por mês
              </h2>
              {totalWorkouts === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground/50">
                  <Dumbbell className="w-8 h-8 mb-2" />
                  <p className="text-sm">Complete treinos para ver os dados</p>
                </div>
              ) : (
                <div className="flex items-end justify-around h-32 gap-0.5">
                  {monthData.map((m, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full flex items-end" style={{ height: "80px" }}>
                        <div
                          className={`w-full rounded-t transition-all duration-500 ${
                            m.workouts > 0 ? "bg-gradient-to-t from-secondary to-accent" : "bg-muted/20"
                          }`}
                          style={{ height: `${m.workouts > 0 ? Math.max((m.workouts / maxMonthWorkouts) * 100, 10) : 4}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{m.mes}</span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            <div className="grid grid-cols-3 gap-2">
              {monthData.filter((m) => m.workouts > 0).map((m, idx) => (
                <GlassCard key={idx} className="p-3">
                  <p className="text-xs font-bold text-accent">{m.mes}</p>
                  <p className="text-sm font-semibold text-secondary mt-1">{m.workouts} treinos</p>
                  <p className="text-xs text-muted-foreground">{m.calories} kcal</p>
                  <p className="text-xs text-muted-foreground">{m.minutes} min</p>
                </GlassCard>
              ))}
              {monthData.filter((m) => m.workouts > 0).length === 0 && (
                <div className="col-span-3 text-center py-4 text-sm text-muted-foreground">
                  Nenhum treino registrado ainda
                </div>
              )}
            </div>
          </div>
        )}

        {user.streak > 0 && (
          <GlassCard className="p-4 mt-4 border border-secondary/20">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-secondary flex-shrink-0" />
              <div>
                <p className="font-semibold">{user.streak} dias seguidos! 🔥</p>
                <p className="text-xs text-muted-foreground">Continue assim para manter sua sequência</p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      <NavBar />
    </div>
  )
}
