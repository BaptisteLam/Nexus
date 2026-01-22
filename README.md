# NEXUS

**La première plateforme web d'automatisation desktop basée sur l'IA**

Nexus transforme vos instructions en langage naturel en actions concrètes sur votre ordinateur. Au lieu de configurer des workflows complexes ou d'écrire du code, vous décrivez simplement votre besoin et notre IA comprend le contexte visuel de votre écran pour exécuter les tâches automatiquement.

![Nexus Interface](https://img.shields.io/badge/Status-Phase%201%20UI%2FUX-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-19.0-61dafb)

---

## 🎯 Vision

Inspiré par les technologies de pointe comme Claude Computer Use d'Anthropic, OpenAI Operator, et les agents autonomes de nouvelle génération, Nexus démocratise l'automatisation desktop en la rendant accessible à tous via une interface web élégante et intuitive.

## ✨ Fonctionnalités (Phase 1 - UI/UX)

### Interface Actuelle
- **Dashboard Split-Screen** : Interface minimaliste en noir et blanc
- **Panneau de Chat** : Commandes en langage naturel avec suggestions rapides
- **Aperçu d'Écran en Direct** : Visualisation en temps réel avec zoom/pan
- **Journal d'Actions** : Suivi détaillé de toutes les opérations IA
- **Contrôles de Session** : Démarrage/arrêt de l'agent, réinitialisation

### Design System
- **Thème** : Monochrome sobre (noir/blanc/gris)
- **Typographie** : Times New Roman en gras pour les éléments clés
- **Layout** : Split 1/3 (chat) - 2/3 (preview + logs)
- **Interactions** : Animations fluides, feedback en temps réel

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

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

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
│   ├── layout.tsx          # Layout principal de l'application
│   ├── page.tsx            # Page d'accueil (Dashboard)
│   └── globals.css         # Styles globaux
├── components/
│   ├── Dashboard.tsx       # Composant principal avec logique d'état
│   ├── Header.tsx          # Barre supérieure avec contrôles
│   ├── ChatPanel.tsx       # Interface de commande par chat
│   ├── ScreenPreview.tsx   # Aperçu d'écran avec highlights IA
│   └── ActionLogs.tsx      # Journal des actions exécutées
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

### Phase 1 - UI/UX ✅ (Actuelle)
- [x] Design system complet
- [x] Interface dashboard responsive
- [x] Composants interactifs avec mock data
- [x] Animations et transitions

### Phase 2 - Backend & Intégration (À venir)
- [ ] API Claude pour analyse d'écran
- [ ] WebRTC streaming pour aperçu réel
- [ ] PyAutoGUI/RobotJS pour contrôle desktop
- [ ] LangChain pour orchestration d'agent

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
- **Déploiement** : Vercel, AWS
- **Conteneurisation** : Docker
- **Queue** : RabbitMQ (pour multi-users)

## 🤝 Contribution

Ce projet est actuellement en développement actif. Les contributions seront les bienvenues une fois la phase backend stabilisée.

## 📄 Licence

Propriétaire - Tous droits réservés

## 📧 Contact

Pour toute question ou suggestion : [contact@nexus.ai](mailto:contact@nexus.ai)

---

**Nexus** - Transformez vos mots en actions automatiques.
