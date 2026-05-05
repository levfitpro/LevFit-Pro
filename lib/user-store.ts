// Local storage based user data management
export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
  goals: {
    primary: string
    weeklyTrainingHours: number
    dietaryRestrictions: string[]
  }
  stats: {
    weight: number
    height: number
    bodyFat: number
    muscleMass: number
    stressLevel: number
    sleepHours: number
  }
  xp: number
  level: number
  streak: number
  lastTrainingDate?: string
  achievements: Achievement[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  progress: number
  target: number
}

export interface Workout {
  id: string
  name: string
  type: string
  duration: number
  calories: number
  exercises: Exercise[]
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight?: number
  duration?: number
  muscleGroup: string
}

export interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  time: string
  date: string
}

export interface DailyProgress {
  date: string
  workoutsCompleted: number
  caloriesBurned: number
  caloriesConsumed: number
  waterIntake: number
  sleepHours: number
  xpEarned: number
}

export interface CompletedWorkout extends Workout {
  completedAt: string
  duration: number
  caloriesBurned: number
}

export interface DailyChallenge {
  id: string
  title: string
  description: string
  goal: number
  current: number
  xpReward: number
  difficulty: "fácil" | "médio" | "difícil"
  completed: boolean
  type: "treino" | "nutrição" | "hidratação" | "sono"
  date: string
}

const STORAGE_KEYS = {
  USER: "levfit_user",
  WORKOUTS: "levfit_workouts",
  MEALS: "levfit_meals",
  PROGRESS: "levfit_progress",
  COMPLETED_WORKOUTS: "levfit_completed_workouts",
  DAILY_CHALLENGES: "levfit_daily_challenges",
  AUTH: "levfit_auth",
}

export const defaultAchievements: Achievement[] = [
  { id: "1", title: "Primeiro Passo", description: "Complete seu primeiro treino", icon: "🏃", progress: 0, target: 1 },
  { id: "2", title: "Semana Forte", description: "Complete 7 dias seguidos de treino", icon: "💪", progress: 0, target: 7 },
  { id: "3", title: "Queima Total", description: "Queime 5000 calorias", icon: "🔥", progress: 0, target: 5000 },
  { id: "4", title: "Hidratação", description: "Beba 2L de água por 7 dias", icon: "💧", progress: 0, target: 7 },
  { id: "5", title: "Mestre Nutricional", description: "Registre 30 refeições", icon: "🥗", progress: 0, target: 30 },
]

// ── Criptografia segura com Web Crypto API ────────────────────────────────────
// Usa SHA-256 com salt — funciona no browser sem instalar nada

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(salt + password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

function generateSalt(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("")
}

// ── Usuário ───────────────────────────────────────────────────────────────────

export function getUser(): UserProfile | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(STORAGE_KEYS.USER)
  return data ? JSON.parse(data) : null
}

export function saveUser(user: UserProfile): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<UserProfile> {
  // Verifica se email já existe
  const existingAuth = localStorage.getItem(`${STORAGE_KEYS.AUTH}_${email.toLowerCase()}`)
  if (existingAuth) {
    throw new Error("Este email já está cadastrado")
  }

  // Hash seguro da senha
  const salt = generateSalt()
  const hash = await hashPassword(password, salt)

  // Salva credenciais com hash
  localStorage.setItem(
    `${STORAGE_KEYS.AUTH}_${email.toLowerCase()}`,
    JSON.stringify({ hash, salt, email: email.toLowerCase() })
  )

  const user: UserProfile = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.toLowerCase(),
    createdAt: new Date().toISOString(),
    goals: {
      primary: "",
      weeklyTrainingHours: 0,
      dietaryRestrictions: [],
    },
    stats: {
      weight: 0,
      height: 0,
      bodyFat: 0,
      muscleMass: 0,
      stressLevel: 0,
      sleepHours: 0,
    },
    xp: 0,
    level: 1,
    streak: 0,
    achievements: defaultAchievements,
  }

  saveUser(user)
  return user
}

export async function loginUser(
  email: string,
  password: string
): Promise<UserProfile | null> {
  if (typeof window === "undefined") return null

  const authData = localStorage.getItem(`${STORAGE_KEYS.AUTH}_${email.toLowerCase()}`)

  // Suporte legado: usuários criados com btoa() antes desta atualização
  if (!authData) {
    const legacyPass = localStorage.getItem(`levfit_pass_${email}`)
    if (legacyPass && atob(legacyPass) === password) {
      const user = getUser()
      if (user && user.email === email) {
        // Migra automaticamente para o novo sistema seguro
        const salt = generateSalt()
        const hash = await hashPassword(password, salt)
        localStorage.setItem(
          `${STORAGE_KEYS.AUTH}_${email.toLowerCase()}`,
          JSON.stringify({ hash, salt, email: email.toLowerCase() })
        )
        localStorage.removeItem(`levfit_pass_${email}`)
        return user
      }
    }
    return null
  }

  const { hash, salt } = JSON.parse(authData)
  const inputHash = await hashPassword(password, salt)

  if (inputHash !== hash) return null

  const user = getUser()
  if (user && user.email.toLowerCase() === email.toLowerCase()) return user
  return null
}

