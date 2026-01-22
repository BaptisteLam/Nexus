# 🚀 Quickstart Guide - Nexus AI Desktop Automation

Get Nexus running in 5 minutes!

## ⚡ Fast Setup

### 1. Clone & Install

```bash
git clone https://github.com/BaptisteLam/Nexus.git
cd Nexus
npm install
```

### 2. Choose Your Mode

#### Option A: Simple Mode (No WebSocket)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

#### Option B: Full Mode (With WebSocket)

```bash
npm run dev:all
```

This starts:
- Next.js app on [http://localhost:3000](http://localhost:3000)
- WebSocket server on `ws://localhost:3001`

### 3. Start Using

1. Go to `/dashboard`
2. Click **"DÉMARRER"** to activate the agent
3. Type a command: `"Range mes fichiers du bureau"`
4. Watch the AI execute actions in real-time!

## 🔑 Optional: Add Claude API

For real AI analysis (optional, works without it):

```bash
# Copy example env
cp .env.example .env.local

# Edit .env.local and add your key
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key at: https://console.anthropic.com/

## 📱 Features to Try

### In the Dashboard

**Quick Commands:**
- "Range mes fichiers du bureau par type"
- "Ouvre Chrome et va sur gmail.com"
- "Crée un dossier 'Projets 2026' sur le bureau"

**Watch For:**
- ✅ Real-time action logs
- ✅ Red highlights on screen preview
- ✅ Timestamps for every action
- ✅ AI reasoning explanations

## 🛠️ Available Scripts

```bash
npm run dev        # Next.js only
npm run dev:ws     # WebSocket server only
npm run dev:all    # Both together (recommended)
npm run build      # Production build
npm run start      # Production server
```

## 🚨 Troubleshooting

### Port Already in Use?

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### WebSocket Not Connecting?

```bash
# Check if server is running
curl http://localhost:3001

# Restart WebSocket server
npm run dev:ws
```

### Build Errors?

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

## 📦 Deploy to Production

### Netlify (1-click)

1. Push to GitHub
2. Connect repo on Netlify
3. Auto-deploys! ✅

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Cloudflare Pages

1. Connect repo on Cloudflare dashboard
2. Auto-detects Next.js
3. Deploy! ✅

See `DEPLOYMENT.md` for detailed guides.

## 🎯 Next Steps

1. **Read the docs**: Check `README.md` for full features
2. **Try commands**: Experiment with natural language
3. **Check logs**: See how AI interprets your commands
4. **Add API key**: Unlock real Claude AI analysis
5. **Deploy**: Put it online on Netlify/Vercel/Cloudflare

## 💡 Pro Tips

- **No API Key?** Demo mode works perfectly with mock responses
- **Development**: Use `npm run dev:all` for full experience
- **Production**: All platforms auto-detect Next.js config
- **Custom commands**: Just type naturally in French
- **Logs**: Watch the Action Logs panel for debugging

## 🐛 Issues?

- Check `DEPLOYMENT.md` for deployment issues
- See `CHANGELOG.md` for version changes
- Open an issue on GitHub: https://github.com/BaptisteLam/Nexus/issues

## 📚 Documentation

- `README.md` - Complete documentation
- `DEPLOYMENT.md` - Deployment guides
- `PHASE3_ROADMAP.md` - Future features
- `CHANGELOG.md` - Version history

---

**You're ready to go! 🎉**

Run `npm run dev:all` and open http://localhost:3000/dashboard

Happy automating! 🤖
