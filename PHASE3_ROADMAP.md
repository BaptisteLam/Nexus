# Phase 3 Roadmap - WebSocket & Real-Time Features

## 🎯 Objectifs Phase 3

Transformer Nexus en une véritable plateforme temps réel avec:
- Streaming vidéo de l'écran (WebRTC)
- Communication bidirectionnelle (WebSocket)
- Electron companion app pour contrôle desktop natif

## 📋 Tasks à Implémenter

### 1. WebSocket Server Setup

#### Backend WebSocket
```bash
npm install socket.io
```

**Créer:** `lib/websocket/server.ts`
```typescript
import { Server } from 'socket.io';

export function initWebSocket(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('execute-action', async (data) => {
      // Exécuter action et broadcaster résultat
      const result = await executeAction(data);
      socket.emit('action-result', result);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
```

#### Frontend WebSocket Client
**Créer:** `hooks/useWebSocket.ts`
```typescript
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');

    socketInstance.on('connect', () => {
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, connected };
}
```

### 2. WebRTC Screen Streaming

#### Concepts
- **Serveur:** Mediasoup ou simple-peer pour signaling
- **Client:** getUserMedia + RTCPeerConnection
- **Latence:** < 100ms pour UX fluide

#### Installation
```bash
npm install simple-peer mediasoup-client
```

#### Implémentation Serveur
**Créer:** `lib/webrtc/server.ts`
```typescript
import mediasoup from 'mediasoup';

export async function createWebRTCServer() {
  const worker = await mediasoup.createWorker();
  const router = await worker.createRouter({
    mediaCodecs: [
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
      },
    ],
  });

  return { worker, router };
}
```

#### Implémentation Client
**Créer:** `hooks/useScreenStream.ts`
```typescript
import { useEffect, useState } from 'react';
import Peer from 'simple-peer';

export function useScreenStream(socket: Socket | null) {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Demander le stream depuis l'Electron app
    socket.emit('request-screen-stream');

    socket.on('screen-stream-offer', (offer) => {
      const peer = new Peer({ initiator: false });

      peer.on('signal', (answer) => {
        socket.emit('screen-stream-answer', answer);
      });

      peer.on('stream', (remoteStream) => {
        setStream(remoteStream);
      });

      peer.signal(offer);
    });

    return () => {
      socket.off('screen-stream-offer');
    };
  }, [socket]);

  return stream;
}
```

### 3. Electron Companion App

#### Structure
```
electron-app/
├── main.js              # Process principal
├── preload.js           # Bridge sécurisé
├── desktop-control.js   # PyAutoGUI wrapper
└── screen-capture.js    # Screenshot + streaming
```

#### Exemple main.js
```javascript
const { app, BrowserWindow } = require('electron');
const io = require('socket.io-client');
const robot = require('robotjs');

let socket;

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL('http://localhost:3000/dashboard');
}

app.whenReady().then(() => {
  createWindow();

  // Connecter au serveur WebSocket
  socket = io('ws://localhost:3001');

  socket.on('desktop-action', async (action) => {
    switch (action.type) {
      case 'click':
        robot.moveMouse(action.payload.x, action.payload.y);
        robot.mouseClick();
        socket.emit('action-completed', { id: action.id });
        break;

      case 'type':
        robot.typeString(action.payload.text);
        socket.emit('action-completed', { id: action.id });
        break;

      case 'screenshot':
        const screenshot = robot.screen.capture();
        const img = screenshot.image;
        socket.emit('screenshot-data', {
          id: action.id,
          data: img.toString('base64'),
          width: screenshot.width,
          height: screenshot.height,
        });
        break;
    }
  });
});
```

### 4. Mise à Jour ScreenPreview

