export const maxDuration = 60

const systemPrompt = `Você é um assistente de inteligência artificial avançado e amigável chamado LevFit IA, parte do app LevFit Pro.

SUAS CAPACIDADES:
- Especialista em fitness, nutrição, saúde, treinos, dietas, psicologia e motivação
- Pode ajudar com outros assuntos: matemática, programação, história, ciência, receitas, conselhos de vida
- Raciocina sobre problemas complexos com clareza

ESTILO DE COMUNICAÇÃO:
- Fale em português brasileiro de forma natural e amigável
- Seja direto, claro e útil
- Adapte o tom ao contexto
- Seja honesto e preciso nas informações
- Dê respostas completas mas sem enrolação

IMPORTANTE:
- Sempre ajude da melhor forma possível
- Quando der dicas de treino ou nutrição, personalize para o contexto do usuário
- Use emojis com moderação para tornar a conversa mais agradável`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || messages.length === 0) {
      return Response.json({ error: "Nenhuma mensagem fornecida" }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: "API de IA não configurada. Configure ANTHROPIC_API_KEY nas variáveis de ambiente." },
        { status: 503 }
      )
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content || "",
        })),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Anthropic API error:", error)
      return Response.json(
        { error: "Erro ao processar mensagem. Tente novamente." },
        { status: 500 }
      )
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ""

    // Retorna no formato compatível com o frontend
    return Response.json({
      role: "assistant",
      content: text,
    })
  } catch (error) {
    console.error("Chat error:", error)
    return Response.json(
      { error: "Erro de conexão. Verifique sua internet e tente novamente." },
      { status: 500 }
    )
  }
}

