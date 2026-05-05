"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { GlassCard } from "./glass-card"

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "cyan" | "gold"
  className?: string
}

export function StatCard({ title, value, unit, icon, trend, color = "cyan", className }: StatCardProps) {
  return (
    <GlassCard variant="elevated" className={cn("group cursor-default", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                "text-3xl font-bold transition-colors",
                color === "cyan"
                  ? "text-secondary group-hover:neon-text-cyan"
                  : "text-accent group-hover:neon-text-gold",
              )}
            >
              {value}
            </span>
            {unit && <span className="text-muted-foreground text-sm">{unit}</span>}
          </div>
          {trend && (
            <div
              className={cn("text-xs flex items-center gap-1", trend.isPositive ? "text-green-400" : "text-red-400")}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs semana passada</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-xl transition-all duration-300",
            color === "cyan"
              ? "bg-secondary/10 text-secondary group-hover:bg-secondary/20"
              : "bg-accent/10 text-accent group-hover:bg-accent/20",
          )}
        >
          {icon}
        </div>
      </div>
    </GlassCard>
  )
}