**Modifier:** `components/ScreenPreview.tsx`
```typescript
"use client";

import { useWebSocket } from "@/hooks/useWebSocket";
import { useScreenStream } from "@/hooks/useScreenStream";
import { useRef, useEffect } from "react";

export default function ScreenPreview({ currentHighlight }: Props) {
  const { socket, connected } = useWebSocket();
  const stream = useScreenStream(socket);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative h-full bg-neutral-50">
      {connected ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Connexion à l'agent desktop...</p>
        </div>
      )}

      {/* Highlight overlay */}
      {currentHighlight && (
        <div
          className="absolute w-12 h-12 border-4 border-red-500 rounded-full animate-ping"
          style={{
            left: currentHighlight.x - 24,
            top: currentHighlight.y - 24,
          }}
        />
      )}
    </div>
  );
}
```

### 5. Sécurité & Authentification

#### JWT pour Sessions
```bash
npm install jsonwebtoken bcryptjs
```

**Créer:** `lib/auth/jwt.ts`
```typescript
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-secret';

export function createToken(userId: string) {
  return jwt.sign({ userId }, SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
```

#### Middleware Protection
**Créer:** `middleware.ts` (root)
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    const valid = verifyToken(token);
    if (!valid) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

### 6. Isolation & Permissions

#### Sandbox pour Actions
**Créer:** `lib/sandbox/permissions.ts`
```typescript
export enum Permission {
  SCREENSHOT = 'screenshot',
  CLICK = 'click',
  TYPE = 'type',
  FILE_READ = 'file_read',
  FILE_WRITE = 'file_write',
  EXECUTE = 'execute',
}

export class PermissionManager {
  private granted = new Set<Permission>();

  request(permission: Permission): Promise<boolean> {
    // Demander confirmation utilisateur
    return new Promise((resolve) => {
      // UI modal pour accepter/refuser
      const accept = window.confirm(`Autoriser ${permission}?`);
      if (accept) {
        this.granted.add(permission);
      }
      resolve(accept);
    });
  }

  has(permission: Permission): boolean {
    return this.granted.has(permission);
  }

  revoke(permission: Permission) {
    this.granted.delete(permission);
  }
}
```

## 📊 Architecture Phase 3

```
┌─────────────┐
│   Browser   │ ← User interacts
└──────┬──────┘
       │ WebSocket
       ↓
┌─────────────┐
│ Next.js WS  │ ← Signaling server
│   Server    │
└──────┬──────┘
       │ WebRTC (screen stream)
       │ WebSocket (commands)
       ↓
┌─────────────┐
│   Electron  │ ← Desktop control
│ Companion   │   (robotjs/PyAutoGUI)
└─────────────┘
```

## ✅ Checklist Phase 3

- [ ] Installer dependencies (socket.io, simple-peer, etc.)
- [ ] Créer WebSocket server
- [ ] Implémenter hooks useWebSocket & useScreenStream
- [ ] Créer Electron companion app basic
- [ ] Intégrer robotjs pour contrôle réel
- [ ] Mettre à jour ScreenPreview avec vidéo live
- [ ] Ajouter authentification JWT
- [ ] Implémenter système de permissions
- [ ] Tester latence streaming (< 100ms)
- [ ] Documenter setup Electron

## 🔧 Outils Recommandés

1. **Screen Capture:**
   - Electron: `desktopCapturer`
   - Node: `screenshot-desktop`
   - Alternative: `node-screen-capture`

2. **Desktop Control:**
   - Cross-platform: `robotjs`
   - Python: PyAutoGUI (via child_process)
   - Windows: `node-windows-automation`

3. **WebRTC:**
   - Simple: `simple-peer`
   - Avancé: `mediasoup`
   - Signaling: Socket.io

## 📚 Ressources

- [Electron Docs](https://www.electronjs.org/docs)
- [Socket.io Guide](https://socket.io/docs/v4/)
- [WebRTC Tutorial](https://webrtc.org/getting-started/overview)
- [Mediasoup Docs](https://mediasoup.org/documentation/)

## 🚀 Timeline Estimée

- **Week 1:** WebSocket setup + basic Electron app
- **Week 2:** Screen streaming (WebRTC)
- **Week 3:** Desktop control integration (robotjs)
- **Week 4:** Security, permissions, testing

**Total:** ~1 mois pour Phase 3 complète
