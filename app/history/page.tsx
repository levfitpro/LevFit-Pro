"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { TopBar, NavBar } from "@/components/levfit/nav-bar"
import { getCompletedWorkouts } from "@/lib/user-store"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import { Dumbbell, Calendar } from "lucide-react"

export default function HistoryPage() {
  const [workouts, setWorkouts] = useState<any[]>([])
  const [filter, setFilter] = useState<"semana" | "mes" | "todos">("semana")

  useEffect(() => {
    const completed = getCompletedWorkouts()
    const now = new Date()

    let filtered = completed

    if (filter === "semana") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = completed.filter((w) => new Date(w.completedAt) >= weekAgo)
    } else if (filter === "mes") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filtered = completed.filter((w) => new Date(w.completedAt) >= monthAgo)
    }

    setWorkouts(filtered.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()))
  }, [filter])

  const stats = {
    totalWorkouts: workouts.length,
    totalMinutes: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
    totalCalories: workouts.reduce((sum, w) => sum + (w.calories || 0), 0),
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-20">
      <TopBar />

      <div className="max-w-lg mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Histórico de Treinos</h1>
            <p className="text-muted-foreground">Todos os seus treinos</p>
          </div>
          <Link href="/dashboard" className="p-2 rounded-lg hover:bg-muted/50 transition">
            ×
          </Link>
        </div>

        <div className="flex gap-2 mb-6">
          {(["semana", "mes", "todos"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition capitalize ${
                filter === f ? "bg-secondary text-background" : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {f === "semana" ? "Semana" : f === "mes" ? "Mês" : "Todos"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="glass rounded-lg p-4 border border-border/50">
            <div className="text-secondary text-xs opacity-70">Treinos</div>
            <div className="text-2xl font-bold mt-2">{stats.totalWorkouts}</div>
          </div>
          <div className="glass rounded-lg p-4 border border-border/50">
            <div className="text-accent text-xs opacity-70">Minutos</div>
            <div className="text-2xl font-bold mt-2">{stats.totalMinutes}</div>
          </div>
          <div className="glass rounded-lg p-4 border border-border/50">
            <div className="text-orange-400 text-xs opacity-70">Calorias</div>
            <div className="text-2xl font-bold mt-2">{Math.round(stats.totalCalories)}</div>
          </div>
        </div>

        <div className="space-y-3">
          {workouts.length > 0 ? (
            workouts.map((workout) => (
              <div
                key={workout.id}
                className="glass rounded-lg p-4 border border-border/50 hover:border-secondary/50 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold capitalize">{workout.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(workout.completedAt), "PPP", { locale: pt })}
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                      <span>{workout.duration} min</span>
                      <span>{workout.exercises?.length || 0} exerc.</span>
                      <span className="text-accent">{workout.calories} kcal</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Dumbbell className="w-12 h-12 mx-auto opacity-20 mb-4" />
              Nenhum treino neste período
            </div>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  )
}
