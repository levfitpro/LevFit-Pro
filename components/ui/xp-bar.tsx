"use client"
import { cn } from "@/lib/utils"

interface XPBarProps {
  xp?: number
  currentXP?: number
  maxXP?: number
  level: number
  className?: string
}

export function XPBar({ xp, currentXP, maxXP, level, className }: XPBarProps) {
  const xpPerLevel = maxXP ?? 1000

  // Aceita tanto "xp" quanto "currentXP"
  const rawXP = xp ?? currentXP ?? 0
  const safeXP = isNaN(rawXP) || !isFinite(rawXP) ? 0 : Math.max(0, rawXP)

  // XP dentro do nível atual
  const xpInCurrentLevel = safeXP % xpPerLevel
  const progress = xpPerLevel > 0 ? (xpInCurrentLevel / xpPerLevel) * 100 : 0
  const safeProgress = isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress))

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold text-secondary">Nível {level}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground">
            {level >= 10 ? "👑 Mestre" :
             level >= 7  ? "💎 Elite" :
             level >= 5  ? "⚡ Lenda" :
             level >= 4  ? "🏆 Campeão" :
             level >= 3  ? "💪 Atleta" :
             level >= 2  ? "🔥 Guerreiro" :
                           "🌱 Iniciante"}
          </span>
        </div>
        <span className="text-accent font-medium text-xs">
          {xpInCurrentLevel} / {xpPerLevel} XP
        </span>
      </div>

      <div className="h-3 bg-muted/30 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-secondary to-accent rounded-full transition-all duration-700 ease-out"
          style={{ width: `${safeProgress}%` }}
        />
        {/* Marcadores de 25%, 50%, 75% */}
        {[25, 50, 75].map((mark) => (
          <div
            key={mark}
            className="absolute top-0 bottom-0 w-px bg-background/20"
            style={{ left: `${mark}%` }}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {xpPerLevel - xpInCurrentLevel} XP para o nível {level + 1}
      </p>
    </div>
  )
}


