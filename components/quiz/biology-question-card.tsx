"use client"

import React from "react"

import { useRef, useCallback } from "react"
import type { BiologyQuestion } from "@/data/biology-quiz"

interface BiologyQuestionCardProps {
  question: BiologyQuestion
  onValueChange: (value: string | number) => void
  onSelect: (value: string) => void
  currentAnswer?: string | number
}

function getStep(question: BiologyQuestion): number {
  if (question.step) return question.step
  if (question.unit === "L") return 0.1
  if (question.unit === "%") return 1
  if (question.unit === "bpm") return 1
  return 1
}

function formatValue(value: number, question: BiologyQuestion): string {
  if (question.unit === "L") return value.toFixed(1)
  return String(Math.round(value))
}

function getSliderLabel(question: BiologyQuestion): { low: string; high: string } {
  switch (question.id) {
    case 2: return { low: "5% (atleta)", high: "50% (alto)" }
    case 4: return { low: "40 bpm (atleta)", high: "100 bpm (alto)" }
    case 13: return { low: "0 L (pouca)", high: "5 L (muita)" }
    case 16: return { low: "1 (calmo)", high: "10 (extremo)" }
    default: return { low: String(question.min), high: String(question.max) }
  }
}

export function BiologyQuestionCard({ question, onValueChange, onSelect, currentAnswer }: BiologyQuestionCardProps) {
  const step = getStep(question)
  const min = question.min ?? 0
  const max = question.max ?? 100
  const currentVal = typeof currentAnswer === "number" ? currentAnswer : min
  const percentage = ((currentVal - min) / (max - min)) * 100
  const labels = getSliderLabel(question)

  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return currentVal
      const rect = track.getBoundingClientRect()
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
      const ratio = x / rect.width
      const raw = min + ratio * (max - min)
      const stepped = Math.round(raw / step) * step
      return Math.max(min, Math.min(max, Number(stepped.toFixed(1))))
    },
    [min, max, step, currentVal],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      isDragging.current = true
      const el = e.currentTarget as HTMLElement
      el.setPointerCapture(e.pointerId)
      const val = getValueFromPosition(e.clientX)
      onValueChange(val)
    },
    [getValueFromPosition, onValueChange],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return
      e.preventDefault()
      const val = getValueFromPosition(e.clientX)
      onValueChange(val)
    },
    [getValueFromPosition, onValueChange],
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <span className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 block">
          {question.category}
        </span>
        <h3 className="text-xl font-bold text-foreground sm:text-2xl">{question.question}</h3>
      </div>

      {question.type === "select" && (
        <div className="grid gap-3">
          {question.options?.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                currentAnswer === option
                  ? "border-secondary bg-secondary/10 text-secondary"
                  : "border-foreground/10 hover:border-secondary/50 text-foreground hover:bg-foreground/5"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {question.type === "slider" && (
        <div className="space-y-6">
          {/* Value display */}
          <div className="flex items-center justify-center">
            <div className="px-6 py-3 rounded-xl bg-secondary/10 border border-secondary/30">
              <span className="text-4xl font-bold text-secondary">
                {formatValue(currentVal, question)}
              </span>
              {question.unit && (
                <span className="text-lg text-secondary/70 ml-1">{question.unit}</span>
              )}
            </div>
          </div>

          {/* Custom slider track */}
          <div className="px-2 py-4">
            <div
              ref={trackRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative h-3 rounded-full cursor-pointer select-none touch-none"
              style={{ background: "var(--muted, #333)" }}
            >
              {/* Filled track */}
              <div
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-secondary to-accent transition-[width] duration-75"
                style={{ width: `${percentage}%` }}
              />

              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-secondary border-4 border-background shadow-lg shadow-secondary/40 transition-[left] duration-75"
                style={{ left: `${percentage}%` }}
              >
                <div className="absolute inset-0 rounded-full animate-pulse bg-secondary/30" />
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="flex justify-between text-xs text-foreground/50 px-2">
            <span>{labels.low}</span>
            <span>{labels.high}</span>
          </div>

          {/* Quick value buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {getQuickValues(question).map((qv) => (
              <button
                key={qv.value}
                onClick={() => onValueChange(qv.value)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                  currentVal === qv.value
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-foreground/10 text-foreground/60 hover:border-secondary/50"
                }`}
              >
                {qv.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getQuickValues(question: BiologyQuestion): { value: number; label: string }[] {
  switch (question.id) {
    case 2: // Gordura corporal
      return [
        { value: 10, label: "10%" },
        { value: 15, label: "15%" },
        { value: 20, label: "20%" },
        { value: 25, label: "25%" },
        { value: 30, label: "30%" },
        { value: 40, label: "40%" },
      ]
    case 4: // Frequencia cardiaca
      return [
        { value: 50, label: "50 bpm" },
        { value: 60, label: "60 bpm" },
        { value: 70, label: "70 bpm" },
        { value: 80, label: "80 bpm" },
        { value: 90, label: "90 bpm" },
      ]
    case 13: // Agua
      return [
        { value: 0.5, label: "0.5 L" },
        { value: 1, label: "1 L" },
        { value: 2, label: "2 L" },
        { value: 3, label: "3 L" },
        { value: 4, label: "4 L" },
      ]
    case 16: // Stress
      return [
        { value: 1, label: "Baixo" },
        { value: 3, label: "Leve" },
        { value: 5, label: "Moderado" },
        { value: 7, label: "Alto" },
        { value: 10, label: "Extremo" },
      ]
    default:
      return []
  }
}
