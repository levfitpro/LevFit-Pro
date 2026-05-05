"use client"
import { cn } from "@/lib/utils"

interface ProgressRingProps {
  value?: number      // 0-100
  progress?: number   // 0-100 (alias para value)
  size?: number
  strokeWidth?: number
  color?: "cyan" | "gold"
  showValue?: boolean
  label?: string
  className?: string
  children?: React.ReactNode
}

export function ProgressRing({
  value,
  progress,
  size = 120,
  strokeWidth = 8,
  color = "cyan",
  showValue = true,
  label,
  className,
  children,
}: ProgressRingProps) {
  // Aceita tanto "value" quanto "progress", garante que nunca é NaN
  const raw = value ?? progress ?? 0
  const safeProgress = isNaN(raw) || !isFinite(raw) ? 0 : Math.min(100, Math.max(0, raw))

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (safeProgress / 100) * circumference

  const colorClass = color === "cyan" ? "stroke-secondary" : "stroke-accent"
  const glowColor = color === "cyan" ? "rgba(0, 193, 212, 0.5)" : "rgba(248, 180, 0, 0.5)"

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90" style={{ background: "transparent" }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(colorClass, "transition-all duration-500 ease-out")}
        />
      </svg>

      {/* Conteúdo central */}
      {children ? (
        <div className="absolute flex flex-col items-center justify-center">
          {children}
        </div>
      ) : showValue ? (
        <div className="absolute flex flex-col items-center">
          <span className={cn("text-2xl font-bold", color === "cyan" ? "text-secondary" : "text-accent")}>
            {Math.round(safeProgress)}%
          </span>
          {label && <span className="text-xs text-muted-foreground">{label}</span>}
        </div>
      ) : null}
    </div>
  )
}


