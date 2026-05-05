"use client"

import { CheckCircle2, Sparkles, Trophy, Zap } from "lucide-react"
import { useEffect, useState } from "react"

interface SuccessAnimationProps {
  type: "xp" | "achievement" | "workout" | "challenge"
  message: string
  onComplete?: () => void
}

export function SuccessAnimation({ type, message, onComplete }: SuccessAnimationProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      onComplete?.()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  const icons = {
    xp: Zap,
    achievement: Trophy,
    workout: CheckCircle2,
    challenge: Sparkles,
  }

  const Icon = icons[type]

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center gap-4 animate-bounce-in">
        <div className="relative">
          <div className="absolute inset-0 bg-secondary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center animate-spin-slow">
            <Icon className="w-12 h-12 text-background" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-center animate-slide-up">{message}</h3>
      </div>
    </div>
  )
}