export function logoutUser(): void {
  if (typeof window === "undefined") return
  // Remove dados da sessão mas mantém credenciais para próximo login
  localStorage.removeItem(STORAGE_KEYS.USER)
  localStorage.removeItem(STORAGE_KEYS.PROGRESS)
}

// ── Treinos ───────────────────────────────────────────────────────────────────

export function getWorkouts(): Workout[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS)
  return data ? JSON.parse(data) : []
}

export function saveWorkout(workout: Workout): void {
  const workouts = getWorkouts()
  workouts.push(workout)
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts))
}

export function getCompletedWorkouts(): CompletedWorkout[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_WORKOUTS)
  return data ? JSON.parse(data) : []
}

export function saveCompletedWorkout(workout: CompletedWorkout): void {
  const completed = getCompletedWorkouts()
  completed.push(workout)
  localStorage.setItem(STORAGE_KEYS.COMPLETED_WORKOUTS, JSON.stringify(completed))

  // Atualiza streak
  const user = getUser()
  if (user) {
    const today = new Date().toISOString().split("T")[0]
    const lastDate = user.lastTrainingDate
    if (lastDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split("T")[0]
      user.streak = lastDate === yesterdayStr ? (user.streak || 0) + 1 : 1
      user.lastTrainingDate = today
      saveUser(user)
    }
  }
}

export function getCompletedWorkoutsByDateRange(
  startDate: string,
  endDate: string
): CompletedWorkout[] {
  return getCompletedWorkouts().filter(
    (w) => w.completedAt >= startDate && w.completedAt <= endDate
  )
}

// ── Refeições ─────────────────────────────────────────────────────────────────

export function getMeals(): Meal[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.MEALS)
  return data ? JSON.parse(data) : []
}

export function saveMeal(meal: Meal): void {
  const meals = getMeals()
  meals.push(meal)
  localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals))
}

// ── Progresso diário ──────────────────────────────────────────────────────────

export function getTodayProgress(): DailyProgress {
  const today = new Date().toISOString().split("T")[0]
  if (typeof window === "undefined") return getDefaultProgress(today)
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS)
  const allProgress: DailyProgress[] = data ? JSON.parse(data) : []
  return allProgress.find((p) => p.date === today) || getDefaultProgress(today)
}

function getDefaultProgress(date: string): DailyProgress {
  return {
    date,
    workoutsCompleted: 0,
    caloriesBurned: 0,
    caloriesConsumed: 0,
    waterIntake: 0,
    sleepHours: 0,
    xpEarned: 0,
  }
}

export function updateProgress(progress: Partial<DailyProgress>): void {
  const today = new Date().toISOString().split("T")[0]
  if (typeof window === "undefined") return
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS)
  const allProgress: DailyProgress[] = data ? JSON.parse(data) : []
  const index = allProgress.findIndex((p) => p.date === today)
  const current = index >= 0 ? allProgress[index] : getDefaultProgress(today)
  const updated = { ...current, ...progress }
  if (index >= 0) {
    allProgress[index] = updated
  } else {
    allProgress.push(updated)
  }
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress))
}

// ── XP e nível ────────────────────────────────────────────────────────────────

export function addXP(amount: number): { newXP: number; leveledUp: boolean; newLevel: number } {
  const user = getUser()
  if (!user) return { newXP: 0, leveledUp: false, newLevel: 1 }

  const xpPerLevel = 1000
  const newXP = user.xp + amount
  const newLevel = Math.floor(newXP / xpPerLevel) + 1
  const leveledUp = newLevel > user.level

  user.xp = newXP
  user.level = newLevel
  saveUser(user)

  return { newXP, leveledUp, newLevel }
}

// ── Desafios diários ──────────────────────────────────────────────────────────

export function getDailyChallenges(): DailyChallenge[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGES)
  return data ? JSON.parse(data) : []
}

export function saveDailyChallenge(challenge: DailyChallenge): void {
  const challenges = getDailyChallenges()
  const index = challenges.findIndex(
    (c) => c.id === challenge.id && c.date === challenge.date
  )
  if (index >= 0) {
    challenges[index] = challenge
  } else {
    challenges.push(challenge)
  }
  localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGES, JSON.stringify(challenges))
}

export function completeDailyChallenge(id: string): void {
  const challenges = getDailyChallenges()
  const challenge = challenges.find((c) => c.id === id)
  if (challenge && !challenge.completed) {
    challenge.completed = true
    saveDailyChallenge(challenge)
    addXP(challenge.xpReward)
  }
}

// ── Utilitários ───────────────────────────────────────────────────────────────

export function calculateIMC(weight: number, height: number): number {
  if (height === 0) return 0
  return weight / Math.pow(height / 100, 2)
}
