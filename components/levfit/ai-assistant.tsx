"use client"

import * as React from "react"
import { Bot, X, Send, Dumbbell, Apple, Moon, Zap, AlertCircle } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { cn } from "@/lib/utils"
import { getUser, getTodayProgress } from "@/lib/user-store"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

const quickActions = [
  { icon: Dumbbell, label: "Sugestão de treino", prompt: "Qual treino você sugere para hoje baseado no meu perfil?" },
  { icon: Apple, label: "Dica nutricional", prompt: "Me dê uma dica de alimentação saudável para hoje" },
  { icon: Moon, label: "Melhorar sono", prompt: "Como posso melhorar minha qualidade de sono?" },
  { icon: Zap, label: "Motivação", prompt: "Preciso de motivação para treinar hoje!" },
]

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Olá! Sou o LevFit IA 🤖\n\nPosso te ajudar com treinos personalizados, dicas de nutrição, motivação e muito mais. Como posso te ajudar hoje?",
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [input, setInput] = React.useState("")
  const [messages, setMessages] = React.useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = React.useState(false)
  const [apiError, setApiError] = React.useState<string | null>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const user = getUser()
  const progress = getTodayProgress()

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendToAPI = async (allMessages: ChatMessage[]) => {
    setIsLoading(true)
    setApiError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        // Mostra erro amigável em vez de travar
        const errorMsg = data.error || "Erro ao processar mensagem"
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: `⚠️ ${errorMsg}\n\nEnquanto a IA não está disponível, posso te dar dicas gerais:\n\n💪 **Treino:** Complete pelo menos 3 treinos por semana\n🥗 **Nutrição:** Priorize proteínas em cada refeição\n💧 **Hidratação:** Beba pelo menos 2L de água por dia\n😴 **Sono:** Durma 7-8 horas por noite`,
          },
        ])
        return
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.content || "Desculpe, não consegui processar sua mensagem.",
        },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "⚠️ Sem conexão com a IA no momento. Verifique sua internet e tente novamente.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")

    await sendToAPI(updatedMessages)
  }

  const handleQuickAction = async (prompt: string) => {
    if (isLoading) return

    // Adiciona contexto do usuário ao prompt
    const contextPrompt = user
      ? `${prompt}\n\n[Contexto: Usuário ${user.name}, nível ${user.level}, ${progress.workoutsCompleted} treinos hoje, ${progress.caloriesBurned} kcal queimadas]`
      : prompt

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: prompt, // Mostra sem contexto
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    // Envia com contexto
    const messagesWithContext = [
      ...messages,
      { ...userMessage, content: contextPrompt },
    ]
    await sendToAPI(messagesWithContext)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          "fixed bottom-24 right-4 z-40 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300",
          isOpen
            ? "bg-muted/80 rotate-0"
            : "bg-gradient-to-br from-secondary to-accent hover:scale-110"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7 text-background" />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-40 right-4 z-40 w-[calc(100vw-2rem)] max-w-sm">
          <GlassCard className="flex flex-col overflow-hidden shadow-2xl" style={{ height: "420px" }}>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border/50 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <Bot className="w-5 h-5 text-background" />
              </div>
              <div>
                <p className="font-semibold text-sm">LevFit IA</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Online
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex animate-fade-up",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3",
                      message.role === "user"
                        ? "bg-secondary text-secondary-foreground rounded-br-sm"
                        : "bg-muted/50 rounded-bl-sm"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Ações rápidas */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex-shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.prompt)}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors whitespace-nowrap text-xs disabled:opacity-50 flex-shrink-0"
                    >
                      <action.icon className="w-3.5 h-3.5 text-secondary" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border/50 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-muted/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                  disabled={isLoading}
                />
                <NeonButton
                  type="button"
                  variant="cyan"
                  className="px-4 py-2.5 h-auto flex-shrink-0"
                  disabled={!input.trim() || isLoading}
                  onClick={handleSend}
                >
                  <Send className="w-5 h-5" />
                </NeonButton>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  )
}

