"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/user-store"
import Image from "next/image"

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
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">

      {/* Animated background blobs */}
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

        {/* Logo animada */}
        <div
          className="relative flex items-center justify-center mx-auto"
          style={{
            width: 280,
            height: 280,
            animation: "splashFadeZoom 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
            opacity: 0,
          }}
        >
          {/* Glow pulsante atrás da logo */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,193,212,0.25) 0%, transparent 70%)",
              animation: "glowPulse 2.4s ease-in-out infinite",
            }}
          />

          {/* Logo */}
          <Image
            src="/splash-logo.png"
            alt="LevFit Pro"
            width={280}
            height={280}
            priority
            style={{
              objectFit: "contain",
              filter: "drop-shadow(0 0 18px rgba(0,193,212,0.7)) drop-shadow(0 0 40px rgba(0,193,212,0.35))",
              animation: "logoPulseGlow 2.4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Loading bar */}
        <div
          className="w-48 mx-auto"
          style={{
            animation: "splashFadeZoom 0.9s cubic-bezier(0.22, 1, 0.36, 1) 600ms forwards",
            opacity: 0,
          }}
        >
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
      <div
        className="absolute bottom-8 text-center"
        style={{
          animation: "splashFadeZoom 0.9s cubic-bezier(0.22, 1, 0.36, 1) 900ms forwards",
          opacity: 0,
        }}
      >
        <p className="text-xs text-muted-foreground/50">Powered by AI</p>
      </div>

      {/* Keyframes injetados */}
      <style>{`
        @keyframes splashFadeZoom {
          from {
            opacity: 0;
            transform: scale(0.82);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.12);
            opacity: 1;
          }
        }

        @keyframes logoPulseGlow {
          0%, 100% {
            filter: drop-shadow(0 0 18px rgba(0,193,212,0.7)) drop-shadow(0 0 40px rgba(0,193,212,0.35));
          }
          50% {
            filter: drop-shadow(0 0 32px rgba(0,193,212,1)) drop-shadow(0 0 70px rgba(0,193,212,0.55));
          }
        }
      `}</style>
    </main>
  )
}

