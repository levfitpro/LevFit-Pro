"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Camera, Check, Loader2, Sparkles, ArrowLeft, Upload, RotateCcw, AlertCircle, Star } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { saveMeal, addXP, type Meal } from "@/lib/user-store"
import { cn } from "@/lib/utils"

interface FoodItem {
  name: string
  portion: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  confidence: number
}

interface AnalysisResult {
  foods: FoodItem[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  mealType: string
  healthScore: number
  tips: string
}

export default function FoodScanPage() {
  const router = useRouter()
  const [stage, setStage] = React.useState<"camera" | "analyzing" | "results" | "error">("camera")
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null)
  const [selectedFoods, setSelectedFoods] = React.useState<number[]>([])
  const [errorMessage, setErrorMessage] = React.useState("")
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [hasCamera, setHasCamera] = React.useState(true)
  const [cameraReady, setCameraReady] = React.useState(false)
  const streamRef = React.useRef<MediaStream | null>(null)

  React.useEffect(() => {
    if (stage === "camera" && !capturedImage) {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [stage, capturedImage])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => setCameraReady(true)
      }
    } catch {
      setHasCamera(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraReady(false)
  }

  const captureFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85)
      setCapturedImage(dataUrl)
      stopCamera()
      analyzeFood(dataUrl)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setCapturedImage(dataUrl)
      stopCamera()
      analyzeFood(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const analyzeFood = async (imageData: string) => {
    setStage("analyzing")
    setErrorMessage("")

    try {
      const response = await fetch("/api/analyze-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao analisar imagem")
      }

      const data = await response.json()
      setAnalysisResult(data.result)
      setSelectedFoods(data.result.foods.map((_: FoodItem, i: number) => i))
      setStage("results")
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro desconhecido ao analisar a imagem")
      setStage("error")
    }
  }

