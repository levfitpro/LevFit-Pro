"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home, Apple, TrendingUp, Trophy,
  Settings, User, History, BarChart3, Zap,
  Video, BookOpen, Calculator, Brain, Share2,
  Droplet, MoreHorizontal, X,
} from "lucide-react"
import Image from "next/image"
import { RemindersPanel } from "./reminders-panel"
import { useState } from "react"

const primaryNav = [
  { href: "/dashboard",  icon: Home,       label: "Início"    },
  { href: "/workouts",   icon: Home,       label: "Treinos"   },
  { href: "/nutrition",  icon: Apple,      label: "Nutrição"  },
  { href: "/progress",   icon: TrendingUp, label: "Progresso" },
  { href: "/challenges", icon: Zap,        label: "Desafios"  },
]

const moreNav = [
  { href: "/history",            icon: History,    label: "Histórico"    },
  { href: "/reports",            icon: BarChart3,  label: "Relatórios"   },
  { href: "/hydration",          icon: Droplet,    label: "Hidratação"   },
  { href: "/achievements",       icon: Trophy,     label: "Conquistas"   },
  { href: "/videos",             icon: Video,      label: "Vídeos"       },
  { href: "/recipes",            icon: BookOpen,   label: "Receitas"     },
  { href: "/calorie-calculator", icon: Calculator, label: "Calorias"     },
  { href: "/biology-insights",   icon: Brain,      label: "Bio Insights" },
  { href: "/personal-plan",      icon: User,       label: "Meu Plano"    },
  { href: "/sharing",            icon: Share2,     label: "Compartilhar" },
]

export function NavBar() {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      {/* Drawer "Mais" */}
      {showMore && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)}>
          <div
            className="fixed bottom-20 left-0 right-0 z-50 glass border-t border-border/50 px-4 py-4 max-w-lg mx-auto rounded-t-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-muted-foreground">Mais funcionalidades</span>
              <button onClick={() => setShowMore(false)} className="p-1 rounded-lg hover:bg-muted/50">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {moreNav.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMore(false)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-secondary/20 text-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium text-center leading-tight">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav principal */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50">
        <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
          {primaryNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 min-w-[56px]",
                  isActive ? "text-secondary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn("p-1.5 rounded-xl transition-all", isActive && "bg-secondary/20")}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}

          {/* Botão Mais */}
          <button
            onClick={() => setShowMore((v) => !v)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 min-w-[56px]",
              showMore ? "text-secondary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn("p-1.5 rounded-xl transition-all", showMore && "bg-secondary/20")}>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Mais</span>
          </button>
        </div>
      </nav>
    </>
  )
}

export function TopBar() {
  const router = useRouter()
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/dashboard")}>
            <Image
              src="/topbar-logo.png"
              alt="LevFit Pro"
              width={200}
              height={58}
              priority
              style={{ objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(0,193,212,0.5))" }}
            />
          </div>
          <div className="flex items-center gap-1">
          <RemindersPanel />
          <Link href="/settings" className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </Link>
          <Link href="/profile" className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <User className="w-5 h-5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </header>
  )
}

