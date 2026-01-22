import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

export interface WebSocketServerConfig {
  cors?: {
    origin: string | string[];
    methods: string[];
  };
}

export class WebSocketServer {
  private io: SocketIOServer;
  private connectedClients: Map<string, Socket> = new Map();

  constructor(httpServer: HTTPServer, config?: WebSocketServerConfig) {
    this.io = new SocketIOServer(httpServer, {
      cors: config?.cors || {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.connectedClients.set(socket.id, socket);

      // Handle messages
      socket.on('message', (data) => {
        console.log('Received message:', data);
        this.handleMessage(socket, data);
      });

      // Handle execute-action requests
      socket.on('execute-action', async (data) => {
        console.log('Execute action request:', data);
        await this.handleExecuteAction(socket, data);
      });

      // Handle screenshot requests
      socket.on('request-screenshot', () => {
        this.handleScreenshotRequest(socket);
      });

      // Handle screen stream requests
      socket.on('request-screen-stream', () => {
        this.handleScreenStreamRequest(socket);
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
        this.connectedClients.delete(socket.id);
      });

      // Send welcome message
      socket.emit('message', {
        type: 'welcome',
        data: { message: 'Connected to Nexus WebSocket server' },
        timestamp: Date.now(),
      });
    });
  }

  private handleMessage(socket: Socket, data: any) {
    // Echo message back to sender
    socket.emit('message', {
      type: 'echo',
      data: data,
      timestamp: Date.now(),
    });

    // Broadcast to other clients (optional)
    // socket.broadcast.emit('message', data);
  }

  private async handleExecuteAction(socket: Socket, data: any) {
    try {
      // In production, this would call desktop control APIs
      // For now, simulate action execution
      const result = {
        success: true,
        action: data.type,
        timestamp: Date.now(),
      };

      socket.emit('action-result', result);
    } catch (error: any) {
      socket.emit('action-error', {
        error: error.message,
        timestamp: Date.now(),
      });
    }
  }

  private handleScreenshotRequest(socket: Socket) {
    // In production, this would trigger screenshot capture
    // For demo, send mock screenshot data
    socket.emit('screenshot-data', {
      data: 'mock-screenshot-base64',
      width: 1920,
      height: 1080,
      timestamp: Date.now(),
    });
  }

  private handleScreenStreamRequest(socket: Socket) {
    // In production, this would initiate WebRTC stream
    // For demo, send mock stream offer
    socket.emit('screen-stream-offer', {
      message: 'WebRTC streaming not yet implemented',
      timestamp: Date.now(),
    });
  }

  public broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }

  public sendToClient(clientId: string, event: string, data: any) {
    const client = this.connectedClients.get(clientId);
    if (client) {
      client.emit(event, data);
    }
  }

  public getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  public close() {
    this.io.close();
  }
}

// Standalone server mode
if (require.main === module) {
  const http = require('http');
  const port = process.env.WS_PORT || 3001;

  const httpServer = http.createServer();
  const wsServer = new WebSocketServer(httpServer);

  httpServer.listen(port, () => {
    console.log(`WebSocket server running on port ${port}`);
  });
}
