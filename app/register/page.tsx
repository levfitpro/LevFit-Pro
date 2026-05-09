"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createUser, getUser } from "@/lib/user-store"
import { Mail, Lock, User, ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import Image from "next/image"
import { NeonButton } from "@/components/ui/neon-button"
import { CyberInput } from "@/components/ui/cyber-input"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "Pelo menos 6 caracteres", ok: password.length >= 6 },
    { label: "Letra maiúscula", ok: /[A-Z]/.test(password) },
    { label: "Número", ok: /[0-9]/.test(password) },
  ]

  if (password.length === 0) return null

  return (
    <div className="mt-2 space-y-1">
      {checks.map((c) => (
        <div key={c.label} className="flex items-center gap-2 text-xs">
          {c.ok
            ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
            : <XCircle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          }
          <span className={c.ok ? "text-green-400" : "text-muted-foreground"}>{c.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
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

    if (name.trim().length < 2) {
      setError("O nome deve ter pelo menos 2 caracteres")
      return
    }
    if (!validateEmail(email)) {
      setError("Email inválido")
      return
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    setLoading(true)
    try {
      await createUser(name, email, password)
      router.push("/quiz/biology")
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.")
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
            <Image
                src="/icone.png"
                alt="LevFit Pro"
                width={72}
                height={72}
                priority
                style={{ borderRadius: 18, filter: "drop-shadow(0 0 12px rgba(0,193,212,0.5))" }}
              />
            <h1 className="text-2xl font-bold">Criar Conta</h1>
            <p className="text-muted-foreground text-center">Comece sua transformação fitness hoje</p>
          </div>

          <GlassCard variant="neon" neonColor="cyan">
            <form onSubmit={handleSubmit} className="space-y-4">
              <CyberInput
                label="Nome completo"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-5 h-5" />}
                required
              />
              <CyberInput
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                required
              />
              <div>
                <CyberInput
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5" />}
                  required
                />
                <PasswordStrength password={password} />
              </div>
              <CyberInput
                label="Confirmar Senha"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                error={error}
                required
              />

              <NeonButton type="submit" variant="cyan" size="lg" loading={loading} className="w-full mt-2">
                Criar Conta Grátis
              </NeonButton>
            </form>
          </GlassCard>

          <p className="text-center text-muted-foreground mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-secondary hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}