  const toggleFood = (index: number) => {
    setSelectedFoods((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const getSelectedTotals = () => {
    if (!analysisResult) return { calories: 0, protein: 0, carbs: 0, fat: 0 }
    return analysisResult.foods
      .filter((_, idx) => selectedFoods.includes(idx))
      .reduce(
        (acc, item) => ({
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fat: acc.fat + item.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      )
  }

  const handleConfirm = () => {
    if (!analysisResult) return
    const selectedItems = analysisResult.foods.filter((_, idx) => selectedFoods.includes(idx))
    const totals = getSelectedTotals()

    const meal: Meal = {
      id: crypto.randomUUID(),
      name: selectedItems.map((i) => i.name).join(" + "),
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toISOString().split("T")[0],
    }

    saveMeal(meal)
    addXP(50)
    router.push("/nutrition")
  }

  const resetScan = () => {
    setCapturedImage(null)
    setAnalysisResult(null)
    setSelectedFoods([])
    setErrorMessage("")
    setStage("camera")
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return "text-green-400"
    if (confidence >= 0.7) return "text-yellow-400"
    return "text-orange-400"
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 7) return "text-green-400"
    if (score >= 5) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Header */}
      <div
        className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl"
        style={{ background: "rgba(27,27,27,0.85)", borderColor: "rgba(0,193,212,0.2)" }}
      >
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-lg transition-colors"
            style={{ color: "var(--foreground)" }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">Escanear Refeicao</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="flex-1 pt-16">
        {/* Camera Stage */}
        {stage === "camera" && (
          <div className="h-full flex flex-col" style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div className="flex-1 relative" style={{ background: "#000" }}>
              {hasCamera ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {!cameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#00C1D4" }} />
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 p-6">
                    <div
                      className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center"
                      style={{ background: "rgba(0,193,212,0.2)" }}
                    >
                      <Camera className="w-10 h-10" style={{ color: "#00C1D4" }} />
                    </div>
                    <p style={{ color: "var(--muted-foreground)" }}>
                      Camera nao disponivel. Use o botao abaixo para enviar uma foto da galeria.
                    </p>
                  </div>
                </div>
              )}

              {/* Scan overlay */}
              {hasCamera && cameraReady && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-12 rounded-3xl" style={{ border: "2px solid rgba(0,193,212,0.5)" }}>
                    <div
                      className="absolute -top-1 -left-1 w-8 h-8 rounded-tl-xl"
                      style={{ borderTop: "4px solid #00C1D4", borderLeft: "4px solid #00C1D4" }}
                    />
                    <div
                      className="absolute -top-1 -right-1 w-8 h-8 rounded-tr-xl"
                      style={{ borderTop: "4px solid #00C1D4", borderRight: "4px solid #00C1D4" }}
                    />
                    <div
                      className="absolute -bottom-1 -left-1 w-8 h-8 rounded-bl-xl"
                      style={{ borderBottom: "4px solid #00C1D4", borderLeft: "4px solid #00C1D4" }}
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-br-xl"
                      style={{ borderBottom: "4px solid #00C1D4", borderRight: "4px solid #00C1D4" }}
                    />
                  </div>
                  <div
                    className="absolute left-12 right-12 h-0.5 animate-scan"
                    style={{ background: "linear-gradient(to right, transparent, #00C1D4, transparent)" }}
                  />
                </div>
              )}
            </div>

            <div className="p-4 space-y-3">
              <p className="text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                Posicione sua refeicao e tire a foto
              </p>
              <div className="flex gap-3">
                {hasCamera && (
                  <NeonButton
                    variant="cyan"
                    size="lg"
                    className="flex-1"
                    onClick={captureFromCamera}
                    disabled={!cameraReady}
                    icon={<Camera className="w-5 h-5" />}
                  >
                    Capturar
                  </NeonButton>
                )}
                <NeonButton
                  variant={hasCamera ? "ghost" : "cyan"}
                  size="lg"
                  className={hasCamera ? "" : "flex-1"}
                  onClick={() => fileInputRef.current?.click()}
                  icon={<Upload className="w-5 h-5" />}
                >
                  Galeria
                </NeonButton>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Analyzing Stage */}
        {stage === "analyzing" && (
          <div
            className="h-full flex flex-col items-center justify-center p-6 space-y-8"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          >
            {capturedImage && (
              <div className="w-48 h-48 rounded-2xl overflow-hidden relative">
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Foto da refeicao"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                <div
                  className="absolute inset-0 backdrop-blur-sm flex items-center justify-center"
                  style={{ background: "rgba(27,27,27,0.5)" }}
                >
                  <Loader2 className="w-12 h-12 animate-spin" style={{ color: "#00C1D4" }} />
                </div>
              </div>
            )}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">Analisando com IA...</h2>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Identificando alimentos e calculando calorias
              </p>
            </div>
            <div className="flex items-center gap-2" style={{ color: "#00C1D4" }}>
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-sm">Powered by GPT-4o Vision</span>
            </div>
          </div>
        )}

        {/* Error Stage */}
        {stage === "error" && (
          <div
            className="h-full flex flex-col items-center justify-center p-6 space-y-6"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "rgba(239,68,68,0.2)" }}
            >
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">Erro na Analise</h2>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {errorMessage}
              </p>
            </div>
            <NeonButton variant="cyan" onClick={resetScan} icon={<RotateCcw className="w-5 h-5" />}>
              Tentar Novamente
            </NeonButton>
          </div>
        )}

        {/* Results Stage */}
        {stage === "results" && analysisResult && (
          <div className="p-4 space-y-4 max-w-lg mx-auto pb-8" style={{ animation: "fadeUp 0.4s ease-out" }}>
            {/* Captured Image */}
            {capturedImage && (
              <div className="w-full h-48 rounded-2xl overflow-hidden relative">
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Foto da refeicao"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                <div
                  className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                  style={{ background: "rgba(27,27,27,0.7)", color: "#00C1D4" }}
                >
                  {analysisResult.mealType}
                </div>
              </div>
            )}

            {/* Health Score + Summary */}
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2" style={{ color: "#00C1D4" }}>
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {analysisResult.foods.length} alimento{analysisResult.foods.length > 1 ? "s" : ""} identificado{analysisResult.foods.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" style={{ color: "#F8B400" }} />
                  <span className={cn("text-sm font-bold", getHealthScoreColor(analysisResult.healthScore))}>
                    {analysisResult.healthScore}/10
                  </span>
                </div>
              </div>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {analysisResult.tips}
              </p>
            </GlassCard>

            {/* Individual Foods */}
            <div className="space-y-3">
              {analysisResult.foods.map((food, index) => (
                <div key={index} style={{ animation: `fadeUp 0.3s ease-out ${index * 80}ms both` }}>
                  <GlassCard
                    variant={selectedFoods.includes(index) ? "neon" : "default"}
                    neonColor="cyan"
                    className="p-4 cursor-pointer"
                    onClick={() => toggleFood(index)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 shrink-0",
                          selectedFoods.includes(index) ? "border-[#00C1D4] bg-[#00C1D4]" : "border-gray-500"
                        )}
                      >
                        {selectedFoods.includes(index) && (
                          <Check className="w-4 h-4" style={{ color: "#1B1B1B" }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium truncate">{food.name}</p>
                          <span className={cn("text-xs shrink-0", getConfidenceColor(food.confidence))}>
                            {Math.round(food.confidence * 100)}%
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                          Porcao: {food.portion}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span>
                            <strong style={{ color: "#00C1D4" }}>{food.calories}</strong> kcal
                          </span>
                          <span>
                            P: <strong>{food.protein}g</strong>
                          </span>
                          <span>
                            C: <strong>{food.carbs}g</strong>
                          </span>
                          <span>
                            G: <strong>{food.fat}g</strong>
                          </span>
                          <span>
                            F: <strong>{food.fiber}g</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>

            {/* Totals */}
            {selectedFoods.length > 0 && (
              <GlassCard className="p-4">
                <p className="text-sm mb-3 font-medium" style={{ color: "var(--muted-foreground)" }}>
                  Total Selecionado
                </p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {(() => {
                    const totals = getSelectedTotals()
                    return [
                      { label: "Calorias", value: Math.round(totals.calories), unit: "kcal", highlight: true },
                      { label: "Proteina", value: Math.round(totals.protein), unit: "g", highlight: false },
                      { label: "Carbs", value: Math.round(totals.carbs), unit: "g", highlight: false },
                      { label: "Gordura", value: Math.round(totals.fat), unit: "g", highlight: false },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-lg font-bold" style={{ color: item.highlight ? "#00C1D4" : "var(--foreground)" }}>
                          {item.value}
                          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                            {item.unit}
                          </span>
                        </p>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                          {item.label}
                        </p>
                      </div>
                    ))
                  })()}
                </div>
              </GlassCard>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <NeonButton variant="ghost" className="flex-1" onClick={resetScan}>
                Nova Foto
              </NeonButton>
              <NeonButton
                variant="cyan"
                className="flex-1"
                onClick={handleConfirm}
                disabled={selectedFoods.length === 0}
                icon={<Check className="w-5 h-5" />}
              >
                Confirmar ({selectedFoods.length})
              </NeonButton>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
