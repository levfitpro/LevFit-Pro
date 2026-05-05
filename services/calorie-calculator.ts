interface CalorieCalcResult {
  tdee: number
  maintenance: number
  deficit: number
  surplus: number
  macros: {
    protein: number
    carbs: number
    fats: number
  }
}

export function calculateTDEE(params: {
  weight: number // kg
  height: number // cm
  age: number
  gender: "M" | "F"
  activityLevel: "sedentário" | "leve" | "moderado" | "muito ativo" | "extremo"
}): CalorieCalcResult {
  // Fórmula de Mifflin-St Jeor
  let bmr: number

  if (params.gender === "M") {
    bmr = 10 * params.weight + 6.25 * params.height - 5 * params.age + 5
  } else {
    bmr = 10 * params.weight + 6.25 * params.height - 5 * params.age - 161
  }

  const activityFactors = {
    sedentário: 1.2,
    leve: 1.375,
    moderado: 1.55,
    "muito ativo": 1.725,
    extremo: 1.9,
  }

  const tdee = bmr * activityFactors[params.activityLevel]
  const maintenance = Math.round(tdee)
  const deficit = Math.round(tdee - 500) // -500 calorias por dia = -0.5kg por semana
  const surplus = Math.round(tdee + 500) // +500 calorias por dia = +0.5kg por semana

  return {
    tdee: Math.round(tdee),
    maintenance,
    deficit,
    surplus,
    macros: {
      protein: Math.round(params.weight * 2.2), // 2.2g por kg para ganho de massa
      carbs: Math.round((maintenance * 0.45) / 4), // 45% das calorias em carbs
      fats: Math.round((maintenance * 0.25) / 9), // 25% das calorias em fats
    },
  }
}

export function saveTDEEProfile(profile: {
  weight: number
  height: number
  age: number
  gender: "M" | "F"
  activityLevel: string
  goal: "ganho" | "perda" | "manutenção"
}): void {
  localStorage.setItem("tdee_profile", JSON.stringify(profile))
}

export function getTDEEProfile() {
  const stored = localStorage.getItem("tdee_profile")
  return stored ? JSON.parse(stored) : null
}
