"use client"

import { useState } from "react"
import { X, ChevronRight, ChevronLeft } from "lucide-react"
import { GlassCard } from "./glass-card"
import { NeonButton } from "./neon-button"

interface OnboardingStep {
  title: string
  description: string
  image: string
}

const steps: OnboardingStep[] = [
  {
    title: "Bem-vindo ao LevFit Pro!",
    description: "Seu assistente pessoal de fitness com IA. Vamos começar sua jornada de transformação.",
    image: "/fitness-welcome.jpg",
  },
  {
    title: "Complete Treinos",
    description: "Acesse treinos personalizados, complete exercícios e ganhe XP para subir de nível.",
    image: "/workout-exercises.jpg",
  },
  {
    title: "Rastreie Nutrição",
    description: "Registre suas refeições, escaneie alimentos e mantenha suas metas calóricas.",
    image: "/nutrition-tracking.jpg",
  },
  {
    title: "Chat com IA",
    description: "Converse com o LevFit IA para dicas de treino, nutrição e motivação personalizada.",
    image: "/ai-assistant-bot.jpg",
  },
]

interface OnboardingModalProps {
  onComplete: () => void
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const step = steps[currentStep]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
      <GlassCard className="max-w-lg w-full p-6 animate-scale-in">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold">Tutorial</h2>
          <button onClick={onComplete} className="p-1 hover:bg-muted/30 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-6 mb-8">
          <img src={step.image || "/placeholder.svg"} alt={step.title} className="w-48 h-48 object-contain" />
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="p-2 hover:bg-muted/30 rounded-lg transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep ? "w-8 bg-secondary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          <NeonButton onClick={handleNext} variant="cyan" className="px-6">
            {currentStep === steps.length - 1 ? "Começar" : "Próximo"}
            <ChevronRight className="w-5 h-5 ml-1" />
          </NeonButton>
        </div>
      </GlassCard>
    </div>
  )
}
