# Changelog

All notable changes to Nexus AI Desktop Automation will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-22

### 🔒 Security

- **CRITICAL**: Fixed Next.js CVE-2025-55182 vulnerability
- Upgraded Next.js from 15.1.4 to 16.1.4 (secure version)
- Upgraded React from 19.0.0 to 19.2.3
- Zero vulnerabilities confirmed via npm audit
- Added security headers to all deployment configs

### ✨ Added

#### Phase 3 - WebSocket & Real-Time Communication
- Standalone WebSocket server using Socket.io 4.8.3
- `useWebSocket` custom React hook for client integration
- Real-time bidirectional communication client-server
- Event handling system for actions, screenshots, streams
- Automatic reconnection with exponential backoff
- Connection management and status tracking
- Multi-server development environment

#### Multi-Platform Deployment Support
- Netlify configuration (netlify.toml) with security headers
- Vercel configuration (vercel.json) with optimal settings
- Cloudflare Pages configuration (wrangler.toml)
- All three platforms tested and deployment-ready

#### Development Scripts
- `npm run dev:ws` - Start WebSocket server only
- `npm run dev:all` - Start Next.js + WebSocket concurrently
- `npm run start:ws` - Production WebSocket server
- Concurrently package for parallel development

#### Documentation
- Multi-platform deployment guide in README
- WebSocket setup and usage instructions
- Environment variables documentation updated
- Deployment configurations for all platforms

### 🔄 Changed

- Version bumped from 0.1.0 to 0.2.0
- README badges updated to reflect Phase 3 status
- Enhanced .env.example with WebSocket configuration
- Improved netlify.toml with security headers
- Updated tsconfig.json for new types

### 🛠️ Technical

- Next.js 16.1.4 with Turbopack
- React 19.2.3
- Socket.io 4.8.3 (client and server)
- Concurrently 9.2.1 for dev scripts
- Build time optimized (< 4 seconds)
- Zero TypeScript errors
- All tests passing

### 📦 Dependencies

**Added:**
- concurrently@9.2.1

**Updated:**
- next: 15.1.4 → 16.1.4
- react: 19.0.0 → 19.2.3
- react-dom: 19.0.0 → 19.2.3

### 🚀 Deployment

- **Netlify**: Ready ✅ (fixes 404 errors, security vulnerability blocked)
- **Vercel**: Ready ✅ (recommended for Next.js)
- **Cloudflare Pages**: Ready ✅ (global CDN)
- Build verified on all platforms

### 📝 Notes

- No breaking changes
- Backward compatible with Phase 2
- WebSocket is optional (app works without it)
- Simple upgrade: `npm install` and deploy

---

## [0.1.0] - 2026-01-21

### ✨ Initial Release

#### Phase 1 - UI/UX
- Minimal editorial homepage
- Dashboard split-screen interface
- shadcn/ui integration (new-york style)
- Chat panel with natural language input
- Screen preview with highlights
- Action logs with timestamps
- Black/white monochrome theme
- Times New Roman typography

#### Phase 2 - Backend & API
- Claude API integration (@anthropic-ai/sdk)
- AI analysis service with mock fallback
- Desktop control service interface
- Custom hooks (useDesktopAutomation)
- API endpoints:
  - `/api/ai/analyze` - Screen analysis
  - `/api/desktop/action` - Desktop control
- Full TypeScript support

### 🛠️ Technical Stack

- Next.js 15.1.4
- React 19.0.0
- TypeScript 5
- Tailwind CSS 3.4.17
- shadcn/ui components
- Anthropic SDK 0.71.2
- Socket.io 4.8.3

### 📦 Features

- Natural language commands
- AI-powered screen analysis
- Mock mode (no API key required)
- Responsive design
- Professional UI/UX
- Complete documentation

---

## Legend

- ✨ Added: New features
- 🔄 Changed: Changes in existing functionality
- 🐛 Fixed: Bug fixes
- 🔒 Security: Security improvements
- 🗑️ Removed: Removed features
- 📝 Docs: Documentation changes
- 🛠️ Technical: Technical changes
- 📦 Dependencies: Dependency updates
