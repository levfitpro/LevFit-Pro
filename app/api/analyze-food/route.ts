export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return Response.json({ error: "Nenhuma imagem fornecida" }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: "API de IA não configurada. Configure ANTHROPIC_API_KEY nas variáveis de ambiente." },
        { status: 503 }
      )
    }

    // Extrai o tipo e dados da imagem base64
    const matches = image.match(/^data:image\/(\w+);base64,(.+)$/)
    if (!matches) {
      return Response.json({ error: "Formato de imagem inválido" }, { status: 400 })
    }
    const mediaType = `image/${matches[1]}` as "image/jpeg" | "image/png" | "image/gif" | "image/webp"
    const base64Data = matches[2]

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
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: base64Data,
                },
              },
              {
                type: "text",
                text: `Você é um nutricionista especialista. Analise esta imagem de comida com precisão máxima.

Identifique TODOS os alimentos visíveis. Responda APENAS com um JSON válido, sem markdown, sem texto adicional:

{
  "foods": [
    {
      "name": "Nome do alimento em português",
      "portion": "Porção estimada ex: 150g",
      "calories": 200,
      "protein": 15,
      "carbs": 20,
      "fat": 8,
      "fiber": 2,
      "confidence": 0.9
    }
  ],
  "totalCalories": 200,
  "totalProtein": 15,
  "totalCarbs": 20,
  "totalFat": 8,
  "mealType": "almoço",
  "healthScore": 7,
  "tips": "Dica nutricional curta sobre a refeição"
}

Use valores reais das tabelas nutricionais TACO e USDA. Confidence de 0 a 1.`,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Anthropic vision error:", error)
      return Response.json(
        { error: "Erro ao analisar a imagem. Tente novamente." },
        { status: 500 }
      )
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ""

    // Parse do JSON retornado pelo Claude
    let result
    try {
      // Remove possíveis backticks de markdown
      const clean = text.replace(/```json\n?|\n?```/g, "").trim()
      result = JSON.parse(clean)
    } catch {
      console.error("Failed to parse Claude response:", text)
      return Response.json(
        { error: "Erro ao processar análise. Tente com uma imagem mais clara." },
        { status: 500 }
      )
    }

    return Response.json({ result })
  } catch (error) {
    console.error("Food analysis error:", error)
    return Response.json(
      { error: "Erro ao analisar a imagem. Tente novamente." },
      { status: 500 }
    )
  }
}
