"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/user-store"
import { Dumbbell, Zap, Trophy, Brain } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { GlassCard } from "@/components/ui/glass-card"

export default function WelcomePage() {
  const router = useRouter()

  React.useEffect(() => {
    const user = getUser()
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  const features = [
    { icon: Brain, title: "IA Inteligente", desc: "Planos personalizados com inteligencia artificial" },
    { icon: Dumbbell, title: "Treinos Adaptativos", desc: "Exercicios que evoluem com voce" },
    { icon: Trophy, title: "Gamificacao", desc: "Conquistas, XP e recompensas diarias" },
    { icon: Zap, title: "Resultados Rapidos", desc: "Acompanhe seu progresso em tempo real" },
  ]

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center relative z-10">
        <div className="animate-fade-up space-y-6 max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center animate-float">
              <Dumbbell className="w-9 h-9 text-background" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-balance">
            Transforme seu corpo com <span className="text-secondary neon-text-cyan">IA</span>
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed">
            O aplicativo de fitness mais avancado, unindo design futurista, inteligencia artificial e gamificacao.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <NeonButton variant="cyan" size="lg" onClick={() => router.push("/register")} className="w-full">
              Comecar Agora
            </NeonButton>
            <NeonButton variant="ghost" size="lg" onClick={() => router.push("/login")} className="w-full">
              Ja tenho conta
            </NeonButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 pb-16 relative z-10">
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {features.map((feature, index) => (
            <GlassCard
              key={feature.title}
              variant="elevated"
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-semibold text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </main>
  )
}
