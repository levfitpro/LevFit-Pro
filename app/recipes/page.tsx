"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TopBar, NavBar } from "@/components/levfit/nav-bar"
import { GlassCard } from "@/components/ui/glass-card"
import { Apple, Clock, Flame, ChevronLeft, Star, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useApp } from "@/contexts/app-context"
import type { Meal } from "@/lib/user-store"

interface Recipe {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  prepTime: number
  difficulty: "fácil" | "médio" | "difícil"
  category: string
  description: string
  emoji: string
  ingredients: string[]
  instructions: string[]
  tips: string
  recommended?: boolean
}

const ALL_RECIPES: Recipe[] = [
  { id: "1", name: "Frango Grelhado com Batata Doce", calories: 450, protein: 45, carbs: 35, fat: 12, prepTime: 30, difficulty: "fácil", category: "Hiperproteica", description: "Refeição clássica para ganho muscular com excelente perfil nutricional.", emoji: "🍗", ingredients: ["200g de frango", "150g de batata doce", "1 colher de azeite", "Sal, pimenta e alho a gosto", "Ervas frescas"], instructions: ["Tempere o frango com sal, pimenta e alho", "Cozinhe a batata doce no micro-ondas por 8 min", "Grelhe o frango por 7 min de cada lado", "Regue com azeite e sirva com as ervas"], tips: "Marinhe o frango por 30 min para mais sabor" },
  { id: "2", name: "Salada Detox Verde", calories: 220, protein: 12, carbs: 25, fat: 8, prepTime: 10, difficulty: "fácil", category: "Hipocalórica", description: "Leve, nutritiva e perfeita para dias de baixa caloria ou como acompanhamento.", emoji: "🥗", ingredients: ["Alface americana", "Espinafre fresco", "Pepino", "1 limão espremido", "1 colher de azeite", "Sementes de girassol"], instructions: ["Lave e seque todos os vegetais", "Corte o pepino em rodelas", "Misture tudo em uma tigela", "Tempere com limão, azeite e sal"], tips: "Adicione atum em lata para aumentar a proteína" },
  { id: "3", name: "Omelete Proteico", calories: 320, protein: 28, carbs: 8, fat: 20, prepTime: 15, difficulty: "fácil", category: "Hiperproteica", description: "Rápido, prático e rico em proteína. Perfeito para café da manhã ou lanche.", emoji: "🍳", ingredients: ["3 ovos inteiros", "50g de queijo cottage", "1 tomate picado", "Cebola roxa a gosto", "Sal e pimenta", "1 colher de azeite"], instructions: ["Bata os ovos com sal e pimenta", "Refogue a cebola no azeite", "Adicione os ovos e o tomate", "Cozinhe tampado por 5 min", "Adicione o cottage e sirva"], tips: "Use clara de ovo extra para mais proteína com menos calorias" },
  { id: "4", name: "Salmão com Quinoa e Brócolis", calories: 580, protein: 48, carbs: 42, fat: 22, prepTime: 35, difficulty: "médio", category: "Balanceada", description: "Refeição premium com ômega-3, proteína completa e fibras. Ideal para recuperação.", emoji: "🐟", ingredients: ["180g de salmão", "100g de quinoa seca", "1 xícara de brócolis", "1 limão", "2 colheres de azeite", "Alho e sal"], instructions: ["Cozinhe a quinoa por 15 min na proporção 1:2 com água", "Tempere o salmão com limão, sal e alho", "Asse o salmão a 200°C por 15 min", "Cozinhe o brócolis no vapor por 5 min", "Monte o prato e regue com azeite"], tips: "O salmão está no ponto quando a carne solta facilmente" },
  { id: "5", name: "Shake Proteico Tropical", calories: 320, protein: 40, carbs: 28, fat: 6, prepTime: 5, difficulty: "fácil", category: "Hiperproteica", description: "Prático e delicioso para pós-treino. Rico em proteína e carboidratos de rápida absorção.", emoji: "🥤", ingredients: ["1 scoop de whey (baunilha)", "200ml de leite desnatado", "1 banana congelada", "1 colher de pasta de amendoim", "Canela a gosto", "Gelo"], instructions: ["Coloque todos os ingredientes no liquidificador", "Bata por 30 segundos", "Sirva imediatamente"], tips: "Consuma em até 30 min após o treino para melhor absorção" },
  { id: "6", name: "Bowl de Açaí Fitness", calories: 380, protein: 15, carbs: 52, fat: 14, prepTime: 10, difficulty: "fácil", category: "Balanceada", description: "Energético e antioxidante. Ótimo para café da manhã antes de treinos longos.", emoji: "🫐", ingredients: ["200g de açaí sem açúcar", "1 banana", "50g de granola sem açúcar", "1 colher de mel", "Frutas vermelhas", "Coco ralado"], instructions: ["Bata o açaí com a banana no liquidificador", "Despeje em uma tigela", "Adicione a granola e as frutas", "Regue com mel"], tips: "Prefira açaí sem adição de açúcar ou xarope de guaraná" },
  { id: "7", name: "Wrap Integral de Frango", calories: 420, protein: 35, carbs: 45, fat: 11, prepTime: 20, difficulty: "fácil", category: "Balanceada", description: "Prático para levar no trabalho ou academia. Completo e saboroso.", emoji: "🌯", ingredients: ["1 tortilla integral", "150g de frango desfiado", "Alface", "Tomate", "1 colher de cream cheese light", "Mostarda"], instructions: ["Grelhe o frango e desfie", "Espalhe o cream cheese na tortilla", "Adicione o frango e os vegetais", "Tempere com mostarda", "Enrole firmemente"], tips: "Prepare com antecedência e guarde na geladeira por até 1 dia" },
  { id: "8", name: "Panqueca de Aveia e Banana", calories: 280, protein: 18, carbs: 38, fat: 7, prepTime: 15, difficulty: "fácil", category: "Hipocalórica", description: "Café da manhã saudável e saboroso. Sem farinha branca e sem açúcar refinado.", emoji: "🥞", ingredients: ["2 ovos", "1 banana madura", "4 colheres de aveia", "Canela", "1 colher de mel", "Frutas para acompanhar"], instructions: ["Amasse a banana com um garfo", "Misture os ovos e a aveia", "Adicione canela a gosto", "Cozinhe em frigideira antiaderente", "Sirva com mel e frutas"], tips: "Quanto mais madura a banana, mais doce a panqueca" },
  { id: "9", name: "Strogonoff Light de Frango", calories: 390, protein: 38, carbs: 30, fat: 12, prepTime: 25, difficulty: "médio", category: "Balanceada", description: "Versão saudável do clássico brasileiro. Menos gordura, mesmo sabor.", emoji: "🍲", ingredients: ["300g de frango em cubos", "1 caixa de creme de leite light", "1 lata de champignon", "1 tomate", "Cebola e alho", "Catchup e mostarda"], instructions: ["Refogue o alho e cebola", "Adicione o frango e doure", "Junte o tomate picado", "Adicione o creme de leite e champignon", "Tempere e cozinhe por 10 min"], tips: "Sirva com arroz integral para uma refeição mais nutritiva" },
  { id: "10", name: "Smoothie Verde Energizante", calories: 180, protein: 8, carbs: 30, fat: 4, prepTime: 5, difficulty: "fácil", category: "Hipocalórica", description: "Bebida nutritiva e energizante para começar o dia ou como pré-treino leve.", emoji: "🥬", ingredients: ["1 xícara de espinafre", "1 maçã verde", "1 pepino pequeno", "Gengibre fresco", "Suco de 1 limão", "200ml de água de coco"], instructions: ["Coloque todos os ingredientes no liquidificador", "Bata até ficar homogêneo", "Coe se preferir", "Sirva gelado"], tips: "Adicione 1 scoop de proteína para um pré-treino mais completo" },
]

