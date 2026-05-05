import type { BiologyProfile } from "@/data/biology-quiz"
import { generatePersonalPlan } from "./personalization-engine"

export interface Recipe {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  prepTime: number
  difficulty: "fácil" | "médio" | "difícil"
  type: "Hipocalórica" | "Hiperproteica" | "Desintoxicante" | "Balanceada"
  ingredients: string[]
  instructions: string[]
}

export interface WorkoutVideo {
  id: string
  title: string
  duration: number
  difficulty: "iniciante" | "intermediário" | "avançado"
  caloriesBurn: number
  category: "Cardio" | "Força" | "Flexibilidade" | "Core"
  type: string
  description: string
}

const ALL_RECIPES: Recipe[] = [
  {
    id: "1",
    name: "Frango com Batata Doce",
    calories: 450,
    protein: 45,
    carbs: 35,
    fats: 12,
    prepTime: 30,
    difficulty: "fácil",
    type: "Hiperproteica",
    ingredients: ["200g de frango", "150g de batata doce", "Azeite de oliva", "Sal e pimenta"],
    instructions: ["Temperar o frango", "Cozinhar a batata doce", "Grelhar o frango por 15 min"],
  },
  {
    id: "2",
    name: "Salada Detox Verde",
    calories: 220,
    protein: 12,
    carbs: 25,
    fats: 8,
    prepTime: 10,
    difficulty: "fácil",
    type: "Desintoxicante",
    ingredients: ["Alface", "Espinafre", "Pepino", "Limão", "Azeite"],
    instructions: ["Lavar vegetais", "Cortar e misturar", "Temperar com limão e azeite"],
  },
  {
    id: "3",
    name: "Omelete Light",
    calories: 280,
    protein: 28,
    carbs: 8,
    fats: 15,
    prepTime: 15,
    difficulty: "fácil",
    type: "Hipocalórica",
    ingredients: ["3 ovos", "Tomate", "Cebola", "Temperos"],
    instructions: ["Bater ovos", "Adicionar vegetais", "Cozinhar por 8 min"],
  },
  {
    id: "4",
    name: "Salmão com Quinoa",
    calories: 580,
    protein: 48,
    carbs: 42,
    fats: 22,
    prepTime: 35,
    difficulty: "médio",
    type: "Balanceada",
    ingredients: ["180g de salmão", "100g de quinoa", "Brócolis", "Limão"],
    instructions: ["Cozinhar quinoa", "Assar salmão", "Cozinhar brócolis no vapor"],
  },
  {
    id: "5",
    name: "Shake Proteico",
    calories: 320,
    protein: 40,
    carbs: 28,
    fats: 6,
    prepTime: 5,
    difficulty: "fácil",
    type: "Hiperproteica",
    ingredients: ["1 scoop whey", "200ml leite desnatado", "1 banana", "Canela"],
    instructions: ["Misturar ingredientes", "Bater no liquidificador", "Servir gelado"],
  },
  {
    id: "6",
    name: "Bowl Vegetariano",
    calories: 380,
    protein: 18,
    carbs: 52,
    fats: 12,
    prepTime: 20,
    difficulty: "fácil",
    type: "Desintoxicante",
    ingredients: ["Grão de bico", "Abóbora", "Couve", "Tahine"],
    instructions: ["Assar abóbora", "Cozinhar grão de bico", "Montar bowl"],
  },
  {
    id: "7",
    name: "Peixe Grelhado Light",
    calories: 340,
    protein: 42,
    carbs: 18,
    fats: 10,
    prepTime: 25,
    difficulty: "médio",
    type: "Hipocalórica",
    ingredients: ["180g tilápia", "Legumes", "Ervas", "Limão"],
    instructions: ["Temperar peixe", "Grelhar por 12 min", "Servir com legumes"],
  },
  {
    id: "8",
    name: "Arroz Integral com Carne",
    calories: 520,
    protein: 38,
    carbs: 55,
    fats: 15,
    prepTime: 40,
    difficulty: "médio",
    type: "Balanceada",
    ingredients: ["150g patinho", "100g arroz integral", "Feijão", "Salada"],
    instructions: ["Cozinhar arroz", "Grelhar carne", "Cozinhar feijão"],
  },
]

