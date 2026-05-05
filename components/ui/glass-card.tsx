"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "neon"
  neonColor?: "cyan" | "gold"
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", neonColor = "cyan", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl p-6 transition-all duration-300",
          variant === "default" && "glass-card",
          variant === "elevated" && "glass-card hover:translate-y-[-4px] hover:shadow-2xl",
          variant === "neon" && [
            "glass-card",
            neonColor === "cyan" && "neon-border-cyan",
            neonColor === "gold" && "neon-border-gold",
          ],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
