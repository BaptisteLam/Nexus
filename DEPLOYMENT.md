# Deployment Guide - Nexus

## 📦 Netlify Deployment

### Configuration

Le projet inclut un fichier `netlify.toml` pré-configuré:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

### Déploiement depuis GitHub

1. **Connecter le repository**
   - Allez sur [app.netlify.com](https://app.netlify.com)
   - "Add new site" → "Import an existing project"
   - Sélectionnez votre repository GitHub

2. **Configuration automatique**
   - Netlify détectera automatiquement Next.js
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Variables d'environnement** (optionnel)
   - Site settings → Environment variables
   - Ajouter `ANTHROPIC_API_KEY` pour activer l'IA Claude
   - Sans cette variable, l'app fonctionne en mode démo

4. **Déployer**
   - Cliquez "Deploy site"
   - Netlify installera les dépendances et déploiera

### Problèmes Courants

#### Erreur 404

**Symptôme:** La page affiche "404 Not Found"

**Solutions:**
1. Vérifier que le build s'est terminé avec succès
2. Vérifier la configuration du publish directory (`.next`)
3. S'assurer que le plugin Next.js est installé:
   ```bash
   npm install --save-dev @netlify/plugin-nextjs
   ```
4. Redéployer le site

#### Build Fails

**Symptôme:** Le build échoue sur Netlify

**Solutions:**
1. Vérifier Node version (doit être 20+):
   ```toml
   [build.environment]
     NODE_VERSION = "20"
   ```
2. Vérifier les logs de build pour erreurs TypeScript
3. Tester localement:
   ```bash
   npm run build
   ```

#### Routes API ne fonctionnent pas

**Symptôme:** Les endpoints `/api/*` retournent 404

**Solutions:**
1. S'assurer que le plugin Next.js est configuré
2. Vérifier que les fichiers `route.ts` sont bien dans `app/api/`
3. Redéployer après modification

## 🚀 Vercel Deployment (Alternative)

Vercel est la plateforme recommandée pour Next.js.

### Déploiement sur Vercel

1. **Via CLI:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Via Dashboard:**
   - Allez sur [vercel.com](https://vercel.com)
   - "Add New Project"
   - Importez votre repository GitHub
   - Déployez (configuration automatique)

### Variables d'Environnement

Dans le dashboard Vercel:
- Settings → Environment Variables
- Ajouter `ANTHROPIC_API_KEY` (optionnel)

## 🐳 Docker Deployment (Production)

### Dockerfile (à créer)

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  nexus:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    restart: unless-stopped
```

### Commandes

```bash
# Build
docker build -t nexus .

# Run
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=your_key nexus

# Ou avec docker-compose
docker-compose up -d
```

## 🔐 Sécurité en Production

### Variables Sensibles

**JAMAIS** commiter:
- `.env.local`
- Clés API
- Secrets

**Toujours** utiliser:
- Variables d'environnement Netlify/Vercel
- Secrets managers pour production

### Headers de Sécurité

Ajouter dans `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

## 📊 Monitoring

### Recommandations

1. **Netlify Analytics** (built-in)
2. **Vercel Analytics** (si déployé sur Vercel)
3. **Sentry** pour error tracking
4. **LogRocket** pour session replay

### Configuration Sentry (exemple)

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## 🔄 CI/CD

### GitHub Actions (exemple)

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './.next'
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## ✅ Checklist Pre-Deploy

- [ ] Tests passent: `npm test` (si applicable)
- [ ] Build local réussit: `npm run build`
- [ ] Variables d'env configurées
- [ ] `.env.local` non commité
- [ ] Documentation à jour
- [ ] README inclut lien vers démo live

## 🆘 Support

**Problème Netlify?**
- [Documentation Netlify Next.js](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Support Netlify](https://www.netlify.com/support/)

**Problème Vercel?**
- [Documentation Vercel](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
