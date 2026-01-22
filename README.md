# NEXUS

**La première plateforme web d'automatisation desktop basée sur l'IA**

Nexus transforme vos instructions en langage naturel en actions concrètes sur votre ordinateur. Au lieu de configurer des workflows complexes ou d'écrire du code, vous décrivez simplement votre besoin et notre IA comprend le contexte visuel de votre écran pour exécuter les tâches automatiquement.

![Nexus Interface](https://img.shields.io/badge/Status-Phase%202%20Backend-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-19.0-61dafb)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-New%20York-black)
![Claude API](https://img.shields.io/badge/Claude-API%20Ready-purple)

---

## 🎯 Vision

Inspiré par les technologies de pointe comme Claude Computer Use d'Anthropic, OpenAI Operator, et les agents autonomes de nouvelle génération, Nexus démocratise l'automatisation desktop en la rendant accessible à tous via une interface web élégante et intuitive.

## ✨ Fonctionnalités

### Interface (Phase 1 ✅)
- **Homepage Minimaliste** : Page d'accueil éditoriale avec esthétique sobre
- **Dashboard Split-Screen** : Interface noir et blanc avec shadcn/ui (new-york style)
- **Panneau de Chat** : Commandes en langage naturel avec suggestions rapides
- **Aperçu d'Écran en Direct** : Visualisation en temps réel avec highlights rouges
- **Journal d'Actions** : Suivi détaillé avec timestamps précis (ScrollArea shadcn)
- **Contrôles de Session** : Démarrage/arrêt de l'agent, réinitialisation

### Backend & API (Phase 2 ✅)
- **API Claude Integration** : Analyse d'écran via Anthropic Claude API
- **Desktop Control API** : Endpoints pour click, type, move, commands
- **AI Service** : Service intelligent avec fallback mock pour démo
- **Desktop Service** : Interface pour automatisation (prêt pour Electron)
- **Custom Hooks** : `useDesktopAutomation` pour orchestration temps réel

### Design System
- **Framework UI** : shadcn/ui (new-york style) avec Radix UI
- **Thème** : Monochrome éditorial (noir #000000, blanc #FFFFFF)
- **Typographie** : Times New Roman serif bold, grandes tailles
- **Layout** : Split 1/3 (chat) - 2/3 (preview + logs)
- **Composants** : Button, Input, Textarea, Separator, ScrollArea

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 20+
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd Nexus

# Installer les dépendances
npm install

# Configuration (optionnel)
cp .env.example .env.local
# Ajouter votre ANTHROPIC_API_KEY dans .env.local

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Configuration de l'API Claude (Optionnel)

Pour activer l'analyse IA réelle avec Claude:

1. Obtenez une clé API sur [console.anthropic.com](https://console.anthropic.com/)
2. Créez un fichier `.env.local`:
   ```env
   ANTHROPIC_API_KEY=votre_clé_api_ici
   ```
3. Redémarrez le serveur

**Note** : Sans clé API, l'application fonctionne en mode démo avec des réponses simulées.

### Scripts Disponibles

```bash
npm run dev      # Démarrer en mode développement
npm run build    # Build de production
npm run start    # Lancer le serveur de production
npm run lint     # Vérifier le code
```

## 📁 Structure du Projet

```
Nexus/
├── app/
│   ├── api/                       # API Routes (Next.js)
│   │   ├── ai/
│   │   │   └── analyze/route.ts   # Endpoint analyse IA Claude
│   │   └── desktop/
│   │       └── action/route.ts    # Endpoint contrôle desktop
│   ├── dashboard/
│   │   └── page.tsx               # Page dashboard
│   ├── layout.tsx                 # Layout principal
│   ├── page.tsx                   # Homepage minimaliste
│   └── globals.css                # Styles globaux (editoriaux)
├── components/
│   ├── ui/                        # Composants shadcn/ui
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── scroll-area.tsx
│   │   └── separator.tsx
│   ├── Dashboard.tsx              # Composant principal
│   ├── Header.tsx                 # Barre supérieure
│   ├── ChatPanel.tsx              # Interface chat
│   ├── ScreenPreview.tsx          # Aperçu d'écran
│   └── ActionLogs.tsx             # Journal d'actions
├── lib/
│   ├── services/
│   │   ├── ai.service.ts          # Service Claude API
│   │   └── desktop.service.ts     # Service contrôle desktop
│   └── utils.ts                   # Utilitaires (cn, etc.)
├── hooks/
│   └── useDesktopAutomation.ts    # Hook orchestration IA
├── .env.example                    # Template variables env
├── .env.local                      # Config locale (non commité)
├── components.json                 # Config shadcn/ui
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🎨 Philosophie Design

### UX/UI Principles
1. **Minimalisme Fonctionnel** : Chaque élément a un but précis
2. **Clarté Visuelle** : Contraste élevé pour une lisibilité maximale
3. **Feedback Immédiat** : L'utilisateur sait toujours ce qui se passe
4. **Transparence** : Toutes les actions IA sont visibles et tracées

### Inspirations
- **Claude Computer Use** : Approche conversationnelle et analyse d'écran
- **OpenAI Operator** : Preview en temps réel des actions
- **Simular Agent S2** : Dashboard épuré et professionnel
- **Remote Desktop Tools** : Streaming vidéo optimisé

## 🔮 Roadmap

### Phase 1 - UI/UX ✅ (Complétée)
- [x] Design system avec shadcn/ui (new-york style)
- [x] Homepage minimaliste éditoriale
- [x] Interface dashboard responsive
- [x] Composants interactifs (Button, Input, ScrollArea, etc.)
- [x] Animations et transitions calmes
- [x] Typographie Times serif bold, grandes tailles

### Phase 2 - Backend & API ✅ (Actuelle)
- [x] API Claude pour analyse d'écran (avec fallback mock)
- [x] Endpoints Desktop Control (/api/desktop/action)
- [x] Service IA avec Anthropic SDK
- [x] Service Desktop (interface prête pour Electron)
- [x] Hook useDesktopAutomation pour orchestration
- [x] Intégration Dashboard ↔️ Backend APIs

### Phase 3 - WebSocket & Temps Réel (Prochaine)
- [ ] WebSocket serveur pour streaming
- [ ] WebRTC pour aperçu vidéo d'écran
- [ ] Mise à jour UI en temps réel
- [ ] Gestion des connexions multiples

### Phase 3 - Sécurité & Production
- [ ] Authentification JWT
- [ ] Isolation Docker
- [ ] Permissions granulaires
- [ ] Logs d'audit

### Phase 4 - Fonctionnalités Avancées
- [ ] Multi-utilisateurs
- [ ] Workflows sauvegardés
- [ ] Modèles locaux (LLaVA, Moondream)
- [ ] Extensions & plugins

## 🛠 Stack Technique

### Frontend
- **Framework** : Next.js 15 (App Router)
- **UI** : React 19 + TypeScript
- **Styling** : Tailwind CSS
- **Streaming** : WebRTC (à implémenter)

### Backend (Planifié)
- **Runtime** : Node.js / Python
- **IA** : Claude API, GPT-4o, Gemini
- **Automation** : PyAutoGUI, RobotJS
- **Orchestration** : LangChain, LlamaIndex

### Infrastructure
- **Déploiement** : Vercel (frontend), Netlify compatible
- **Conteneurisation** : Docker (pour phase production)
- **Queue** : RabbitMQ (prévu pour multi-users)

## 🏗️ Architecture Backend

### API Endpoints

#### `/api/ai/analyze` (POST)
Analyse un screenshot avec Claude pour déterminer l'action à exécuter.

**Request:**
```json
{
  "screenshot": "base64_encoded_image",
  "userIntent": "Range mes fichiers par type"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "action": "organize_files",
    "command": "organize",
    "confidence": 85,
    "reasoning": "L'utilisateur veut organiser des fichiers..."
  },
  "isUsingAI": true
}
```

#### `/api/desktop/action` (POST)
Exécute une action desktop (simulated pour démo).

**Types d'actions:**
- `screenshot` : Capture d'écran
- `click` : Clic souris (x, y, button)
- `type` : Saisie de texte
- `move` : Déplacement souris
- `command` : Exécution de commande
- `file_operation` : Opération sur fichiers

**Exemple:**
```json
{
  "type": "click",
  "payload": { "x": 500, "y": 300, "button": "left" }
}
```

### Services

**AIService** (`lib/services/ai.service.ts`)
- Intégration Claude API via @anthropic-ai/sdk
- Analyse d'écran avec vision models
- Fallback mock intelligent pour démo sans API key

**DesktopService** (`lib/services/desktop.service.ts`)
- Interface pour contrôle desktop
- Simulation pour démo web
- Prêt pour intégration Electron native

### Flux d'Automatisation

1. **Utilisateur envoie commande** → ChatPanel
2. **Dashboard appelle hook** → useDesktopAutomation
3. **Capture screenshot** → /api/desktop/action (screenshot)
4. **Analyse IA** → /api/ai/analyze (Claude ou mock)
5. **Exécution actions** → /api/desktop/action (click/type/etc.)
6. **Mise à jour UI** → ActionLogs + ScreenPreview highlights

## 🤝 Contribution

Ce projet est actuellement en développement actif. Les contributions seront les bienvenues une fois la phase backend stabilisée.

## 📄 Licence

Propriétaire - Tous droits réservés

## 📧 Contact

Pour toute question ou suggestion : [contact@nexus.ai](mailto:contact@nexus.ai)

---

**Nexus** - Transformez vos mots en actions automatiques.
