export interface BiologyQuestion {
  id: number
  category: string
  question: string
  subtitle?: string
  type: "slider" | "select" | "multiple"
  options?: string[]
  min?: number
  max?: number
  step?: number
  unit?: string
}

export const biologyQuestions: BiologyQuestion[] = [
  {
    id: 1,
    category: "Objetivo",
    question: "Qual é seu objetivo principal?",
    subtitle: "Isso define toda a estrutura do seu plano",
    type: "select",
    options: [
      "Emagrecer e perder gordura",
      "Ganhar massa muscular",
      "Definir e tonificar",
      "Melhorar saúde e disposição",
    ],
  },
  {
    id: 2,
    category: "Composição Corporal",
    question: "Como você descreveria seu corpo hoje?",
    subtitle: "Seja honesto — isso ajuda a calibrar seu plano",
    type: "select",
    options: [
      "Muito acima do peso",
      "Acima do peso",
      "Peso normal com pouca definição",
      "Peso normal com alguma definição",
      "Bem definido",
    ],
  },
  {
    id: 3,
    category: "Composição Corporal",
    question: "Você consegue ver alguma musculatura no seu corpo?",
    subtitle: "Ex: braços, ombros, pernas",
    type: "select",
    options: [
      "Não, quase nada",
      "Um pouco, com esforço",
      "Sim, com roupas normais",
      "Sim, bem visível",
    ],
  },
  {
    id: 4,
    category: "Saúde Cardiovascular",
    question: "Subindo 3 lances de escada rapidamente, você:",
    subtitle: "Uma forma prática de medir seu condicionamento",
    type: "select",
    options: [
      "Fico muito sem fôlego, preciso parar",
      "Fico bastante ofegante",
      "Fico levemente ofegante",
      "Não sinto quase nada",
    ],
  },
  {
    id: 5,
    category: "Saúde Cardiovascular",
    question: "Algum médico já te disse que sua pressão é alta?",
    type: "select",
    options: [
      "Sim, tenho hipertensão",
      "Sim, está elevada mas sem diagnóstico",
      "Não, está normal",
      "Nunca medi",
    ],
  },
  {
    id: 6,
    category: "Flexibilidade",
    question: "Em pé, sem dobrar os joelhos, você consegue tocar o chão com as mãos?",
    subtitle: "Teste prático de flexibilidade",
    type: "select",
    options: [
      "Não chego nem perto",
      "Chego até o meio da canela",
      "Chego até os tornozelos",
      "Toco o chão com facilidade",
    ],
  },
  {
    id: 7,
    category: "Força",
    question: "Quantas flexões seguidas você consegue fazer?",
    subtitle: "Homens: flexão normal. Mulheres: pode ser com joelhos apoiados",
    type: "select",
    options: [
      "Menos de 5",
      "Entre 5 e 15",
      "Entre 15 e 30",
      "Mais de 30",
    ],
  },
  {
    id: 8,
    category: "Resistência",
    question: "Há quanto tempo você pratica exercícios regularmente?",
    subtitle: "Regularmente = pelo menos 2x por semana",
    type: "select",
    options: [
      "Nunca pratiquei ou parei há muito tempo",
      "Menos de 3 meses",
      "Entre 3 meses e 1 ano",
      "Mais de 1 ano",
      "Mais de 3 anos",
    ],
  },
  {
    id: 9,
    category: "Energia e Hormônios",
    question: "Como está sua energia ao longo do dia?",
    type: "select",
    options: [
      "Muito cansado, difícil de funcionar",
      "Cansado na maior parte do tempo",
      "Energia razoável, com quedas",
      "Bem disposto na maioria dos dias",
      "Energia alta o dia todo",
    ],
  },
  {
    id: 10,
    category: "Sono",
    question: "Quantas horas você dorme por noite em média?",
    type: "slider",
    min: 4,
    max: 10,
    step: 0.5,
    unit: "h",
  },
  {
    id: 11,
    category: "Sono",
    question: "Ao acordar, você se sente:",
    type: "select",
    options: [
      "Exausto, como se não tivesse dormido",
      "Cansado, preciso de tempo para despertar",
      "Razoável, demoro um pouco",
      "Descansado e pronto para o dia",
    ],
  },
  {
    id: 12,
    category: "Digestão",
    question: "Você tem problemas digestivos com frequência?",
    subtitle: "Ex: inchaço, gases, constipação, refluxo",
    type: "select",
    options: [
      "Sim, quase todo dia",
      "Algumas vezes por semana",
      "Raramente",
      "Nunca",
    ],
  },
  {
    id: 13,
    category: "Inflamação",
    question: "Você sente dores articulares ou musculares frequentes?",
    subtitle: "Fora do contexto de treino",
    type: "select",
    options: [
      "Sim, dores constantes",
      "Sim, algumas vezes por semana",
      "Raramente",
      "Nunca",
    ],
  },
  {
    id: 14,
    category: "Hidratação",
    question: "Quantos copos de água você bebe por dia?",
    subtitle: "1 copo = 250ml",
    type: "slider",
    min: 1,
    max: 16,
    step: 1,
    unit: " copos",
  },
  {
    id: 15,
    category: "Nutrição",
    question: "Como é sua alimentação no dia a dia?",
    type: "select",
    options: [
      "Muito processada (fast food, industrializados)",
      "Mista (às vezes saudável, às vezes não)",
      "Majoritariamente natural e caseira",
      "Muito saudável e controlada",
    ],
  },
  {
    id: 16,
    category: "Recuperação",
    question: "Após um treino intenso, quanto tempo você leva para se recuperar?",
    type: "select",
    options: [
      "Mais de 3 dias",
      "2 a 3 dias",
      "1 a 2 dias",
      "Menos de 1 dia",
    ],
  },
  {
    id: 17,
    category: "Estresse",
    question: "Qual seu nível de estresse e ansiedade no dia a dia?",
    type: "slider",
    min: 1,
    max: 10,
    step: 1,
    unit: "",
  },
]

export interface BiologyProfile {
  timestamp: number
  answers: Record<number, string | number>
  categories: {
    [key: string]: number
  }
}
