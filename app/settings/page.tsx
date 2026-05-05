"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getUser, type UserProfile } from "@/lib/user-store"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, User, Bell, Moon, Shield, HelpCircle, LogOut, ChevronRight, Database } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = React.useState<UserProfile | null>(null)
  const [notifications, setNotifications] = React.useState(true)
  const [darkMode, setDarkMode] = React.useState(true)

  React.useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(userData)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("levfit_user")
    router.push("/")
  }

  const settingsGroups = [
    {
      title: "Conta",
      items: [
        {
          icon: User,
          label: "Perfil",
          href: "/profile",
          action: "link",
        },
        {
          icon: Bell,
          label: "Notificações",
          action: "toggle",
          value: notifications,
          onChange: () => setNotifications(!notifications),
        },
      ],
    },
    {
      title: "Preferências",
      items: [
        {
          icon: Moon,
          label: "Tema Escuro",
          action: "toggle",
          value: darkMode,
          onChange: () => setDarkMode(!darkMode),
        },
        {
          icon: Database,
          label: "Sincronizar Dados",
          action: "link",
          href: "#",
        },
      ],
    },
    {
      title: "Suporte",
      items: [
        {
          icon: HelpCircle,
          label: "Ajuda & FAQ",
          action: "link",
          href: "#",
        },
        {
          icon: Shield,
          label: "Privacidade",
          action: "link",
          href: "#",
        },
      ],
    },
  ]

  if (!user) return null

  return (
    <main className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="flex items-center gap-4 px-4 py-4 max-w-lg mx-auto">
          <Link href="/dashboard" className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">Configurações</h1>
        </div>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* User Info */}
        <section className="animate-fade-up">
          <GlassCard variant="elevated">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <User className="w-8 h-8 text-background" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Link href="/profile">
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
            </div>
          </GlassCard>
        </section>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <section
            key={group.title}
            className="animate-fade-up space-y-3"
            style={{ animationDelay: `${(groupIndex + 1) * 100}ms` }}
          >
            <h3 className="text-sm text-muted-foreground px-1">{group.title}</h3>
            <GlassCard className="divide-y divide-border/50">
              {group.items.map((item) => (
                <div key={item.label} className="py-4 first:pt-0 last:pb-0">
                  {item.action === "link" ? (
                    <Link href={item.href || "#"} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <Switch checked={item.value} onCheckedChange={item.onChange} />
                    </div>
                  )}
                </div>
              ))}
            </GlassCard>
          </section>
        ))}

        {/* Logout */}
        <section className="animate-fade-up" style={{ animationDelay: "400ms" }}>
          <NeonButton
            variant="ghost"
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
            icon={<LogOut className="w-5 h-5" />}
          >
            Sair da Conta
          </NeonButton>
        </section>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground">LevFit Pro v1.0.0</p>
      </div>
    </main>
  )
}
