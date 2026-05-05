"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { TopBar, NavBar } from "@/components/levfit/nav-bar"
import { GlassCard } from "@/components/ui/glass-card"
import { Camera, Plus, Trash2, Calendar, Scale, GitCompare, ArrowLeft, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressPhoto {
  id: string
  imageUrl: string
  date: string
  weight?: number
  note?: string
}

const STORAGE_KEY = "levfit_progress_photos"

function getPhotos(): ProgressPhoto[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

function savePhotos(photos: ProgressPhoto[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos))
}

export default function ProgressPhotosPage() {
  const router = useRouter()
  const [photos, setPhotos] = React.useState<ProgressPhoto[]>([])
  const [compareMode, setCompareMode] = React.useState(false)
  const [selected, setSelected] = React.useState<string[]>([])
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [newPhoto, setNewPhoto] = React.useState<{ imageUrl: string; weight: string; note: string } | null>(null)
  const [viewPhoto, setViewPhoto] = React.useState<ProgressPhoto | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setPhotos(getPhotos())
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setNewPhoto({ imageUrl: reader.result as string, weight: "", note: "" })
      setShowAddModal(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const handleSavePhoto = () => {
    if (!newPhoto) return
    const photo: ProgressPhoto = {
      id: crypto.randomUUID(),
      imageUrl: newPhoto.imageUrl,
      date: new Date().toISOString().split("T")[0],
      weight: newPhoto.weight ? Number(newPhoto.weight) : undefined,
      note: newPhoto.note || undefined,
    }
    const updated = [...photos, photo]
    setPhotos(updated)
    savePhotos(updated)
    setShowAddModal(false)
    setNewPhoto(null)
  }

  const handleDelete = (id: string) => {
    const updated = photos.filter((p) => p.id !== id)
    setPhotos(updated)
    savePhotos(updated)
    setViewPhoto(null)
  }

  const handleSelectForCompare = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
  }

  const sorted = [...photos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const comparePhotos = selected.map((id) => photos.find((p) => p.id === id)).filter(Boolean) as ProgressPhoto[]

  // Tela de visualização de foto
  if (viewPhoto) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button onClick={() => setViewPhoto(null)} className="p-2 rounded-lg hover:bg-muted/50">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold">{formatDate(viewPhoto.date)}</span>
            <button onClick={() => handleDelete(viewPhoto.id)} className="ml-auto p-2 rounded-lg hover:bg-red-500/20 text-red-400">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="pt-20 p-4 max-w-lg mx-auto">
          <img src={viewPhoto.imageUrl} alt="Progresso" className="w-full rounded-2xl object-cover max-h-[60vh]" />
          <div className="mt-4 space-y-3">
            {viewPhoto.weight && (
              <div className="flex items-center gap-2 text-sm">
                <Scale className="w-4 h-4 text-secondary" />
                <span className="font-semibold">{viewPhoto.weight} kg</span>
              </div>
            )}
            {viewPhoto.note && (
              <GlassCard className="p-3">
                <p className="text-sm text-foreground/80">{viewPhoto.note}</p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-20">
      <TopBar />

      {/* Modal adicionar foto — z-[200] garante que fica acima do navbar */}
      {showAddModal && newPhoto && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-card border border-border/50 rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Salvar foto</h3>
              <button
                onClick={() => { setShowAddModal(false); setNewPhoto(null) }}
                className="p-1.5 rounded-lg hover:bg-muted/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img src={newPhoto.imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl" />

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Peso atual (kg) — opcional</label>
              <input
                type="number"
                placeholder="Ex: 75.5"
                value={newPhoto.weight}
                onChange={(e) => setNewPhoto({ ...newPhoto, weight: e.target.value })}
                className="w-full bg-muted/30 border border-border/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-secondary/50"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Nota — opcional</label>
              <textarea
                placeholder="Como você está se sentindo?"
                value={newPhoto.note}
                onChange={(e) => setNewPhoto({ ...newPhoto, note: e.target.value })}
                rows={2}
                className="w-full bg-muted/30 border border-border/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-secondary/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pb-2">
              <button
                onClick={() => { setShowAddModal(false); setNewPhoto(null) }}
                className="py-3 rounded-xl border border-border/50 text-muted-foreground text-sm font-medium hover:bg-muted/30 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePhoto}
                className="py-3 rounded-xl bg-gradient-to-r from-secondary to-accent text-background font-semibold text-sm"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto p-4 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Camera className="w-6 h-6 text-secondary" />
              Fotos de Progresso
            </h1>
            <p className="text-muted-foreground text-sm">
              {photos.length} foto{photos.length !== 1 ? "s" : ""} registrada{photos.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={() => router.push("/progress")} className="p-2 rounded-lg hover:bg-muted/50">×</button>
        </div>

        {/* Botões de ação */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-3 rounded-xl bg-gradient-to-r from-secondary to-accent text-background font-semibold flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Adicionar Foto
          </button>
          <button
            onClick={() => { setCompareMode(!compareMode); setSelected([]) }}
            className={cn(
              "py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border transition-all",
              compareMode
                ? "bg-secondary/20 border-secondary/50 text-secondary"
                : "border-border/50 text-muted-foreground hover:bg-muted/30"
            )}
          >
            <GitCompare className="w-5 h-5" /> Comparar
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          capture="environment"
        />

        {/* Modo comparação */}
        {compareMode && (
          <GlassCard className="p-4 border border-secondary/20">
            <p className="text-sm font-semibold mb-1 text-secondary">Selecione 2 fotos para comparar</p>
            <p className="text-xs text-muted-foreground mb-3">{selected.length}/2 selecionadas</p>
            {selected.length === 2 && comparePhotos.length === 2 && (
              <div className="grid grid-cols-2 gap-3">
                {comparePhotos.map((p) => (
                  <div key={p.id}>
                    <img src={p.imageUrl} alt="" className="w-full h-40 object-cover rounded-xl" />
                    <p className="text-xs text-center text-muted-foreground mt-1">{formatDate(p.date)}</p>
                    {p.weight && <p className="text-xs text-center text-secondary font-medium">{p.weight} kg</p>}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        )}

        {/* Lista de fotos */}
        {photos.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-semibold text-muted-foreground">Nenhuma foto ainda</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Adicione sua primeira foto de progresso</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sorted.map((photo) => (
              <div
                key={photo.id}
                className={cn(
                  "relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all",
                  compareMode && selected.includes(photo.id)
                    ? "border-secondary"
                    : "border-transparent"
                )}
                onClick={() => compareMode ? handleSelectForCompare(photo.id) : setViewPhoto(photo)}
              >
                <img src={photo.imageUrl} alt="Progresso" className="w-full h-48 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <div className="flex items-center gap-1 text-white text-xs">
                    <Calendar className="w-3 h-3" />
                    {formatDate(photo.date)}
                  </div>
                  {photo.weight && (
                    <div className="flex items-center gap-1 text-secondary text-xs mt-0.5">
                      <Scale className="w-3 h-3" />
                      {photo.weight} kg
                    </div>
                  )}
                </div>
                {compareMode && selected.includes(photo.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-xs text-background font-bold">{selected.indexOf(photo.id) + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <NavBar />
    </div>
  )
}
