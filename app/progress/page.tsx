"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { getUser, saveUser, type UserProfile } from "@/lib/user-store"
import { NavBar, TopBar } from "@/components/levfit/nav-bar"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { CyberInput } from "@/components/ui/cyber-input"
import { ProgressRing } from "@/components/ui/progress-ring"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TrendingUp, Scale, Ruler, Activity, Heart, Moon, Plus, Camera, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { AIAssistant } from "@/components/levfit/ai-assistant"

// Mock progress data
const progressData = [
  { week: "Sem 1", weight: 82, bodyFat: 22 },
  { week: "Sem 2", weight: 81.5, bodyFat: 21.5 },
  { week: "Sem 3", weight: 80.8, bodyFat: 21 },
  { week: "Sem 4", weight: 80, bodyFat: 20.5 },
]

export default function ProgressPage() {
  const router = useRouter()
  const [user, setUser] = React.useState<UserProfile | null>(null)
  const [showUpdateStats, setShowUpdateStats] = React.useState(false)
  const [stats, setStats] = React.useState({
    weight: "",
    height: "",
    bodyFat: "",
    muscleMass: "",
    sleepHours: "",
    stressLevel: "",
  })

  React.useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(userData)
    setStats({
      weight: String(userData.stats.weight || ""),
      height: String(userData.stats.height || ""),
      bodyFat: String(userData.stats.bodyFat || ""),
      muscleMass: String(userData.stats.muscleMass || ""),
      sleepHours: String(userData.stats.sleepHours || ""),
      stressLevel: String(userData.stats.stressLevel || ""),
    })
  }, [router])

  const handleUpdateStats = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      stats: {
        weight: Number(stats.weight) || 0,
        height: Number(stats.height) || 0,
        bodyFat: Number(stats.bodyFat) || 0,
        muscleMass: Number(stats.muscleMass) || 0,
        sleepHours: Number(stats.sleepHours) || 0,
        stressLevel: Number(stats.stressLevel) || 0,
      },
    }

    saveUser(updatedUser)
    setUser(updatedUser)
    setShowUpdateStats(false)
  }

  // Calculate IMC
  const imc =
    user?.stats.weight && user?.stats.height
      ? (user.stats.weight / Math.pow(user.stats.height / 100, 2)).toFixed(1)
      : "--"

  const imcCategory = () => {
    const val = Number.parseFloat(imc)
    if (isNaN(val)) return ""
    if (val < 18.5) return "Abaixo do peso"
    if (val < 25) return "Peso normal"
    if (val < 30) return "Sobrepeso"
    return "Obesidade"
  }

  if (!user) return null

  const statCards = [
    { label: "Peso", value: user.stats.weight || "--", unit: "kg", icon: Scale, color: "cyan" },
    { label: "Altura", value: user.stats.height || "--", unit: "cm", icon: Ruler, color: "gold" },
    { label: "IMC", value: imc, unit: "", icon: Activity, color: "cyan", subtitle: imcCategory() },
    { label: "% Gordura", value: user.stats.bodyFat || "--", unit: "%", icon: Heart, color: "gold" },
    { label: "Massa Muscular", value: user.stats.muscleMass || "--", unit: "kg", icon: TrendingUp, color: "cyan" },
    { label: "Sono", value: user.stats.sleepHours || "--", unit: "h", icon: Moon, color: "gold" },
  ]

  return (
    <main className="min-h-screen pb-24 pt-20">
      <TopBar />

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Header */}
        <section className="animate-fade-up flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Progresso</h1>
            <p className="text-muted-foreground">Acompanhe sua evolução</p>
          </div>
          <NeonButton
            variant="cyan"
            size="sm"
            onClick={() => setShowUpdateStats(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Atualizar
          </NeonButton>
        </section>

        {/* Stats Grid */}
        <section className="animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="grid grid-cols-2 gap-4">
            {statCards.map((stat, index) => (
              <GlassCard
                key={stat.label}
                variant="elevated"
                className="animate-fade-up"
                style={{ animationDelay: `${(index + 2) * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p
                      className={cn(
                        "text-2xl font-bold mt-1",
                        stat.color === "cyan" ? "text-secondary" : "text-accent",
                      )}
                    >
                      {stat.value}
                      <span className="text-sm text-muted-foreground ml-1">{stat.unit}</span>
                    </p>
                    {stat.subtitle && <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>}
                  </div>
                  <div className={cn("p-2 rounded-lg", stat.color === "cyan" ? "bg-secondary/20" : "bg-accent/20")}>
                    <stat.icon className={cn("w-4 h-4", stat.color === "cyan" ? "text-secondary" : "text-accent")} />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Weight Chart */}
        <section className="animate-fade-up" style={{ animationDelay: "300ms" }}>
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Evolução do Peso</h3>
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C1D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00C1D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="week" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} domain={["dataMin - 2", "dataMax + 2"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2D2D2D",
                      border: "1px solid #00C1D4",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="weight" stroke="#00C1D4" fill="url(#weightGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </section>

        {/* Body Composition */}
        <section className="animate-fade-up" style={{ animationDelay: "400ms" }}>
          <GlassCard>
            <h3 className="font-semibold mb-4">Composição Corporal</h3>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <ProgressRing progress={user.stats.bodyFat || 20} size={100} color="gold" showValue={false} />
                <p className="text-lg font-bold text-accent mt-2">{user.stats.bodyFat || 20}%</p>
                <p className="text-xs text-muted-foreground">Gordura</p>
              </div>
              <div className="text-center">
                <ProgressRing
                  progress={((user.stats.muscleMass || 35) / 50) * 100}
                  size={100}
                  color="cyan"
                  showValue={false}
                />
                <p className="text-lg font-bold text-secondary mt-2">{user.stats.muscleMass || 35}kg</p>
                <p className="text-xs text-muted-foreground">Massa Muscular</p>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Photo Progress */}
        <section className="animate-fade-up" style={{ animationDelay: "500ms" }}>
          <GlassCard
            variant="neon"
            neonColor="cyan"
            className="cursor-pointer"
            onClick={() => router.push("/progress/photos")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-medium">Fotos de Progresso</p>
                  <p className="text-sm text-muted-foreground">Compare sua evolução visual</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </GlassCard>
        </section>
      </div>

      {/* Update Stats Dialog */}
      <Dialog open={showUpdateStats} onOpenChange={setShowUpdateStats}>
        <DialogContent className="glass-card border-secondary/20 max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Atualizar Medidas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <CyberInput
                label="Peso (kg)"
                type="number"
                placeholder="0"
                value={stats.weight}
                onChange={(e) => setStats((p) => ({ ...p, weight: e.target.value }))}
              />
              <CyberInput
                label="Altura (cm)"
                type="number"
                placeholder="0"
                value={stats.height}
                onChange={(e) => setStats((p) => ({ ...p, height: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CyberInput
                label="% Gordura"
                type="number"
                placeholder="0"
                value={stats.bodyFat}
                onChange={(e) => setStats((p) => ({ ...p, bodyFat: e.target.value }))}
              />
              <CyberInput
                label="Massa Muscular (kg)"
                type="number"
                placeholder="0"
                value={stats.muscleMass}
                onChange={(e) => setStats((p) => ({ ...p, muscleMass: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CyberInput
                label="Sono (h)"
                type="number"
                placeholder="0"
                value={stats.sleepHours}
                onChange={(e) => setStats((p) => ({ ...p, sleepHours: e.target.value }))}
              />
              <CyberInput
                label="Estresse (1-10)"
                type="number"
                placeholder="0"
                value={stats.stressLevel}
                onChange={(e) => setStats((p) => ({ ...p, stressLevel: e.target.value }))}
              />
            </div>
            <NeonButton variant="cyan" className="w-full" onClick={handleUpdateStats}>
              Salvar
            </NeonButton>
          </div>
        </DialogContent>
      </Dialog>

      <AIAssistant />

      <NavBar />
    </main>
  )
}
