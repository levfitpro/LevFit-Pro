"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/user-store"
import { Dumbbell, Zap, Trophy, Brain } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [showSplash, setShowSplash] = React.useState(true)

  React.useEffect(() => {
    // Check if already visited
    const visited = sessionStorage.getItem("levfit_visited")

    if (!visited) {
      sessionStorage.setItem("levfit_visited", "true")
      router.push("/splash")
    } else {
      const user = getUser()
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/welcome")
      }
    }
  }, [router])

  const features = [
    { icon: Brain, title: "IA Inteligente", desc: "Planos personalizados com inteligência artificial" },
    { icon: Dumbbell, title: "Treinos Adaptativos", desc: "Exercícios que evoluem com você" },
    { icon: Trophy, title: "Gamificação", desc: "Conquistas, XP e recompensas diárias" },
    { icon: Zap, title: "Resultados Rápidos", desc: "Acompanhe seu progresso em tempo real" },
  ]

  return null
}