const categories = ["Todos", "Hiperproteica", "Hipocalórica", "Balanceada"]
const difficultyColors = {
  fácil: "text-green-400 bg-green-400/10",
  médio: "text-amber-400 bg-amber-400/10",
  difícil: "text-red-400 bg-red-400/10",
}

export default function RecipesPage() {
  const router = useRouter()
  const { addMeal, earnXP } = useApp()
  const [selected, setSelected] = useState<Recipe | null>(null)
  const [category, setCategory] = useState("Todos")
  const [added, setAdded] = useState<string | null>(null)

  useEffect(() => {
    const plan = localStorage.getItem("personal_plan")
    if (plan) {
      const p = JSON.parse(plan)
      const tipo = p.nutritionType || ""
      ALL_RECIPES.forEach((r) => {
        if (tipo.includes("Déficit") && r.category === "Hipocalórica") r.recommended = true
        if (tipo.includes("Superávit") && r.category === "Hiperproteica") r.recommended = true
        if (tipo.includes("Recomposição") && r.category === "Balanceada") r.recommended = true
      })
    }
  }, [])

  const handleAddToNutrition = (recipe: Recipe) => {
    const meal: Meal = {
      id: crypto.randomUUID(),
      name: recipe.name,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toISOString().split("T")[0],
    }
    addMeal(meal)
    earnXP(25)
    setAdded(recipe.id)
    setTimeout(() => setAdded(null), 2000)
  }

  const filtered = category === "Todos" ? ALL_RECIPES : ALL_RECIPES.filter((r) => r.category === category)

  if (selected) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-24 pt-20">
        <TopBar />
        <div className="max-w-lg mx-auto p-4">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="w-5 h-5" /> Voltar
          </button>
          <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-accent/20 to-secondary/20 border border-accent/20 flex items-center justify-center mb-4">
            <span className="text-7xl">{selected.emoji}</span>
          </div>
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-xl font-bold flex-1">{selected.name}</h1>
            <span className={cn("text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0", difficultyColors[selected.difficulty])}>{selected.difficulty}</span>
          </div>
          <p className="text-muted-foreground text-sm mb-4">{selected.description}</p>

          {/* Macros */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: "Kcal", value: selected.calories, color: "text-accent" },
              { label: "Prot", value: `${selected.protein}g`, color: "text-blue-400" },
              { label: "Carbs", value: `${selected.carbs}g`, color: "text-amber-400" },
              { label: "Gord", value: `${selected.fat}g`, color: "text-rose-400" },
            ].map((m) => (
              <div key={m.label} className="text-center bg-muted/20 rounded-xl p-2">
                <p className={cn("text-lg font-bold", m.color)}>{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mb-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{selected.prepTime} min</span>
          </div>

          <GlassCard className="p-4 mb-4">
            <h3 className="font-semibold mb-3">Ingredientes</h3>
            <ul className="space-y-1.5">
              {selected.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span className="text-foreground/80">{ing}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-4 mb-4">
            <h3 className="font-semibold mb-3">Modo de preparo</h3>
            <ol className="space-y-2">
              {selected.instructions.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-secondary font-bold flex-shrink-0">{i + 1}.</span>
                  <span className="text-foreground/80">{step}</span>
                </li>
              ))}
            </ol>
          </GlassCard>

          {selected.tips && (
            <GlassCard className="p-4 mb-6 border border-accent/20">
              <div className="flex items-start gap-2 text-sm">
                <Star className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-foreground/80"><strong>Dica:</strong> {selected.tips}</p>
              </div>
            </GlassCard>
          )}

          <button
            onClick={() => handleAddToNutrition(selected)}
            className={cn(
              "w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all",
              added === selected.id
                ? "bg-green-500 text-white"
                : "bg-gradient-to-r from-accent to-secondary text-background"
            )}
          >
            {added === selected.id ? "✓ Adicionado à nutrição!" : (
              <><Plus className="w-5 h-5" /> Adicionar à Nutrição de Hoje</>
            )}
          </button>
        </div>
        <NavBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-20">
      <TopBar />
      <div className="max-w-lg mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Apple className="w-6 h-6 text-accent" />Receitas Fitness</h1>
            <p className="text-muted-foreground text-sm">{ALL_RECIPES.length} receitas saudáveis</p>
          </div>
          <button onClick={() => router.push("/dashboard")} className="p-2 rounded-lg hover:bg-muted/50">×</button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0", category === cat ? "bg-accent text-background" : "bg-muted/40 text-muted-foreground hover:bg-muted/60")}>{cat}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((recipe) => (
            <button key={recipe.id} onClick={() => setSelected(recipe)} className="w-full text-left">
              <GlassCard className={cn("p-4 hover:border-accent/40 transition-all", recipe.recommended && "border-accent/30 bg-accent/5")}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center flex-shrink-0 text-2xl">{recipe.emoji}</div>
                  <div className="flex-1 min-w-0">
                    {recipe.recommended && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-medium">Recomendada</span>}
                    <p className="font-semibold text-sm leading-tight mt-0.5">{recipe.name}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-accent"><Flame className="w-3 h-3" />{recipe.calories} kcal</span>
                      <span className="text-xs text-blue-400">P: {recipe.protein}g</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{recipe.prepTime}min</span>
                    </div>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium mt-1 inline-block", difficultyColors[recipe.difficulty])}>{recipe.difficulty}</span>
                  </div>
                </div>
              </GlassCard>
            </button>
          ))}
        </div>
      </div>
      <NavBar />
    </div>
  )
}

