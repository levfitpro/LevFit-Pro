"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/user-store"

export default function SplashScreen() {
  const router = useRouter()
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 30)

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
        {/* Logo */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-56 h-56 mx-auto">
            <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="1"
                strokeDasharray="10 5"
                className="opacity-30"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2EECC5" />
                  <stop offset="100%" stopColor="#0A8F6E" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <img
            src="/splash-logo.png"
            alt="LevFit Pro"
            className="w-56 h-56 object-contain animate-scale-in drop-shadow-[0_0_30px_rgba(46,236,197,0.4)]"
          />
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
