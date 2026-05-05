"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cyan" | "gold" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  icon?: React.ReactNode
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "cyan", size = "md", loading, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-300",
          "rounded-lg overflow-hidden",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-95",
          // Size variants
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-6 py-3 text-base",
          size === "lg" && "px-8 py-4 text-lg",
          // Color variants
          variant === "cyan" && [
            "bg-secondary/20 text-secondary border border-secondary/50",
            "hover:bg-secondary hover:text-secondary-foreground",
            "hover:shadow-[0_0_20px_rgba(0,193,212,0.5)]",
            "focus:ring-2 focus:ring-secondary/50",
          ],
          variant === "gold" && [
            "bg-accent/20 text-accent border border-accent/50",
            "hover:bg-accent hover:text-accent-foreground",
            "hover:shadow-[0_0_20px_rgba(248,180,0,0.5)]",
            "focus:ring-2 focus:ring-accent/50",
          ],
          variant === "ghost" && [
            "bg-transparent text-foreground border border-border",
            "hover:bg-muted hover:border-secondary/50",
          ],
          className,
        )}
        {...props}
      >
        {loading ? (
          <Spinner className="h-5 w-5" />
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </button>
    )
  },
)
NeonButton.displayName = "NeonButton"

export { NeonButton }
