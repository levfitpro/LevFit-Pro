"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { getUser, saveUser } from "@/lib/user-store"
import { Target, Clock, Apple, AlertCircle, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { cn } from "@/lib/utils"

const questions = [
  {
    id: "goal",
    question: "Qual seu objetivo fitness principal?",
    icon: Target,
    options: [
      { value: "hipertrofia", label: "Ganhar massa muscular" },
      { value: "emagrecimento", label: "Perder peso" },
      { value: "resistencia", label: "Melhorar resistência" },
      { value: "flexibilidade", label: "Flexibilidade e mobilidade" },
      { value: "saude", label: "Saúde geral" },
    ],
  },
  {
    id: "hours",
    question: "Quantas horas você treina por semana?",
    icon: Clock,
    options: [
      { value: "1-3", label: "1 a 3 horas" },
      { value: "4-6", label: "4 a 6 horas" },
      { value: "7-10", label: "7 a 10 horas" },
      { value: "10+", label: "Mais de 10 horas" },
    ],
  },
  {
    id: "diet",
    question: "Quais alimentos você mais consome?",
    icon: Apple,
    options: [
      { value: "equilibrada", label: "Dieta equilibrada" },
      { value: "proteina", label: "Rica em proteínas" },
      { value: "vegetariana", label: "Vegetariana" },
      { value: "vegana", label: "Vegana" },
      { value: "lowcarb", label: "Low carb" },
    ],
  },
  {
    id: "restrictions",
    question: "Você tem alguma restrição alimentar?",
    icon: AlertCircle,
    options: [
      { value: "nenhuma", label: "Nenhuma" },
      { value: "lactose", label: "Intolerância à lactose" },
      { value: "gluten", label: "Intolerância ao glúten" },
      { value: "alergia", label: "Alergias alimentares" },
      { value: "diabetes", label: "Diabetes" },
    ],
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(false)

  const currentQuestion = questions[step]
  const progress = ((step + 1) / questions.length) * 100

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
  }

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep((s) => s + 1)
    } else {
      // Save answers and complete onboarding
      setLoading(true)
      await new Promise((r) => setTimeout(r, 800))

      const user = getUser()
      if (user) {
        user.goals = {
          primary: answers.goal || "",
          weeklyTrainingHours: Number.parseInt(answers.hours?.split("-")[0] || "0"),
          dietaryRestrictions: answers.restrictions ? [answers.restrictions] : [],
        }
        saveUser(user)
      }

      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1)
    }
  }

  const isAnswered = answers[currentQuestion?.id]

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div
          className="h-full bg-gradient-to-r from-secondary to-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <header className="p-4 pt-6 relative z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={cn(
              "p-2 rounded-lg transition-colors",
              step === 0 ? "opacity-0 pointer-events-none" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-muted-foreground">
            {step + 1} de {questions.length}
          </span>
          <div className="w-9" />
        </div>
      </header>

      {/* Question */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10">
        <div className="w-full max-w-md animate-fade-up" key={step}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
              <currentQuestion.icon className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-2xl font-bold text-balance">{currentQuestion.question}</h1>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full p-4 rounded-xl text-left transition-all duration-300",
                  "border",
                  answers[currentQuestion.id] === option.value
                    ? "glass-card border-secondary neon-border-cyan"
                    : "glass-card border-transparent hover:border-secondary/30",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.label}</span>
                  {answers[currentQuestion.id] === option.value && (
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                      <Check className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8">
            <NeonButton
              variant="cyan"
              size="lg"
              onClick={handleNext}
              disabled={!isAnswered}
              loading={loading}
              className="w-full"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              {step === questions.length - 1 ? "Começar" : "Próximo"}
            </NeonButton>
          </div>
        </div>
      </section>
    </main>
  )
}
