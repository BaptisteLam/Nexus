import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export function useWebSocket(url?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    // Use environment variable or fallback
    const wsUrl = url || process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

    const socketInstance = io(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: maxReconnectAttempts,
    });

    socketInstance.on('connect', () => {
      console.log('WebSocket connected:', socketInstance.id);
      setConnected(true);
      reconnectAttempts.current = 0;
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setConnected(false);
    });

    socketInstance.on('message', (message: WebSocketMessage) => {
      setLastMessage(message);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      reconnectAttempts.current++;

      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('Max reconnect attempts reached. Giving up.');
        socketInstance.disconnect();
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  const sendMessage = useCallback((type: string, data: any) => {
    if (socket && connected) {
      socket.emit('message', {
        type,
        data,
        timestamp: Date.now(),
      });
    } else {
      console.warn('Cannot send message: socket not connected');
    }
  }, [socket, connected]);

  const emit = useCallback((event: string, ...args: any[]) => {
    if (socket && connected) {
      socket.emit(event, ...args);
    }
  }, [socket, connected]);

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    if (socket) {
      socket.on(event, callback);

      return () => {
        socket.off(event, callback);
      };
    }
  }, [socket]);

  return {
    socket,
    connected,
    lastMessage,
    sendMessage,
    emit,
    on,
  };
}
