"use client"

import { useState } from "react"
import { biologyQuestions, type BiologyProfile } from "@/data/biology-quiz"
import { BiologyQuestionCard } from "./biology-question-card"
import { generatePersonalPlan } from "@/services/personalization-engine"

interface BiologyQuizContainerProps {
  onComplete?: (profile: BiologyProfile) => void
}

export function BiologyQuizContainer({ onComplete }: BiologyQuizContainerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | number>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState("")

  const question = biologyQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / biologyQuestions.length) * 100
  const currentAnswer = answers[question.id]
  const hasValidAnswer = currentAnswer !== undefined && currentAnswer !== ""

  // For select questions: save answer and auto-advance
  const handleSelect = (value: string) => {
    setError("")
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)

    // Auto-advance after short delay for visual feedback
    setTimeout(() => {
      if (currentQuestion < biologyQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      }
    }, 300)
  }

  // For slider questions: only update the value, do NOT advance
  const handleValueChange = (value: string | number) => {
    setError("")
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  const handleNext = () => {
    if (!hasValidAnswer) {
      setError("Selecione uma resposta antes de continuar.")
      return
    }
    setError("")

    if (currentQuestion < biologyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      completeQuiz(answers)
    }
  }

  const completeQuiz = (finalAnswers: Record<number, string | number>) => {
    const categories: Record<string, number> = {}
    biologyQuestions.forEach((q) => {
      const answerVal = finalAnswers[q.id]
      let score = 50

      if (q.type === "select" && q.options) {
        const idx = q.options.indexOf(answerVal as string)
        score = idx >= 0 ? Math.round(((idx + 1) / q.options.length) * 100) : 50
      } else if (q.type === "slider" && q.min !== undefined && q.max !== undefined) {
        const numVal = Number(answerVal)
        score = Math.round(((numVal - q.min) / (q.max - q.min)) * 100)
      }

      if (!categories[q.category]) {
        categories[q.category] = score
      } else {
        categories[q.category] = Math.round((categories[q.category] + score) / 2)
      }
    })

    const profile: BiologyProfile = {
      timestamp: Date.now(),
      answers: finalAnswers,
      categories,
    }

    localStorage.setItem("biology_profile", JSON.stringify(profile))

    // Also generate and store the personal plan
    const plan = generatePersonalPlan(profile)
    localStorage.setItem("personal_plan", JSON.stringify(plan))

    setIsComplete(true)

    if (onComplete) {
      onComplete(profile)
    }
  }

  const handlePrevious = () => {
    setError("")
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsComplete(false)
    setError("")
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-xl backdrop-blur-md bg-background/50 border border-secondary/20 text-center space-y-6">
          <div className="animate-scale-up">
            <svg className="w-20 h-20 mx-auto text-secondary mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l3 3 5-5" />
            </svg>
            <h2 className="text-2xl font-bold text-secondary mb-2">Quiz Completo!</h2>
            <p className="text-foreground/70">Seu perfil biologico foi analisado com sucesso. Seu plano personalizado esta pronto.</p>
          </div>
          <div className="space-y-3">
            <a href="/personal-plan" className="block">
              <button className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-secondary to-accent hover:shadow-lg hover:shadow-secondary/50 transition-all text-background font-medium">
                Ver Meu Plano Personalizado
              </button>
            </a>
            <a href="/dashboard" className="block">
              <button className="w-full px-6 py-3 rounded-lg border border-secondary/30 hover:border-secondary hover:bg-secondary/5 transition-all text-foreground">
                Ir para Dashboard
              </button>
            </a>
            <button
              onClick={handleReset}
              className="w-full px-6 py-3 rounded-lg border border-foreground/20 hover:border-foreground/40 transition-all text-foreground/60 text-sm"
            >
              Refazer Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 rounded-xl backdrop-blur-md bg-background/50 border border-secondary/20 sm:p-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-foreground/60">
                Pergunta {currentQuestion + 1} de {biologyQuestions.length}
              </span>
              <span className="text-sm font-medium text-secondary">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary to-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <BiologyQuestionCard
            question={question}
            onValueChange={handleValueChange}
            onSelect={handleSelect}
            currentAnswer={currentAnswer}
          />

          {/* Error message */}
          {error && (
            <p className="text-red-400 text-sm text-center animate-fade-in">{error}</p>
          )}

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex-1 px-6 py-3 rounded-lg border border-foreground/20 hover:border-foreground/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-foreground"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={!hasValidAnswer}
              className={`flex-1 px-6 py-3 rounded-lg transition-all font-medium ${
                hasValidAnswer
                  ? "bg-secondary hover:bg-secondary/90 text-background shadow-lg shadow-secondary/20"
                  : "bg-foreground/10 text-foreground/30 cursor-not-allowed"
              }`}
            >
              {currentQuestion === biologyQuestions.length - 1 ? "Finalizar" : "Proximo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
