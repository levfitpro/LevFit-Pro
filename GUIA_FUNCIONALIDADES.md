# 🎯 Guia de Navegação - LevFit Pro

## 📱 Onde Encontrar Cada Funcionalidade

### **1. HISTÓRICO DE TREINOS**
- **Rota**: `/history`
- **Como acessar**: 
  - Dashboard → clique em "Ver Histórico"
  - Ou navegação inferior → Ícone de histórico
- **O que faz**: Mostra todos os treinos realizados, filtrados por período

### **2. RELATÓRIOS SEMANAL/MENSAL**
- **Rota**: `/reports`
- **Como acessar**: 
  - Dashboard → clique em "Relatórios"
  - Ou navegação inferior → Ícone de gráfico
- **O que faz**: Gráficos de progresso, caloricas, XP ganho

### **3. DESAFIOS DIÁRIOS**
- **Rota**: `/challenges`
- **Como acessar**: 
  - Dashboard → "Desafios do Dia"
  - Ou navegação inferior → Ícone de troféu
- **O que faz**: 5 desafios com XP, completa e ganha pontos

### **4. BIBLIOTECA DE VÍDEOS**
- **Rota**: `/videos`
- **Como acessar**: 
  - Workouts → "Ver Vídeos"
  - Ou navegação inferior → Ícone de play
- **O que faz**: Treinos em vídeo por categoria

### **5. RECEITAS PERSONALIZADAS**
- **Rota**: `/recipes`
- **Como acessar**: 
  - Nutrition → "Receitas Sugeridas"
  - Ou navegação inferior → Ícone de receita
- **O que faz**: Receitas com macros baseadas no quiz de biologia

### **6. CALCULADORA DE CALORIAS**
- **Rota**: `/calorie-calculator`
- **Como acessar**: 
  - Nutrition → "Calcular TDEE"
  - Ou rota direta
- **O que faz**: Calcula calorias, deficit/surplus, distribuição de macros

### **7. ANÁLISE DO PERFIL BIOLÓGICO**
- **Rota**: `/biology-insights`
- **Como acessar**: 
  - Quiz de Biologia → "Ver Análise"
  - Ou Personal Plan → "Detalhes"
- **O que faz**: Mostra pontos fortes, áreas de melhoria, recomendações

### **8. COMPARTILHAMENTO SOCIAL**
- **Rota**: `/sharing`
- **Como acessar**: 
  - Profile → "Compartilhar Progresso"
  - Ou Achievement → botão de share
- **O que faz**: Compartilha no WhatsApp, Instagram, Twitter

### **9. RASTREAMENTO DE HIDRATAÇÃO**
- **Rota**: `/hydration`
- **Como acessar**: 
  - Dashboard → "Água do Dia"
  - Ou navegação inferior → Ícone de água
- **O que faz**: Registra consumo de água com botões rápidos

### **10. QUIZ DE BIOLOGIA (17 Fatores)**
- **Rota**: `/quiz/biology`
- **Como acessar**: 
  - Onboarding inicial
  - Ou Settings → "Refazer Quiz"
- **O que faz**: 17 perguntas personalizadas

### **11. PLANO PERSONALIZADO**
- **Rota**: `/personal-plan`
- **Como acessar**: 
  - Após completar quiz
  - Dashboard → "Meu Plano"
- **O que faz**: Recomendações personalizadas baseadas no quiz

### **12. DASHBOARD PRINCIPAL**
- **Rota**: `/dashboard`
- **Como acessar**: Logo após login
- **O que faz**: Hub central com XP, progresso, resumo do dia

### **13. TREINOS**
- **Rota**: `/workouts`
- **Como acessar**: Navegação inferior
- **O que faz**: Lista de treinos por tipo (Hipertrofia, HIIT, etc)

### **14. NUTRIÇÃO**
- **Rota**: `/nutrition`
- **Como acessar**: Navegação inferior
- **O que faz**: Food log, macros, calorias, scanner de alimentos

---

## 🗺️ MAPA DE NAVEGAÇÃO VISUAL

```
┌─────────────────────────────────────────┐
│         LOGIN / REGISTER / SPLASH       │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│        WELCOME + QUIZ BIOLOGIA (NEW)    │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  PERSONAL PLAN (NEW) ◄─┐ ONBOARDING    │
└────────┬────────────────┴────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│                    DASHBOARD (HUB)                       │
│  XP │ Água │ Desafios │ Plano │ Relatórios │ Histórico │
└─┬─────┬──────┬────────┬──────┬──────────┬───────────────┘
  │     │      │        │      │          │
  ▼     ▼      ▼        ▼      ▼          ▼
 XP  HYDRAT. CHALLEN.  PLAN  REPORT    HISTORY
(NEW) (NEW)   (NEW)    (NEW)  (NEW)     (NEW)
  │     │      │        │      │          │
  └─────┴──────┴────────┴──────┴──────────┘
         │
┌────────┴──────────────────────────────────────────┐
│        NAVEGAÇÃO INFERIOR (BottomNav)             │
├──────────────────────────────────────────────────┤
│ Home  │ Workouts  │ Nutrition  │ Progress │ More │
│       │   (NEW)   │   (NEW)    │ (NEW)    │      │
└───────┴───────────┴────────────┴──────────┴──────┘
         │
  ┌──────┴──────────────────┬──────────────┐
  ▼                         ▼              ▼
TREINOS (Videos NEW)    NUTRIÇÃO        PROGRESSO
  │                    (Calculadora)      (Fotos)
  │                    (Recipes NEW)        │
  ▼                         ▼              ▼
[Details]              [Scanning]      [Comparação]
  │                                        │
  └────────────────────┬───────────────────┘
                       ▼
              ACHIEVEMENTS / PROFILE
                       │
                       ▼
              SHARING (Redes Sociais NEW)
```

---

## 🔗 ROTAS RÁPIDAS

| Funcionalidade | Rota | Status |
|---|---|---|
| Dashboard | `/dashboard` | ✅ |
| Histórico | `/history` | ✅ NEW |
| Relatórios | `/reports` | ✅ NEW |
| Desafios | `/challenges` | ✅ NEW |
| Vídeos | `/videos` | ✅ NEW |
| Receitas | `/recipes` | ✅ NEW |
| Calculadora | `/calorie-calculator` | ✅ NEW |
| Hidratação | `/hydration` | ✅ NEW |
| Quiz Biologia | `/quiz/biology` | ✅ NEW |
| Plano Pessoal | `/personal-plan` | ✅ NEW |
| Análise Biologia | `/biology-insights` | ✅ NEW |
| Compartilhamento | `/sharing` | ✅ NEW |
| Treinos | `/workouts` | ✅ |
| Nutrição | `/nutrition` | ✅ |
| Progresso | `/progress` | ✅ |
| Achievements | `/achievements` | ✅ |
| Profile | `/profile` | ✅ |
| Settings | `/settings` | ✅ |
| Autenticação | `/login`, `/register` | ✅ |

---

## 💡 DICAS DE USO

1. **Para ver tudo funcionar**: Crie uma conta → Complete o quiz → Explore todas as rotas
2. **Primeiros passos**: Dashboard → Ver Desafios → Fazer um treino → Ver Histórico
3. **Melhor experiência**: Use a navegação inferior (BottomNav) para navegar entre abas
4. **Dados salvos**: Tudo é salvo em localStorage automaticamente

---

## 🚀 PRONTO PARA PUBLICAR!

Seu LevFit Pro agora tem 24+ funcionalidades completas. Clique em "Publish" no canto superior direito para colocar em produção!
