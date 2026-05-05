"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const CyberInput = React.forwardRef<HTMLInputElement, CyberInputProps>(
  ({ className, label, error, icon, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}
        <div
          className={cn(
            "relative flex items-center rounded-lg transition-all duration-300",
            "bg-input/50 backdrop-blur-sm border",
            isFocused
              ? "border-secondary shadow-[0_0_15px_rgba(0,193,212,0.2)]"
              : "border-border hover:border-secondary/50",
            error && "border-destructive",
          )}
        >
          {icon && (
            <span
              className={cn(
                "pl-4 transition-colors duration-300",
                isFocused ? "text-secondary" : "text-muted-foreground",
              )}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "flex-1 bg-transparent px-4 py-3 text-foreground",
              "placeholder:text-muted-foreground/50",
              "focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-2",
              className,
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-destructive animate-fade-up">{error}</p>}
      </div>
    )
  },
)
CyberInput.displayName = "CyberInput"

export { CyberInput }
