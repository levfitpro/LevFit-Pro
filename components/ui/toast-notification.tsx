"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
  duration?: number
}

const toastStore = {
  listeners: [] as ((toasts: Toast[]) => void)[],
  toasts: [] as Toast[],

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  },

  addToast(toast: Omit<Toast, "id">) {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    this.toasts.push(newToast)
    this.notify()

    if (toast.duration !== 0) {
      setTimeout(() => {
        this.removeToast(id)
      }, toast.duration || 3000)
    }

    return id
  },

  removeToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id)
    this.notify()
  },

  notify() {
    this.listeners.forEach((listener) => listener(this.toasts))
  },
}

export function useToast() {
  return {
    success: (message: string) => toastStore.addToast({ message, type: "success" }),
    error: (message: string) => toastStore.addToast({ message, type: "error" }),
    info: (message: string) => toastStore.addToast({ message, type: "info" }),
    warning: (message: string) => toastStore.addToast({ message, type: "warning" }),
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return toastStore.subscribe(setToasts)
  }, [])

  return (
    <div className="fixed top-16 left-2 right-2 sm:top-4 sm:right-4 sm:left-auto z-[100] space-y-2 pointer-events-none w-auto sm:max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "glass px-3 py-2 sm:px-4 sm:py-3 rounded-lg animate-slide-down pointer-events-auto text-xs sm:text-sm shadow-2xl",
            {
              "border-l-4 border-green-500 bg-green-500/10": toast.type === "success",
              "border-l-4 border-red-500 bg-red-500/10": toast.type === "error",
              "border-l-4 border-blue-500 bg-blue-500/10": toast.type === "info",
              "border-l-4 border-yellow-500 bg-yellow-500/10": toast.type === "warning",
            },
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
