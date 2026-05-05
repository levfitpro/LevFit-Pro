"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import { TopBar, NavBar } from "@/components/levfit/nav-bar"
import { GlassCard } from "@/components/ui/glass-card"
import { Share2, Copy, Check, Trophy, Flame, Dumbbell, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SharingPage() {
  const router = useRouter()
  const { user, completedWorkouts } = useApp()
  const [copied, setCopied] = useState(false)
  const [selectedCard, setSelectedCard] = useState<"progresso" | "conquista" | "desafio">("progresso")
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])

  const totalCalories = completedWorkouts.reduce((s, w) => s + (w.caloriesBurned || w.calories || 0), 0)

  // localStorage só no cliente
  useEffect(() => {
    const achievements = JSON.parse(localStorage.getItem("unlocked_achievements") || "[]")
    setUnlockedAchievements(achievements)
  }, [])

  const shareCards = {
    progresso: {
      title: "Meu Progresso",
      emoji: "💪",
      text: () => `💪 Meu progresso no LevFit Pro!

🏋️ ${completedWorkouts.length} treinos completados
🔥 ${totalCalories} calorias queimadas
⚡ Nível ${user?.level || 1} — ${user?.xp || 0} XP
🏆 ${unlockedAchievements.length} conquistas desbloqueadas
🔥 ${user?.streak || 0} dias seguidos

Comece sua transformação em levfit.pro 🚀`,
    },
    conquista: {
      title: "Nova Conquista",
      emoji: "🏆",
      text: () => `🏆 Desbloqueei uma nova conquista no LevFit Pro!

⚡ Nível ${user?.level || 1} atingido
🎯 ${unlockedAchievements.length} de 20 conquistas desbloqueadas
💪 ${completedWorkouts.length} treinos no total

Junte-se a mim em levfit.pro 💎`,
    },
    desafio: {
      title: "Desafio Completado",
      emoji: "🎯",
      text: () => `🎯 Completei mais um desafio no LevFit Pro!

🔥 ${user?.streak || 0} dias consecutivos de treino
⚡ ${user?.xp || 0} XP acumulados
🏋️ ${completedWorkouts.length} treinos no total

Transformação real começa em levfit.pro 🚀`,
    },
  }

  const handleCopy = () => {
    const text = shareCards[selectedCard].text()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(shareCards[selectedCard].text())
    const url = encodeURIComponent("https://levfit.pro")
    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    }
    if (platform in links) window.open(links[platform], "_blank")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-20">
      <TopBar />

      <div className="max-w-lg mx-auto p-4 space-y-4">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Share2 className="w-6 h-6 text-secondary" />
              Compartilhar
            </h1>
            <p className="text-muted-foreground text-sm">Mostre seu progresso para o mundo</p>
          </div>
          <button onClick={() => router.push("/dashboard")} className="p-2 rounded-lg hover:bg-muted/50">×</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-3 text-center">
            <Dumbbell className="w-4 h-4 text-secondary mx-auto mb-1" />
            <p className="text-xl font-bold text-secondary">{completedWorkouts.length}</p>
            <p className="text-xs text-muted-foreground">Treinos</p>
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-3 text-center">
            <Flame className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="text-xl font-bold text-accent">{totalCalories}</p>
            <p className="text-xs text-muted-foreground">Kcal queimadas</p>
          </div>
          <div className="bg-purple-400/10 border border-purple-400/20 rounded-2xl p-3 text-center">
            <Zap className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-purple-400">Nível {user.level}</p>
            <p className="text-xs text-muted-foreground">{user.xp} XP</p>
          </div>
          <div className="bg-amber-400/10 border border-amber-400/20 rounded-2xl p-3 text-center">
            <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-amber-400">{unlockedAchievements.length}</p>
            <p className="text-xs text-muted-foreground">Conquistas</p>
          </div>
        </div>

        {/* Tipo de card */}
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-2">Escolha o que compartilhar</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(shareCards) as [keyof typeof shareCards, typeof shareCards[keyof typeof shareCards]][]).map(([key, card]) => (
              <button
                key={key}
                onClick={() => setSelectedCard(key)}
                className={cn(
                  "py-3 rounded-xl text-xs font-medium transition-all border flex flex-col items-center gap-1",
                  selectedCard === key
                    ? "bg-secondary/20 border-secondary/50 text-secondary"
                    : "border-border/50 text-muted-foreground hover:bg-muted/30"
                )}
              >
                <span className="text-2xl">{card.emoji}</span>
                {card.title}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Preview</p>
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                copied ? "bg-green-500/20 text-green-400" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
              )}
            >
              {copied ? <><Check className="w-3.5 h-3.5" />Copiado!</> : <><Copy className="w-3.5 h-3.5" />Copiar</>}
            </button>
          </div>
          <pre className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed font-sans bg-muted/20 rounded-xl p-3">
            {shareCards[selectedCard].text()}
          </pre>
        </GlassCard>

        {/* Botões */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">Compartilhar em</p>
          <button onClick={() => handleShare("whatsapp")} className="w-full py-3.5 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 font-semibold flex items-center justify-center gap-3 hover:bg-green-500/30 transition-colors">
            <span className="text-xl">📱</span> WhatsApp
          </button>
          <button onClick={() => handleShare("telegram")} className="w-full py-3.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 font-semibold flex items-center justify-center gap-3 hover:bg-blue-500/30 transition-colors">
            <span className="text-xl">✈️</span> Telegram
          </button>
          <button onClick={() => handleShare("twitter")} className="w-full py-3.5 rounded-xl bg-muted/30 border border-border/50 text-foreground font-semibold flex items-center justify-center gap-3 hover:bg-muted/50 transition-colors">
            <span className="text-xl">🐦</span> Twitter / X
          </button>
          <button onClick={handleCopy} className="w-full py-3.5 rounded-xl bg-secondary/20 border border-secondary/30 text-secondary font-semibold flex items-center justify-center gap-3 hover:bg-secondary/30 transition-colors">
            {copied ? <><Check className="w-5 h-5" />Copiado!</> : <><Copy className="w-5 h-5" />Copiar texto</>}
          </button>
        </div>

      </div>
      <NavBar />
    </div>
  )
}



