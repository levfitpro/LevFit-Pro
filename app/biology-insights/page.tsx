"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TopBar, NavBar } from "@/components/levfit/nav-bar"
import { GlassCard } from "@/components/ui/glass-card"
import { generatePersonalPlan } from "@/services/personalization-engine"
import type { BiologyProfile } from "@/data/biology-quiz"
import { Brain, Heart, Zap, Moon, Droplets, Apple, Dumbbell, AlertTriangle, ChevronRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Insight {
  category: string
  icon: React.ElementType
  status: "ótimo" | "bom" | "atenção" | "crítico"
  title: string
  description: string
  tip: string
}

function generateInsights(profile: BiologyProfile): Insight[] {
  const a = profile.answers
  const insights: Insight[] = []

  // Q4 - Condicionamento cardiovascular
  const condicionamento = ["Fico muito sem fôlego, preciso parar", "Fico bastante ofegante", "Fico levemente ofegante", "Não sinto quase nada"].indexOf(a[4] as string)
  insights.push({
    category: "Cardiovascular",
    icon: Heart,
    status: condicionamento >= 3 ? "ótimo" : condicionamento >= 2 ? "bom" : condicionamento >= 1 ? "atenção" : "crítico",
    title: "Condicionamento Cardiovascular",
    description: condicionamento >= 3 ? "Seu condicionamento cardiovascular está excelente." : condicionamento >= 2 ? "Bom condicionamento, mas há espaço para melhorar." : condicionamento >= 1 ? "Condicionamento moderado — foco em cardio progressivo." : "Condicionamento baixo — comece com caminhadas e evolua gradualmente.",
    tip: condicionamento < 2 ? "Pratique 30 min de caminhada 3x por semana e aumente gradualmente." : "Inclua treinos de HIIT para elevar ainda mais seu VO2 máx.",
  })

  // Q7 - Força
  const forca = ["Menos de 5", "Entre 5 e 15", "Entre 15 e 30", "Mais de 30"].indexOf(a[7] as string)
  insights.push({
    category: "Força",
    icon: Dumbbell,
    status: forca >= 3 ? "ótimo" : forca >= 2 ? "bom" : forca >= 1 ? "atenção" : "crítico",
    title: "Força Muscular",
    description: forca >= 3 ? "Força muscular acima da média — excelente base para hipertrofia." : forca >= 2 ? "Boa força muscular para continuar evoluindo." : forca >= 1 ? "Força moderada — treinos de resistência progressiva vão ajudar." : "Força baixa — foco em exercícios com peso corporal primeiro.",
    tip: forca < 2 ? "Comece com flexões, agachamentos e remadas com peso corporal antes de adicionar carga." : "Adicione exercícios compostos como supino, agachamento e terra.",
  })

  // Q10 + Q11 - Sono
  const horasSono = Number(a[10] ?? 7)
  const qualidadeSono = ["Exausto, como se não tivesse dormido", "Cansado, preciso de tempo para despertar", "Razoável, demoro um pouco", "Descansado e pronto para o dia"].indexOf(a[11] as string)
  const sonoStatus = horasSono >= 7 && qualidadeSono >= 2 ? "ótimo" : horasSono >= 6 && qualidadeSono >= 1 ? "bom" : horasSono >= 5 ? "atenção" : "crítico"
  insights.push({
    category: "Sono",
    icon: Moon,
    status: sonoStatus,
    title: "Qualidade do Sono",
    description: sonoStatus === "ótimo" ? `${horasSono}h de sono com boa qualidade — base sólida para recuperação muscular.` : sonoStatus === "bom" ? `${horasSono}h de sono com qualidade razoável — pequenas melhorias farão diferença.` : sonoStatus === "atenção" ? `${horasSono}h de sono com qualidade baixa — isso está prejudicando seus resultados.` : `Sono crítico: ${horasSono}h e qualidade ruim — isso sabota hormônios e recuperação.`,
    tip: sonoStatus !== "ótimo" ? "Estabeleça um horário fixo para dormir, evite telas 1h antes e mantenha o quarto escuro e fresco." : "Continue mantendo sua rotina de sono — é um dos seus maiores trunfos.",
  })

  // Q9 - Energia
  const energia = ["Muito cansado, difícil de funcionar", "Cansado na maior parte do tempo", "Energia razoável, com quedas", "Bem disposto na maioria dos dias", "Energia alta o dia todo"].indexOf(a[9] as string)
  insights.push({
    category: "Energia",
    icon: Zap,
    status: energia >= 4 ? "ótimo" : energia >= 3 ? "bom" : energia >= 2 ? "atenção" : "crítico",
    title: "Nível de Energia",
    description: energia >= 4 ? "Energia excelente ao longo do dia — hormônios e metabolismo em ótimo estado." : energia >= 3 ? "Boa energia na maior parte do tempo." : energia >= 2 ? "Energia variável com quedas frequentes — pode indicar nutrição ou sono inadequados." : "Energia muito baixa — verifique sua alimentação, sono e nível de estresse.",
    tip: energia < 3 ? "Evite carboidratos refinados, coma de 3 em 3 horas e priorize sono de qualidade." : "Mantenha sua rotina alimentar e de exercícios para sustentar esse nível.",
  })

  // Q14 - Hidratação
  const coposAgua = Number(a[14] ?? 6)
  const litros = coposAgua * 0.25
  const hidraStatus = litros >= 2.5 ? "ótimo" : litros >= 2 ? "bom" : litros >= 1.5 ? "atenção" : "crítico"
  insights.push({
    category: "Hidratação",
    icon: Droplets,
    status: hidraStatus,
    title: "Hidratação Diária",
    description: hidraStatus === "ótimo" ? `Excelente! Você bebe ${litros.toFixed(1)}L por dia — seu corpo agradece.` : hidraStatus === "bom" ? `${litros.toFixed(1)}L por dia — próximo da meta ideal.` : hidraStatus === "atenção" ? `Apenas ${litros.toFixed(1)}L por dia — abaixo do necessário para performance.` : `Somente ${litros.toFixed(1)}L por dia — desidratação crônica prejudica músculos, foco e metabolismo.`,
    tip: litros < 2 ? "Deixe uma garrafa de 1L na mesa e outra na bolsa. Beba antes de sentir sede." : "Continue assim! Adicione eletrólitos pós-treino para reposição completa.",
  })

  // Q15 - Nutrição
  const nutricao = ["Muito processada (fast food, industrializados)", "Mista (às vezes saudável, às vezes não)", "Majoritariamente natural e caseira", "Muito saudável e controlada"].indexOf(a[15] as string)
  insights.push({
    category: "Nutrição",
    icon: Apple,
    status: nutricao >= 3 ? "ótimo" : nutricao >= 2 ? "bom" : nutricao >= 1 ? "atenção" : "crítico",
    title: "Qualidade Alimentar",
    description: nutricao >= 3 ? "Alimentação excelente — base sólida para resultados acelerados." : nutricao >= 2 ? "Boa alimentação com margem para melhorias." : nutricao >= 1 ? "Alimentação mista — pequenas trocas trarão grandes resultados." : "Alimentação muito processada — isso é o maior obstáculo para seus resultados.",
    tip: nutricao < 2 ? "Comece substituindo 1 refeição processada por dia por algo natural. Pequenos passos, grandes resultados." : "Foque em aumentar proteína e reduzir ultraprocessados para otimizar composição corporal.",
  })

  // Q17 - Estresse
  const estresse = Number(a[17] ?? 5)
  const estresseStatus = estresse <= 3 ? "ótimo" : estresse <= 5 ? "bom" : estresse <= 7 ? "atenção" : "crítico"
  insights.push({
    category: "Estresse",
    icon: Brain,
    status: estresseStatus,
    title: "Nível de Estresse",
    description: estresseStatus === "ótimo" ? "Estresse baixo — ótimo para recuperação muscular e hormônios anabólicos." : estresseStatus === "bom" ? "Estresse moderado e controlável — continue monitorando." : estresseStatus === "atenção" ? `Estresse elevado (${estresse}/10) — isso está afetando seu cortisol e recuperação.` : `Estresse crítico (${estresse}/10) — overtraining pode piorar. Priorize saúde mental antes de tudo.`,
    tip: estresse >= 6 ? "Pratique 10 min de respiração profunda por dia. Reduza treinos de alta intensidade temporariamente." : "Continue com suas práticas de gestão de estresse — estão funcionando.",
  })

  return insights
}

const statusConfig = {
  "ótimo": { color: "text-green-400", bg: "bg-green-400/10 border-green-400/20", label: "Ótimo" },
  "bom": { color: "text-secondary", bg: "bg-secondary/10 border-secondary/20", label: "Bom" },
  "atenção": { color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", label: "Atenção" },
  "crítico": { color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", label: "Crítico" },
}

export default function BiologyInsightsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<BiologyProfile | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [plan, setPlan] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem("biology_profile")
    if (stored) {
      const p: BiologyProfile = JSON.parse(stored)
      setProfile(p)
      setInsights(generateInsights(p))
      setPlan(generatePersonalPlan(p))
    }
  }, [])

  const otimos = insights.filter((i) => i.status === "ótimo").length
  const atencao = insights.filter((i) => i.status === "atenção" || i.status === "crítico").length

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-20">
      <TopBar />

      <div className="max-w-lg mx-auto p-4 space-y-4">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="w-6 h-6 text-secondary" />
              Análise Biológica
            </h1>
            <p className="text-muted-foreground text-sm">Baseada no seu quiz de 17 fatores</p>
          </div>
          <button onClick={() => router.push("/dashboard")} className="p-2 rounded-lg hover:bg-muted/50">×</button>
        </div>

        {!profile ? (
          <GlassCard className="p-8 text-center">
            <Brain className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="font-semibold text-lg">Nenhum perfil encontrado</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Complete o quiz para ver sua análise biológica personalizada</p>
            <button
              onClick={() => router.push("/quiz/biology")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-accent text-background font-semibold"
            >
              Fazer o Quiz Agora
            </button>
          </GlassCard>
        ) : (
          <>
            {/* Score geral */}
            {plan && (
              <GlassCard className="p-5">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="var(--color-border-tertiary)" strokeWidth="7"/>
                      <circle cx="40" cy="40" r="32" fill="none"
                        stroke={plan.score >= 70 ? "#1D9E75" : plan.score >= 40 ? "#EF9F27" : "#E24B4A"}
                        strokeWidth="7"
                        strokeDasharray={`${2 * Math.PI * 32}`}
                        strokeDashoffset={`${2 * Math.PI * 32 * (1 - plan.score / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">{plan.score}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{plan.score >= 70 ? "Saúde Excelente" : plan.score >= 40 ? "Boa Saúde" : "Precisa Melhorar"}</p>
                    <p className="text-sm text-muted-foreground mt-1">{otimos} fatores ótimos · {atencao} precisam de atenção</p>
                    <button
                      onClick={() => router.push("/personal-plan")}
                      className="mt-2 text-xs text-secondary flex items-center gap-1 hover:underline"
                    >
                      Ver plano completo <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Insights por fator */}
            <div className="space-y-3">
              {insights.map((insight, idx) => {
                const config = statusConfig[insight.status]
                const Icon = insight.icon
                return (
                  <div key={idx} className={cn("rounded-2xl border p-4", config.bg)}>
                    <div className="flex items-start gap-3">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-background/50")}>
                        <Icon className={cn("w-5 h-5", config.color)} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm">{insight.title}</p>
                          <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full bg-background/50", config.color)}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                        <div className="mt-2 p-2 rounded-lg bg-background/30">
                          <p className="text-xs flex items-start gap-1.5">
                            <Star className="w-3 h-3 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-foreground/80">{insight.tip}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Botão refazer quiz */}
            <button
              onClick={() => router.push("/quiz/biology")}
              className="w-full py-3 rounded-xl border border-border/50 text-muted-foreground text-sm hover:bg-muted/30 transition-colors"
            >
              Refazer Quiz para Atualizar Análise
            </button>
          </>
        )}
      </div>

      <NavBar />
    </div>
  )
}

