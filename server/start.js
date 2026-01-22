#!/usr/bin/env node

const http = require('http');
const { Server } = require('socket.io');

const port = process.env.WS_PORT || 3001;

// Create HTTP server
const httpServer = http.createServer();

// Create Socket.io server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log(`✓ Client connected: ${socket.id}`);
  connectedClients.set(socket.id, socket);

  // Handle messages
  socket.on('message', (data) => {
    console.log('→ Received message:', data);
    socket.emit('message', {
      type: 'echo',
      data: data,
      timestamp: Date.now(),
    });
  });

  // Handle action execution
  socket.on('execute-action', async (data) => {
    console.log('→ Execute action:', data.type);

    // Simulate action execution
    setTimeout(() => {
      socket.emit('action-result', {
        success: true,
        action: data.type,
        payload: data.payload,
        timestamp: Date.now(),
      });
    }, 500);
  });

  // Handle screenshot requests
  socket.on('request-screenshot', () => {
    console.log('→ Screenshot requested');
    socket.emit('screenshot-data', {
      data: 'mock-screenshot-base64-data',
      width: 1920,
      height: 1080,
      timestamp: Date.now(),
    });
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`✗ Client disconnected: ${socket.id} (${reason})`);
    connectedClients.delete(socket.id);
  });

  // Send welcome message
  socket.emit('message', {
    type: 'welcome',
    data: { message: 'Connected to Nexus WebSocket server' },
    timestamp: Date.now(),
  });
});

// Start server
httpServer.listen(port, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║   Nexus WebSocket Server                  ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log('');
  console.log(`  Server running on port: ${port}`);
  console.log(`  Listening at: ws://localhost:${port}`);
  console.log('');
  console.log('  Press Ctrl+C to stop');
  console.log('');
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\nShutting down WebSocket server...');
  io.close();
  httpServer.close();
  process.exit(0);
});