const ALL_VIDEOS: WorkoutVideo[] = [
  {
    id: "1",
    title: "HIIT Cardio 20 min",
    duration: 20,
    difficulty: "intermediário",
    caloriesBurn: 250,
    category: "Cardio",
    type: "Cardio Focus",
    description: "Treino intenso de queima de calorias",
  },
  {
    id: "2",
    title: "Hipertrofia de Pernas",
    duration: 45,
    difficulty: "avançado",
    caloriesBurn: 320,
    category: "Força",
    type: "Strength Focus",
    description: "Desenvolvimento muscular de membros inferiores",
  },
  {
    id: "3",
    title: "Yoga Matinal",
    duration: 15,
    difficulty: "iniciante",
    caloriesBurn: 50,
    category: "Flexibilidade",
    type: "Mobility & Flexibility",
    description: "Alongamento e preparação para o dia",
  },
  {
    id: "4",
    title: "Abdômen Definido",
    duration: 12,
    difficulty: "intermediário",
    caloriesBurn: 120,
    category: "Core",
    type: "Balanced",
    description: "Exercícios focados em core",
  },
  {
    id: "5",
    title: "Cardio Queima Gordura",
    duration: 30,
    difficulty: "intermediário",
    caloriesBurn: 380,
    category: "Cardio",
    type: "Cardio Focus",
    description: "Treino aeróbico intenso",
  },
  {
    id: "6",
    title: "Força de Braços",
    duration: 35,
    difficulty: "avançado",
    caloriesBurn: 220,
    category: "Força",
    type: "Strength Focus",
    description: "Hipertrofia de membros superiores",
  },
  {
    id: "7",
    title: "Mobilidade e Alongamento",
    duration: 20,
    difficulty: "iniciante",
    caloriesBurn: 60,
    category: "Flexibilidade",
    type: "Mobility & Flexibility",
    description: "Melhora flexibilidade e amplitude",
  },
  {
    id: "8",
    title: "Treino Funcional Full Body",
    duration: 40,
    difficulty: "intermediário",
    caloriesBurn: 300,
    category: "Core",
    type: "Balanced",
    description: "Treino completo de corpo inteiro",
  },
]

export function getPersonalizedRecipes(): Recipe[] {
  const profile = loadBiologyProfile()
  if (!profile) return ALL_RECIPES.slice(0, 5)

  const plan = generatePersonalPlan(profile)

  const filteredRecipes = ALL_RECIPES.filter((recipe) => recipe.type === plan.nutritionType)

  if (filteredRecipes.length < 5) {
    const balanced = ALL_RECIPES.filter((r) => r.type === "Balanceada" && !filteredRecipes.includes(r))
    return [...filteredRecipes, ...balanced].slice(0, 5)
  }

  return filteredRecipes.slice(0, 5)
}

export function getPersonalizedVideos(): WorkoutVideo[] {
  const profile = loadBiologyProfile()
  if (!profile) return ALL_VIDEOS.slice(0, 5)

  const plan = generatePersonalPlan(profile)

  const filteredVideos = ALL_VIDEOS.filter((video) => video.type === plan.workoutType)

  if (filteredVideos.length < 5) {
    const balanced = ALL_VIDEOS.filter((v) => v.type === "Balanced" && !filteredVideos.includes(v))
    return [...filteredVideos, ...balanced].slice(0, 5)
  }

  return filteredVideos.slice(0, 5)
}

function loadBiologyProfile(): BiologyProfile | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("biology_profile")
  return stored ? JSON.parse(stored) : null
}
