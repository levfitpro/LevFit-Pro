"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { loginUser, getUser } from "@/lib/user-store"
import { Dumbbell, Mail, Lock, ArrowLeft } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { CyberInput } from "@/components/ui/cyber-input"
import { GlassCard } from "@/components/ui/glass-card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const user = getUser()
    if (user) router.push("/dashboard")
  }, [router])

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateEmail(email)) {
      setError("Email inválido")
      return
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setLoading(true)
    try {
      const user = await loginUser(email, password)
      if (user) {
        const hasBiologyProfile = !!localStorage.getItem("biology_profile")
        router.push(hasBiologyProfile ? "/dashboard" : "/quiz/biology")
      } else {
        setError("Email ou senha incorretos")
      }
    } catch (err) {
      setError("Erro ao entrar. Tente novamente.")
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <header className="p-4 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </Link>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <Dumbbell className="w-9 h-9 text-background" />
            </div>
            <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
            <p className="text-muted-foreground text-center">Entre para continuar sua jornada fitness</p>
          </div>

          <GlassCard variant="neon" neonColor="cyan">
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
              <CyberInput
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                error={error}
                required
              />
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-secondary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <NeonButton type="submit" variant="cyan" size="lg" loading={loading} className="w-full">
                Entrar
              </NeonButton>
            </form>
          </GlassCard>

          <p className="text-center text-muted-foreground mt-6">
            Não tem conta?{" "}
            <Link href="/register" className="text-secondary hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

