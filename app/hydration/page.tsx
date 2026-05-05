"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TopBar, NavBar } from "@/components/levfit/nav-bar"
import { useApp } from "@/contexts/app-context"
import { Droplets, Plus, Trophy } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface HydrationLog {
  date: string
  amount: number
  time: string
}

const quickOptions = [
  { label: "Copo", amount: 250, emoji: "🥛" },
  { label: "Garrafa P", amount: 500, emoji: "💧" },
  { label: "Garrafa M", amount: 750, emoji: "💧" },
  { label: "Garrafa G", amount: 1000, emoji: "🍶" },
]

export default function HydrationPage() {
  const router = useRouter()
  const { user, waterToday, addWaterDirect } = useApp()
  const [logs, setLogs] = useState<HydrationLog[]>([])
  const [goal] = useState(3000)
  const [customAmount, setCustomAmount] = useState("")

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    const stored = localStorage.getItem("hydration_log")
    if (stored) {
      const all: HydrationLog[] = JSON.parse(stored)
      const today = new Date().toISOString().split("T")[0]
      setLogs(all.filter((l) => l.date === today).reverse())
    }
  }, [user, router])

  const handleAddWater = (amount: number) => {
    const now = new Date()
    const today = now.toISOString().split("T")[0]
    const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    const newLog: HydrationLog = { date: today, amount, time }

    // Salva no localStorage local
    const stored = localStorage.getItem("hydration_log")
    const all: HydrationLog[] = stored ? JSON.parse(stored) : []
    all.push(newLog)
    localStorage.setItem("hydration_log", JSON.stringify(all))

    // Atualiza o contexto global — sincroniza com dashboard e relatórios
    addWaterDirect(amount)
    setLogs((prev) => [newLog, ...prev])
  }

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount)
    if (!amount || amount <= 0 || amount > 5000) return
    handleAddWater(amount)
    setCustomAmount("")
  }

  const percentage = Math.min((waterToday / goal) * 100, 100)
  const litros = (waterToday / 1000).toFixed(1)
  const faltam = Math.max(0, goal - waterToday)
  const metaAtingida = waterToday >= goal

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-20">
      <TopBar />

      <div className="max-w-lg mx-auto p-4 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Droplets className="w-6 h-6 text-blue-400" />
              Hidratação
            </h1>
            <p className="text-muted-foreground text-sm">Meta: {(goal / 1000).toFixed(1)} litros por dia</p>
          </div>
          <button onClick={() => router.push("/dashboard")} className="p-2 rounded-lg hover:bg-muted/50">×</button>
        </div>

        {/* Card principal */}
        <GlassCard className="p-5">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-blue-400">{litros}L</div>
            <p className="text-muted-foreground text-sm mt-1">
              {metaAtingida ? "Meta atingida! 🎉" : `Faltam ${(faltam / 1000).toFixed(1)}L para a meta`}
            </p>
          </div>

          {/* Barra de progresso */}
          <div className="relative w-full bg-muted/30 rounded-full h-5 overflow-hidden mb-2">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                metaAtingida
                  ? "bg-gradient-to-r from-green-500 to-emerald-400"
                  : "bg-gradient-to-r from-blue-500 to-cyan-400"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span className="font-bold text-blue-400">{Math.round(percentage)}%</span>
            <span>{(goal / 1000).toFixed(1)}L</span>
          </div>

          {metaAtingida && (
            <div className="mt-4 flex items-center justify-center gap-2 text-green-400 text-sm font-medium">
              <Trophy className="w-4 h-4" />
              +50 XP pela meta de hidratação!
            </div>
          )}
        </GlassCard>

        {/* Botões rápidos */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">Adicionar rapidamente</h2>
          <div className="grid grid-cols-4 gap-2">
            {quickOptions.map((opt) => (
              <button
                key={opt.amount}
                onClick={() => handleAddWater(opt.amount)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all active:scale-95"
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-xs font-semibold text-blue-400">{opt.amount}ml</span>
                <span className="text-[10px] text-muted-foreground">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantidade personalizada */}
        <GlassCard className="p-4">
          <h2 className="text-sm font-semibold mb-3">Quantidade personalizada</h2>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Ex: 350"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="flex-1 bg-muted/30 border border-border/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            />
            <span className="flex items-center text-sm text-muted-foreground">ml</span>
            <button
              onClick={handleCustomAdd}
              className="px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 font-medium text-sm hover:bg-blue-500/30 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </GlassCard>

        {/* Histórico do dia */}
        {logs.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">Registro de hoje</h2>
            <div className="space-y-2">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">{log.amount} ml</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {logs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground/50">
            <Droplets className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm">Nenhum registro hoje ainda</p>
            <p className="text-xs mt-1">Clique nos botões acima para registrar</p>
          </div>
        )}

      </div>
      <NavBar />
    </div>
  )
}

