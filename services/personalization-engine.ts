import type { BiologyProfile } from "@/data/biology-quiz"

export interface PersonalPlan {
  workoutType: string
  workoutFrequency: string
  workoutFocus: string
  nutritionType: string
  hydrationGoal: string
  sleepRecommendation: string
  weeklyGoals: string[]
  strengths: string[]
  focusAreas: string[]
  warnings: string[]
  dailySchedule: { time: string; activity: string }[]
  macroSplit: { protein: number; carbs: number; fat: number }
  estimatedCalories: number
  score: number
}

export function generatePersonalPlan(profile: BiologyProfile): PersonalPlan {
  const a = profile.answers

  // ── Leitura das respostas ──────────────────────────────────────────────────

  // Q1 - Objetivo principal
  const objetivo = a[1] as string ?? "Melhorar saúde e disposição"
  const querEmagrecer = objetivo.includes("Emagrecer")
  const querMassa = objetivo.includes("Ganhar massa")
  const querDefinir = objetivo.includes("Definir")
  const querSaude = objetivo.includes("saúde")

  // Q2 - Composição corporal
  const corpo = idx(a[2], ["Muito acima do peso", "Acima do peso", "Peso normal com pouca definição", "Peso normal com alguma definição", "Bem definido"])
  // corpo: 0=muito acima, 1=acima, 2=normal sem def, 3=normal com def, 4=bem definido

  // Q3 - Musculatura visível
  const musculo = idx(a[3], ["Não, quase nada", "Um pouco, com esforço", "Sim, com roupas normais", "Sim, bem visível"])
  // musculo: 0-3

  // Q4 - Condicionamento (escada)
  const condicionamento = idx(a[4], ["Fico muito sem fôlego, preciso parar", "Fico bastante ofegante", "Fico levemente ofegante", "Não sinto quase nada"])
  // condicionamento: 0=muito ruim, 3=ótimo

  // Q5 - Pressão arterial
  const pressao = idx(a[5], ["Sim, tenho hipertensão", "Sim, está elevada mas sem diagnóstico", "Não, está normal", "Nunca medi"])
  // pressao: 0=hipertensão, 2=normal

  // Q6 - Flexibilidade (tocar o chão)
  const flexibilidade = idx(a[6], ["Não chego nem perto", "Chego até o meio da canela", "Chego até os tornozelos", "Toco o chão com facilidade"])
  // flexibilidade: 0-3

  // Q7 - Força (flexões)
  const forca = idx(a[7], ["Menos de 5", "Entre 5 e 15", "Entre 15 e 30", "Mais de 30"])
  // forca: 0-3

  // Q8 - Tempo de experiência
  const experiencia = idx(a[8], ["Nunca pratiquei ou parei há muito tempo", "Menos de 3 meses", "Entre 3 meses e 1 ano", "Mais de 1 ano", "Mais de 3 anos"])
  // experiencia: 0=iniciante, 4=avançado

  // Q9 - Energia
  const energia = idx(a[9], ["Muito cansado, difícil de funcionar", "Cansado na maior parte do tempo", "Energia razoável, com quedas", "Bem disposto na maioria dos dias", "Energia alta o dia todo"])
  // energia: 0-4

  // Q10 - Horas de sono (slider 4-10)
  const horasSono = Number(a[10] ?? 7)

  // Q11 - Qualidade do sono
  const qualidadeSono = idx(a[11], ["Exausto, como se não tivesse dormido", "Cansado, preciso de tempo para despertar", "Razoável, demoro um pouco", "Descansado e pronto para o dia"])
  // qualidadeSono: 0-3

  // Q12 - Digestão
  const digestao = idx(a[12], ["Sim, quase todo dia", "Algumas vezes por semana", "Raramente", "Nunca"])
  // digestao: 0=problemática, 3=ótima

  // Q13 - Inflamação/dores
  const inflamacao = idx(a[13], ["Sim, dores constantes", "Sim, algumas vezes por semana", "Raramente", "Nunca"])
  // inflamacao: 0=constante, 3=nunca

  // Q14 - Água (copos, slider 1-16)
  const coposAgua = Number(a[14] ?? 6)
  const litrosAgua = +(coposAgua * 0.25).toFixed(1)

  // Q15 - Nutrição
  const nutricao = idx(a[15], ["Muito processada (fast food, industrializados)", "Mista (às vezes saudável, às vezes não)", "Majoritariamente natural e caseira", "Muito saudável e controlada"])
  // nutricao: 0-3

  // Q16 - Recuperação
  const recuperacao = idx(a[16], ["Mais de 3 dias", "2 a 3 dias", "1 a 2 dias", "Menos de 1 dia"])
  // recuperacao: 0=lenta, 3=rápida

  // Q17 - Estresse (slider 1-10)
  const estresse = Number(a[17] ?? 5)

  // ── Score geral (0-100) ────────────────────────────────────────────────────

  const scoreCondicionamento = condicionamento * 25                         // 0-75
  const scoreForca = forca * 25                                             // 0-75
  const scoreCorpo = corpo * 20                                             // 0-80
  const scoreSono = (qualidadeSono * 20) + (horasSono >= 7 ? 20 : horasSono >= 6 ? 10 : 0) // 0-80
  const scoreEnergia = energia * 20                                         // 0-80
  const scoreNutricao = nutricao * 25                                       // 0-75
  const scoreEstresse = Math.round((10 - estresse) * 7.5)                  // 0-75
  const scoreHidratacao = Math.min(litrosAgua / 3 * 100, 100)              // 0-100

  const overallScore = Math.min(100, Math.max(0, Math.round(
    scoreCondicionamento * 0.20 +
    scoreForca * 0.15 +
    scoreCorpo * 0.15 +
    scoreSono * 0.15 +
    scoreEnergia * 0.10 +
    scoreNutricao * 0.10 +
    scoreEstresse * 0.10 +
    scoreHidratacao * 0.05
  )))

  // ── Tipo de treino ─────────────────────────────────────────────────────────

  let workoutType = "Treino Funcional Balanceado"

  if (querEmagrecer) {
    if (condicionamento <= 1) workoutType = "Cardio Progressivo + Circuito para Iniciantes"
    else if (condicionamento <= 2) workoutType = "HIIT Moderado + Musculação Leve"
    else workoutType = "HIIT Intenso + Treino de Força"
  } else if (querMassa) {
    if (experiencia <= 1) workoutType = "Hipertrofia para Iniciantes (Full Body)"
    else if (experiencia <= 3) workoutType = "Hipertrofia Intermediária (Upper/Lower)"
    else workoutType = "Hipertrofia Avançada (Push/Pull/Legs)"
  } else if (querDefinir) {
    if (corpo <= 1) workoutType = "Emagrecimento + Tonificação Progressiva"
    else workoutType = "Definição Muscular (Circuito + Força)"
  } else {
    // Saúde geral
    if (experiencia === 0) workoutType = "Atividade Física para Iniciantes (Baixo Impacto)"
    else if (condicionamento <= 1) workoutType = "Mobilidade + Condicionamento Gradual"
    else workoutType = "Treino Funcional para Saúde e Bem-estar"
  }

  // Ajustes por limitações
  if (inflamacao <= 1) workoutType += " (Baixo Impacto Articular)"
  if (pressao === 0) workoutType = "Treino Adaptado para Hipertensos (Baixa Intensidade)"

  // ── Frequência semanal ─────────────────────────────────────────────────────

  let workoutFrequency = "4 dias/semana"
  if (experiencia === 0) workoutFrequency = "2-3 dias/semana (começar devagar)"
  else if (experiencia === 1) workoutFrequency = "3 dias/semana"
  else if (recuperacao >= 3 && estresse <= 4 && qualidadeSono >= 2) workoutFrequency = "5-6 dias/semana"
  else if (recuperacao <= 1 || estresse >= 8 || qualidadeSono <= 1) workoutFrequency = "3 dias/semana (priorize recuperação)"
  else if (inflamacao <= 1) workoutFrequency = "3 dias/semana (com descanso ativo)"

  // ── Áreas de foco ──────────────────────────────────────────────────────────

  const focusAreas: string[] = []
  if (querEmagrecer || corpo <= 1) focusAreas.push("Redução de gordura corporal")
  if (querMassa || musculo <= 1) focusAreas.push("Aumento de massa muscular")
  if (condicionamento <= 1) focusAreas.push("Condicionamento cardiovascular")
  if (flexibilidade <= 1) focusAreas.push("Melhoria de flexibilidade e mobilidade")
  if (forca <= 1) focusAreas.push("Desenvolvimento de força funcional")
  if (estresse >= 7) focusAreas.push("Gestão de estresse e ansiedade")
  if (qualidadeSono <= 1 || horasSono < 6) focusAreas.push("Melhoria da qualidade do sono")
  if (litrosAgua < 1.5) focusAreas.push("Aumento da hidratação diária")
  if (nutricao <= 1) focusAreas.push("Reeducação alimentar gradual")
  if (focusAreas.length === 0) focusAreas.push("Manutenção e otimização do desempenho")

  // ── Nutrição ───────────────────────────────────────────────────────────────

  let nutritionType = "Dieta Balanceada (40C/30P/30G)"
  let macroSplit = { protein: 30, carbs: 40, fat: 30 }
  let estimatedCalories = 2200

  if (querEmagrecer) {
    if (corpo === 0) {
      nutritionType = "Déficit Calórico Estruturado (35C/40P/25G)"
      macroSplit = { protein: 40, carbs: 35, fat: 25 }
      estimatedCalories = 1600
    } else {
      nutritionType = "Déficit Moderado com Alta Proteína (35C/35P/30G)"
      macroSplit = { protein: 35, carbs: 35, fat: 30 }
      estimatedCalories = 1800
    }
  } else if (querMassa) {
    nutritionType = "Superávit Limpo para Ganho de Massa (45C/35P/20G)"
    macroSplit = { protein: 35, carbs: 45, fat: 20 }
    estimatedCalories = experiencia >= 3 ? 2800 : 2500
  } else if (querDefinir) {
    nutritionType = "Recomposição Corporal (40C/35P/25G)"
    macroSplit = { protein: 35, carbs: 40, fat: 25 }
    estimatedCalories = 2000
  }

  // Ajustes por alimentação atual
  if (nutricao === 0) nutritionType += " + Transição Alimentar Gradual"
  if (digestao <= 1) nutritionType += " + Foco em Digestibilidade"

  // ── Hidratação ─────────────────────────────────────────────────────────────

  const metaAgua = Math.max(2, Math.min(4, litrosAgua < 1.5 ? litrosAgua + 1.5 : litrosAgua + 0.5))
  const hydrationGoal = `${metaAgua.toFixed(1)} litros/dia (${Math.round(metaAgua / 0.25)} copos)`

  // ── Sono ───────────────────────────────────────────────────────────────────

  let sleepRecommendation = "7-8 horas por noite"
  if (qualidadeSono <= 0) sleepRecommendation = "8-9 horas + rotina noturna sem telas 1h antes"
  else if (qualidadeSono <= 1) sleepRecommendation = "8 horas + horário fixo para dormir e acordar"
  else if (horasSono < 6) sleepRecommendation = "Aumente para 7-8 horas — sono curto prejudica resultados"
  if (estresse >= 8) sleepRecommendation += " + meditação guiada antes de dormir"

  // ── Metas semanais ─────────────────────────────────────────────────────────

  const weeklyGoals: string[] = [
    `Treinar ${workoutFrequency}`,
    `Consumir ${estimatedCalories} kcal/dia`,
    `Beber ${hydrationGoal}`,
    `Dormir ${sleepRecommendation}`,
  ]
  if (estresse >= 6) weeklyGoals.push("Praticar 10 min de respiração/meditação por dia")
  if (flexibilidade <= 1) weeklyGoals.push("15 min de alongamento ao acordar ou antes de dormir")
  if (querEmagrecer && condicionamento >= 2) weeklyGoals.push("30 min de caminhada nos dias sem treino")
  if (nutricao <= 1) weeklyGoals.push("Substituir 1 refeição processada por algo natural por semana")

  // ── Pontos fortes ──────────────────────────────────────────────────────────

  const strengths: string[] = []
  if (condicionamento >= 3) strengths.push("Condicionamento cardiovascular excelente")
  if (qualidadeSono >= 3) strengths.push("Qualidade de sono ótima — fator chave para resultados")
  if (musculo >= 3) strengths.push("Massa muscular bem desenvolvida")
  if (estresse <= 3) strengths.push("Baixo nível de estresse — favorece recuperação")
  if (forca >= 3) strengths.push("Força acima da média")
  if (condicionamento >= 2) strengths.push("Boa resistência física")
  if (flexibilidade >= 3) strengths.push("Excelente flexibilidade")
  if (nutricao >= 3) strengths.push("Alimentação saudável — base sólida para resultados")
  if (litrosAgua >= 2) strengths.push("Boa hidratação diária")
  if (experiencia >= 3) strengths.push("Experiência sólida com exercícios")
  if (recuperacao >= 3) strengths.push("Recuperação muscular rápida")
  if (strengths.length === 0) strengths.push("Motivação e disposição para mudar — o ponto de partida mais importante")

  // ── Alertas ────────────────────────────────────────────────────────────────

  const warnings: string[] = []
  if (pressao === 0) warnings.push("Hipertensão identificada — evite exercícios de alta intensidade e consulte um médico")
  if (pressao === 1) warnings.push("Pressão elevada — prefira exercícios de intensidade moderada")
  if (inflamacao === 0) warnings.push("Dores articulares constantes — evite impacto alto e consulte um ortopedista")
  if (estresse >= 9) warnings.push("Estresse crítico — overtraining pode piorar. Priorize descanso e saúde mental")
  if (qualidadeSono <= 0 && estresse >= 7) warnings.push("Sono ruim + estresse alto: combinação que sabota resultados — trate isso primeiro")
  if (horasSono < 5) warnings.push("Menos de 5h de sono: seu corpo não consegue se recuperar. Resultados serão mínimos sem isso")
  if (querMassa && corpo <= 1) warnings.push("Para ganhar massa sendo muito acima do peso, foque primeiro em emagrecer")

  // ── Rotina diária ──────────────────────────────────────────────────────────

  const dailySchedule: { time: string; activity: string }[] = []

  const horarioAcordar = qualidadeSono <= 1 ? "07:00" : "06:30"
  dailySchedule.push({ time: horarioAcordar, activity: "Acordar + 1 copo de água em jejum" })

  if (estresse >= 6) {
    dailySchedule.push({ time: "07:15", activity: "5 min de respiração profunda" })
  }

  dailySchedule.push({ time: "07:30", activity: `Café da manhã (${Math.round(estimatedCalories * 0.25)} kcal)` })

  if (querEmagrecer && condicionamento >= 2) {
    dailySchedule.push({ time: "08:30", activity: "Treino principal" })
  } else if (energia <= 1) {
    dailySchedule.push({ time: "17:00", activity: "Treino principal (melhor horário para energia baixa)" })
  } else {
    dailySchedule.push({ time: "08:00", activity: "Treino principal" })
  }

  dailySchedule.push({ time: "10:30", activity: `Lanche da manhã (${Math.round(estimatedCalories * 0.10)} kcal)` })
  dailySchedule.push({ time: "13:00", activity: `Almoço balanceado (${Math.round(estimatedCalories * 0.35)} kcal)` })
  dailySchedule.push({ time: "16:00", activity: `Lanche da tarde (${Math.round(estimatedCalories * 0.10)} kcal)` })
  dailySchedule.push({ time: "19:30", activity: `Jantar leve (${Math.round(estimatedCalories * 0.20)} kcal)` })

  if (flexibilidade <= 1) {
    dailySchedule.push({ time: "21:00", activity: "15 min de alongamento" })
  }
  if (estresse >= 6) {
    dailySchedule.push({ time: "21:30", activity: "10 min de meditação / respiração" })
  }

  const horarioDormir = horasSono < 7 ? "22:00" : "22:30"
  dailySchedule.push({ time: horarioDormir, activity: "Preparar para dormir — sem telas" })

  return {
    workoutType,
    workoutFrequency,
    workoutFocus: focusAreas.slice(0, 3).join(", ") || "Condicionamento geral",
    nutritionType,
    hydrationGoal,
    sleepRecommendation,
    weeklyGoals,
    strengths,
    focusAreas,
    warnings,
    dailySchedule,
    macroSplit,
    estimatedCalories,
    score: overallScore,
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function idx(val: string | number | undefined, options: string[]): number {
  if (val === undefined) return 1
  const i = options.indexOf(val as string)
  return i >= 0 ? i : 1
}
