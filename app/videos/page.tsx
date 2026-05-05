"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TopBar, NavBar } from "@/components/levfit/nav-bar"
import { GlassCard } from "@/components/ui/glass-card"
import { Play, Clock, Flame, ChevronLeft, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Video {
  id: string
  title: string
  instructor: string
  duration: number
  calories: number
  difficulty: "iniciante" | "intermediário" | "avançado"
  category: string
  description: string
  thumbnail: string
  tips: string[]
  recommended?: boolean
}

const ALL_VIDEOS: Video[] = [
  { id: "1", title: "HIIT Queima Gordura 30min", instructor: "Coach Ana", duration: 30, calories: 350, difficulty: "intermediário", category: "Cardio", description: "Treino intervalado de alta intensidade para queima máxima de gordura. Sem equipamentos necessários.", thumbnail: "🔥", tips: ["Mantenha o core ativado", "Descanse quando necessário", "Hidrate-se antes e depois"] },
  { id: "2", title: "Cardio Iniciante 20min", instructor: "Coach Pedro", duration: 20, calories: 200, difficulty: "iniciante", category: "Cardio", description: "Perfeito para quem está começando. Movimentos simples com impacto progressivo.", thumbnail: "💨", tips: ["Respire pelo nariz", "Não force além do limite", "Foque na respiração"] },
  { id: "3", title: "Corrida Funcional 45min", instructor: "Coach Marina", duration: 45, calories: 480, difficulty: "avançado", category: "Cardio", description: "Combinação de corrida com exercícios funcionais para condicionamento total.", thumbnail: "🏃", tips: ["Aqueça por 10 min antes", "Mantenha postura ereta", "Controle o ritmo"] },
  { id: "4", title: "Dance Cardio 25min", instructor: "Coach Julia", duration: 25, calories: 280, difficulty: "iniciante", category: "Cardio", description: "Treino divertido com movimentos de dança para queimar calorias sorrindo.", thumbnail: "💃", tips: ["Divirta-se!", "Siga o ritmo da música", "Adapte os movimentos"] },
  { id: "5", title: "Hipertrofia Upper Body 40min", instructor: "Coach Carlos", duration: 40, calories: 320, difficulty: "intermediário", category: "Força", description: "Foco em peito, costas, ombros e braços para ganho de massa muscular.", thumbnail: "💪", tips: ["Controle a descida do peso", "Respire na fase de força", "Descanse 60-90s entre séries"] },
  { id: "6", title: "Leg Day Completo 50min", instructor: "Coach Rafael", duration: 50, calories: 400, difficulty: "avançado", category: "Força", description: "Treino completo de pernas com agachamento, terra e exercícios isoladores.", thumbnail: "🦵", tips: ["Aqueça os joelhos bem", "Não arredonde a lombar", "Use calçado adequado"] },
  { id: "7", title: "Força para Iniciantes 30min", instructor: "Coach Bia", duration: 30, calories: 250, difficulty: "iniciante", category: "Força", description: "Introdução ao treino de força com peso corporal e técnica perfeita.", thumbnail: "🏋️", tips: ["Aprenda a forma antes do peso", "Progrida gradualmente", "Foque na contração muscular"] },
  { id: "8", title: "Full Body Funcional 35min", instructor: "Coach Thiago", duration: 35, calories: 360, difficulty: "intermediário", category: "Força", description: "Treino de corpo inteiro com movimentos funcionais.", thumbnail: "⚡", tips: ["Mantenha postura neutra", "Ative o core sempre", "Respire de forma controlada"] },
  { id: "9", title: "Yoga Flow Matinal 20min", instructor: "Coach Camila", duration: 20, calories: 120, difficulty: "iniciante", category: "Flexibilidade", description: "Sequência de yoga para despertar o corpo e aliviar tensões.", thumbnail: "🧘", tips: ["Faça em jejum pela manhã", "Respire profundamente", "Não force demais"] },
  { id: "10", title: "Alongamento Pós-Treino 15min", instructor: "Coach Ana", duration: 15, calories: 80, difficulty: "iniciante", category: "Flexibilidade", description: "Sequência essencial de alongamentos para recuperação muscular.", thumbnail: "🤸", tips: ["Faça logo após o treino", "Mantenha cada posição por 30s", "Respire nas tensões"] },
  { id: "11", title: "Mobilidade Articular 25min", instructor: "Coach Marina", duration: 25, calories: 100, difficulty: "intermediário", category: "Flexibilidade", description: "Trabalha mobilidade de quadril, ombros e tornozelos.", thumbnail: "🔄", tips: ["Movimentos lentos e controlados", "Sinta cada articulação", "Pratique diariamente"] },
  { id: "12", title: "Abdominal Intenso 20min", instructor: "Coach Pedro", duration: 20, calories: 180, difficulty: "intermediário", category: "Core", description: "Séries intensas focadas no core completo.", thumbnail: "🎯", tips: ["Não prenda a respiração", "Qualidade sobre quantidade", "Proteja a lombar"] },
  { id: "13", title: "Prancha Challenge 15min", instructor: "Coach Julia", duration: 15, calories: 150, difficulty: "avançado", category: "Core", description: "Variações de prancha progressivas para fortalecer o core profundo.", thumbnail: "⏱️", tips: ["Mantenha quadril nivelado", "Contraia o abdômen", "Respire normalmente"] },
  { id: "14", title: "Core para Iniciantes 20min", instructor: "Coach Bia", duration: 20, calories: 140, difficulty: "iniciante", category: "Core", description: "Exercícios seguros para fortalecer o core sem lesionar a lombar.", thumbnail: "🌟", tips: ["Apoie a lombar no chão", "Comece devagar", "Sinta a contração"] },
]

const categories = ["Todos", "Cardio", "Força", "Flexibilidade", "Core"]
const difficulties = ["Todos", "iniciante", "intermediário", "avançado"]
const difficultyColor = {
  iniciante: "text-green-400 bg-green-400/10",
  intermediário: "text-amber-400 bg-amber-400/10",
  avançado: "text-red-400 bg-red-400/10",
}

export default function VideosPage() {
  const router = useRouter()
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [category, setCategory] = useState("Todos")
  const [difficulty, setDifficulty] = useState("Todos")

  useEffect(() => {
    const plan = localStorage.getItem("personal_plan")
    if (plan) {
      const p = JSON.parse(plan)
      const objetivo = p.workoutType || ""
      ALL_VIDEOS.forEach((v) => {
        if (objetivo.includes("HIIT") && v.category === "Cardio") v.recommended = true
        if (objetivo.includes("Hipertrofia") && v.category === "Força") v.recommended = true
        if (objetivo.includes("Mobilidade") && v.category === "Flexibilidade") v.recommended = true
      })
    }
  }, [])

  const filtered = ALL_VIDEOS.filter((v) => {
    const matchCategory = category === "Todos" || v.category === category
    const matchDifficulty = difficulty === "Todos" || v.difficulty === difficulty
    return matchCategory && matchDifficulty
  })

  if (selectedVideo) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-24 pt-20">
        <TopBar />
        <div className="max-w-lg mx-auto p-4">
          <button onClick={() => setSelectedVideo(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="w-5 h-5" /> Voltar
          </button>
          <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/20 border border-secondary/20 flex items-center justify-center mb-4">
            <span className="text-7xl">{selectedVideo.thumbnail}</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{selectedVideo.title}</h1>
          <p className="text-muted-foreground text-sm mb-4">por {selectedVideo.instructor}</p>
          <div className="flex gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-sm"><Clock className="w-4 h-4 text-secondary" />{selectedVideo.duration} min</div>
            <div className="flex items-center gap-1.5 text-sm"><Flame className="w-4 h-4 text-accent" />{selectedVideo.calories} kcal</div>
            <span className={cn("text-xs px-2 py-1 rounded-full font-medium", difficultyColor[selectedVideo.difficulty])}>{selectedVideo.difficulty}</span>
          </div>
          <GlassCard className="p-4 mb-4">
            <p className="text-sm text-foreground/80 leading-relaxed">{selectedVideo.description}</p>
          </GlassCard>
          <GlassCard className="p-4 mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-accent" />Dicas importantes</h3>
            <div className="space-y-2">
              {selectedVideo.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-secondary font-bold flex-shrink-0">{i + 1}.</span>
                  <span className="text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </GlassCard>
          <button onClick={() => router.push("/workouts")} className="w-full py-4 rounded-2xl bg-gradient-to-r from-secondary to-accent text-background font-bold text-lg flex items-center justify-center gap-2">
            <Play className="w-6 h-6" /> Iniciar Treino Guiado
          </button>
        </div>
        <NavBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-20">
      <TopBar />
      <div className="max-w-lg mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Play className="w-6 h-6 text-secondary" />Vídeos de Treino</h1>
            <p className="text-muted-foreground text-sm">{ALL_VIDEOS.length} treinos disponíveis</p>
          </div>
          <button onClick={() => router.push("/dashboard")} className="p-2 rounded-lg hover:bg-muted/50">×</button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0", category === cat ? "bg-secondary text-background" : "bg-muted/40 text-muted-foreground hover:bg-muted/60")}>{cat}</button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {difficulties.map((diff) => (
            <button key={diff} onClick={() => setDifficulty(diff)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 capitalize", difficulty === diff ? "bg-accent text-background" : "bg-muted/40 text-muted-foreground hover:bg-muted/60")}>{diff}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((video) => (
            <button key={video.id} onClick={() => setSelectedVideo(video)} className="w-full text-left">
              <GlassCard className={cn("p-4 hover:border-secondary/40 transition-all", video.recommended && "border-secondary/30 bg-secondary/5")}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center flex-shrink-0 text-2xl">{video.thumbnail}</div>
                  <div className="flex-1 min-w-0">
                    {video.recommended && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary/20 text-secondary font-medium">Recomendado</span>}
                    <p className="font-semibold text-sm leading-tight mt-0.5">{video.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{video.instructor}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{video.duration}min</span>
                      <span className="flex items-center gap-1 text-xs text-accent"><Flame className="w-3 h-3" />{video.calories} kcal</span>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", difficultyColor[video.difficulty])}>{video.difficulty}</span>
                    </div>
                  </div>
                  <Play className="w-5 h-5 text-secondary flex-shrink-0" />
                </div>
              </GlassCard>
            </button>
          ))}
        </div>
      </div>
      <NavBar />
    </div>
  )
}
