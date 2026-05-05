"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getUser, saveUser, type UserProfile } from "@/lib/user-store"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { CyberInput } from "@/components/ui/cyber-input"
import { XPBar } from "@/components/ui/xp-bar"
import { ArrowLeft, User, Target, Calendar, Trophy, Flame, Camera } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = React.useState<UserProfile | null>(null)
  const [editing, setEditing] = React.useState(false)
  const [name, setName] = React.useState("")

  React.useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(userData)
    setName(userData.name)
  }, [router])

  const handleSave = () => {
    if (!user) return
    const updated = { ...user, name }
    saveUser(updated)
    setUser(updated)
    setEditing(false)
  }

  if (!user) return null

  const memberSince = new Date(user.createdAt).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  })

  return (
    <main className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/settings" className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold">Perfil</h1>
          </div>
          {!editing ? (
            <NeonButton variant="ghost" size="sm" onClick={() => setEditing(true)}>
              Editar
            </NeonButton>
          ) : (
            <NeonButton variant="cyan" size="sm" onClick={handleSave}>
              Salvar
            </NeonButton>
          )}
        </div>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Avatar */}
        <section className="animate-fade-up flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <User className="w-12 h-12 text-background" />
            </div>
            {editing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Camera className="w-4 h-4 text-secondary-foreground" />
              </button>
            )}
          </div>
          {editing ? (
            <div className="mt-4 w-full max-w-xs">
              <CyberInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mt-4">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </>
          )}
        </section>

        {/* Level */}
        <section className="animate-fade-up" style={{ animationDelay: "100ms" }}>
          <GlassCard>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Nível Atual</p>
                <p className="text-2xl font-bold">Nível {user.level}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-secondary">{user.xp} XP</p>
              </div>
            </div>
            <XPBar currentXP={user.xp} level={user.level} />
          </GlassCard>
        </section>

        {/* Stats */}
        <section className="animate-fade-up" style={{ animationDelay: "200ms" }}>
          <GlassCard>
            <h3 className="font-semibold mb-4">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-lg font-bold">{user.streak}</p>
                  <p className="text-xs text-muted-foreground">Dias seguidos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-lg font-bold">{user.achievements.filter((a) => a.progress >= a.target).length}</p>
                  <p className="text-xs text-muted-foreground">Conquistas</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Goals */}
        <section className="animate-fade-up" style={{ animationDelay: "300ms" }}>
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Objetivo Principal</p>
                <p className="font-medium capitalize">{user.goals.primary || "Não definido"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Membro desde</p>
                <p className="font-medium capitalize">{memberSince}</p>
              </div>
            </div>
          </GlassCard>
        </section>
      </div>
    </main>
  )
}
