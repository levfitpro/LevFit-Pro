"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Dumbbell } from "lucide-react"
import { getUser } from "@/lib/user-store"

export default function SplashScreen() {
  const router = useRouter()
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 30)

    // Navigate after animation
    const timer = setTimeout(() => {
      const user = getUser()
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/")
      }
    }, 2500)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(timer)
    }
  }, [router])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[80px] animate-float" />
        <div
          className="absolute top-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-[60px] animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,193,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,193,212,0.3) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Logo with animation */}
        <div className="relative">
          {/* Outer ring */}
          <div className="absolute inset-0 w-32 h-32 mx-auto">
            <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="1"
                strokeDasharray="10 5"
                className="opacity-50"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00C1D4" />
                  <stop offset="100%" stopColor="#F8B400" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Logo container */}
          <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-secondary via-secondary/80 to-accent flex items-center justify-center animate-scale-in shadow-2xl shadow-secondary/30">
            <Dumbbell className="w-16 h-16 text-background animate-pulse" />
          </div>
        </div>

        {/* App name with staggered animation */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold animate-fade-up" style={{ animationDelay: "300ms" }}>
            <span className="text-secondary neon-text-cyan">Lev</span>
            <span className="text-foreground">Fit</span>
            <span className="text-accent"> Pro</span>
          </h1>
          <p
            className="text-muted-foreground animate-fade-up text-sm tracking-widest uppercase"
            style={{ animationDelay: "500ms" }}
          >
            Transforme seu corpo
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-48 mx-auto animate-fade-up" style={{ animationDelay: "700ms" }}>
          <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary to-accent rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-mono">{progress}%</p>
        </div>
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-8 text-center animate-fade-up" style={{ animationDelay: "900ms" }}>
        <p className="text-xs text-muted-foreground/50">Powered by AI</p>
      </div>
    </main>
  )
}
