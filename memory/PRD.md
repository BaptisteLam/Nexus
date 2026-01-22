# Nexus - AI Desktop Automation Platform

## Original Problem Statement
Refonte complète de la direction artistique et UI en gardant du noir et du blanc, utilisant shadcn avec le style new-york et lucide-react pour les icônes.

## User Choices
- Mode sombre/clair avec toggle
- Style moderne/épuré avec bordures légèrement arrondies (shadcn new-york)
- Migration vers React standard (depuis Next.js)
- Intégration Claude AI via Emergent LLM Key universelle

## Architecture

### Frontend (React)
- **Stack**: React 18, Tailwind CSS 3, shadcn/ui (new-york style)
- **Composants**: Dashboard, Header, ChatPanel, ScreenPreview, ActionLogs
- **Thème**: Dark/Light mode avec CSS variables

### Backend (FastAPI)
- **Stack**: FastAPI, Python 3.11, emergentintegrations
- **Endpoints**:
  - `GET /api/health` - Health check
  - `POST /api/desktop/screenshot` - Capture d'écran (simulé)
  - `POST /api/desktop/action` - Actions desktop (simulé)
  - `POST /api/ai/analyze` - Analyse IA avec Claude

### AI Integration
- **Provider**: Anthropic Claude via Emergent Universal Key
- **Model**: claude-sonnet-4-20250514
- **Usage**: Analyse d'écran et génération de commandes d'automatisation

## Core Features Implemented (v1.0)
- [x] Interface de chat avec IA
- [x] Toggle dark/light mode
- [x] Contrôle agent (démarrer/arrêter)
- [x] Aperçu de l'écran (simulation)
- [x] Journal d'actions en temps réel
- [x] Quick actions (ranger fichiers, ouvrir app, créer dossier)
- [x] Intégration Claude AI fonctionnelle

## Mocked APIs
- `/api/desktop/screenshot` - Retourne null (simulation)
- `/api/desktop/action` - Simule les actions sans contrôle réel

## What's Working
- Frontend React avec design shadcn noir/blanc ✅
- Backend FastAPI avec Claude AI ✅
- Toggle theme dark/light ✅
- Chat avec IA ✅
- Journal d'actions ✅

## Backlog / Future Features (P1/P2)
- P1: Capture d'écran réelle via WebSocket
- P1: Contrôle desktop réel (PyAutoGUI)
- P2: Historique des sessions
- P2: Export des workflows
- P2: Intégration avec apps desktop spécifiques

## Date
2026-01-22
