"use client"

import * as React from "react"
import Link from "next/link"
import { Dumbbell, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { CyberInput } from "@/components/ui/cyber-input"
import { GlassCard } from "@/components/ui/glass-card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="p-4 relative z-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </Link>
      </header>

      {/* Form */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10">
        <div className="w-full max-w-sm animate-fade-up">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <Dumbbell className="w-9 h-9 text-background" />
            </div>
            <h1 className="text-2xl font-bold">Recuperar Senha</h1>
            <p className="text-muted-foreground text-center">Digite seu email para receber o link de recuperação</p>
          </div>

          <GlassCard variant="neon" neonColor="cyan">
            {sent ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="font-semibold">Email Enviado!</h2>
                <p className="text-sm text-muted-foreground">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
                <Link href="/login">
                  <NeonButton variant="ghost" className="mt-4">
                    Voltar ao Login
                  </NeonButton>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <CyberInput
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-5 h-5" />}
                  required
                />

                <NeonButton type="submit" variant="cyan" size="lg" loading={loading} className="w-full">
                  Enviar Link
                </NeonButton>
              </form>
            )}
          </GlassCard>
        </div>
      </section>
    </main>
  )
}
