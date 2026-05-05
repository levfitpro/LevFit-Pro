"use client"

import * as React from "react"
import { Bell, X, Droplets, Moon, Dumbbell, Apple, Check, Clock } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { cn } from "@/lib/utils"
import { getTodayProgress, updateProgress } from "@/lib/user-store"

interface Reminder {
  id: string
  type: "water" | "sleep" | "exercise" | "nutrition"
  title: string
  message: string
  iconType: "water" | "sleep" | "exercise" | "nutrition"
  color: "cyan" | "gold"
  time: string
  completed: boolean
}

const STORAGE_KEY = "levfit_reminders"

const getIcon = (iconType: string) => {
  switch (iconType) {
    case "water":
      return Droplets
    case "sleep":
      return Moon
    case "exercise":
      return Dumbbell
    case "nutrition":
      return Apple
    default:
      return Bell
  }
}

function getReminders(): Reminder[] {
  if (typeof window === "undefined") return []
  const today = new Date().toISOString().split("T")[0]
  const stored = localStorage.getItem(`${STORAGE_KEY}_${today}`)
  if (stored) return JSON.parse(stored)

  return [
    {
      id: "water-1",
      type: "water",
      title: "Hidratacao",
      message: "Hora de beber agua! Mantenha-se hidratado.",
      iconType: "water",
      color: "cyan",
      time: "08:00",
      completed: false,
    },
    {
      id: "exercise-1",
      type: "exercise",
      title: "Treino do dia",
      message: "Nao esqueca do seu treino! Seu corpo agradece.",
      iconType: "exercise",
      color: "gold",
      time: "10:00",
      completed: false,
    },
    {
      id: "nutrition-1",
      type: "nutrition",
      title: "Hora do almoco",
      message: "Faca uma refeicao equilibrada com proteinas e vegetais.",
      iconType: "nutrition",
      color: "cyan",
      time: "12:00",
      completed: false,
    },
    {
      id: "water-2",
      type: "water",
      title: "Hidratacao",
      message: "Mais um copo de agua! Ja bebeu 2L hoje?",
      iconType: "water",
      color: "cyan",
      time: "15:00",
      completed: false,
    },
    {
      id: "nutrition-2",
      type: "nutrition",
      title: "Lanche da tarde",
      message: "Um lanche saudavel mantem seu metabolismo ativo.",
      iconType: "nutrition",
      color: "gold",
      time: "16:00",
      completed: false,
    },
    {
      id: "sleep-1",
      type: "sleep",
      title: "Preparar para dormir",
      message: "Comece a se preparar para uma boa noite de sono.",
      iconType: "sleep",
      color: "cyan",
      time: "22:00",
      completed: false,
    },
  ]
}

function saveReminders(reminders: Reminder[]) {
  const today = new Date().toISOString().split("T")[0]
  localStorage.setItem(`${STORAGE_KEY}_${today}`, JSON.stringify(reminders))
}

export function RemindersPanel() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [reminders, setReminders] = React.useState<Reminder[]>([])
  const [showNotification, setShowNotification] = React.useState(false)
  const [currentNotification, setCurrentNotification] = React.useState<Reminder | null>(null)

  React.useEffect(() => {
    setReminders(getReminders())
  }, [])

  React.useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      const dueReminder = reminders.find(
        (r) =>
          !r.completed &&
          r.time <= currentTime &&
          r.time >
            `${(now.getHours() - 1).toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
      )

      if (dueReminder && !showNotification) {
        setCurrentNotification(dueReminder)
        setShowNotification(true)
      }
    }

    const interval = setInterval(checkReminders, 60000)
    checkReminders()

    return () => clearInterval(interval)
  }, [reminders, showNotification])

  const handleComplete = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, completed: true } : r))
    setReminders(updated)
    saveReminders(updated)

    const reminder = reminders.find((r) => r.id === id)
    if (reminder?.type === "water") {
      const progress = getTodayProgress()
      updateProgress({ waterIntake: progress.waterIntake + 250 })
    }
  }

  const completedCount = reminders.filter((r) => r.completed).length
  const pendingCount = reminders.length - completedCount

  return (
    <>
      {showNotification && currentNotification && (
        <div className="fixed top-16 left-2 right-2 sm:top-20 sm:left-4 sm:right-4 z-[100] max-w-md mx-auto animate-slide-down">
          <GlassCard variant="neon" neonColor={currentNotification.color} className="p-3 sm:p-4 shadow-2xl">
            <div className="flex items-start gap-2 sm:gap-3">
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0",
                  currentNotification.color === "cyan" ? "bg-secondary/20" : "bg-accent/20",
                )}
              >
                {React.createElement(getIcon(currentNotification.iconType), {
                  className: cn(
                    "w-4 h-4 sm:w-5 sm:h-5",
                    currentNotification.color === "cyan" ? "text-secondary" : "text-accent",
                  ),
                })}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs sm:text-sm">{currentNotification.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1 line-clamp-2">
                  {currentNotification.message}
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="p-1 hover:bg-muted/30 rounded-lg transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-3">
              <NeonButton
                variant={currentNotification.color}
                size="sm"
                className="flex-1 text-xs sm:text-sm py-1.5 sm:py-2"
                onClick={() => {
                  handleComplete(currentNotification.id)
                  setShowNotification(false)
                }}
                icon={<Check className="w-3 h-3 sm:w-4 sm:h-4" />}
              >
                Feito
              </NeonButton>
              <NeonButton
                variant="ghost"
                size="sm"
                className="text-xs sm:text-sm py-1.5 sm:py-2"
                onClick={() => setShowNotification(false)}
              >
                Depois
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Bell icon trigger */}
      <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-lg hover:bg-muted/30 transition-colors">
        <Bell className="w-5 h-5" />
        {pendingCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-background text-xs font-bold rounded-full flex items-center justify-center bg-secondary">
            {pendingCount}
          </span>
        )}
      </button>

      {/* Reminders panel - removed framer-motion */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 glass border-l border-border/50 animate-slide-left">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Lembretes</h2>
                  <p className="text-xs text-muted-foreground">
                    {completedCount}/{reminders.length} concluidos
                  </p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress */}
              <div className="px-4 py-3">
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${(completedCount / reminders.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Reminders list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {reminders.map((reminder, index) => {
                  const IconComponent = getIcon(reminder.iconType)
                  return (
                    <div key={reminder.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <GlassCard
                        variant={reminder.completed ? "default" : "elevated"}
                        className={cn("p-4 transition-all", reminder.completed && "opacity-50")}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => !reminder.completed && handleComplete(reminder.id)}
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                              reminder.completed
                                ? "bg-secondary text-background"
                                : reminder.color === "cyan"
                                  ? "bg-secondary/20 hover:bg-secondary/30"
                                  : "bg-accent/20 hover:bg-accent/30",
                            )}
                          >
                            {reminder.completed ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <IconComponent
                                className={cn("w-5 h-5", reminder.color === "cyan" ? "text-secondary" : "text-accent")}
                              />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={cn("font-medium text-sm", reminder.completed && "line-through")}>
                              {reminder.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{reminder.message}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {reminder.time}
                          </div>
                        </div>
                      </GlassCard>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
