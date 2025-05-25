import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  avatar?: string;
  senderName?: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

/**
 * Hook personalizado para gerenciar estado do chat
 * Inclui mensagens, usuários e funcionalidades de WebSocket
 */
export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [currentUser] = useState<User>({
    id: 'USER',
    name: 'Você',
    avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=40&h=40&fit=crop&crop=face',
    status: 'online',
  });

  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');

  const wsRef = useRef<WebSocket | null>(null);
  const { id: userId } = currentUser;

  // Função para conectar WebSocket
  function connectWebSocket() {
    setConnectionStatus('connecting');
    const ws = new WebSocket(`ws://localhost:8000/chat/ws/${userId}`);

    ws.onopen = () => {
      console.log('✅ Conectado ao WebSocket! 👾');
      setConnectionStatus('connected');
    };

    ws.onmessage = event => {
      const data = JSON.parse(event.data);
      const newMsg: Message = {
        id: Date.now().toString(),
        text: data.message,
        sender: data.user === userId ? 'user' : 'other',
        timestamp: new Date(),
        senderName: data.user,
        avatar:
          data.user === userId
            ? undefined
            : 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=40&h=40&fit=crop&crop=face',
      };
      setMessages(prev => [...prev, newMsg]);
      setIsTyping(false);
    };

    ws.onerror = err => {
      console.error('❌ Erro no WebSocket:', err);
    };

    ws.onclose = ev => {
      console.log('🔒 Conexão WebSocket fechada', ev.reason);
      setConnectionStatus('disconnected');
      wsRef.current = null;
    };

    wsRef.current = ws;
  }

  // Função para desconectar WebSocket
  function disconnectWebSocket() {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      console.log('🔴 WebSocket desconectado');
    }
    setConnectionStatus('disconnected');
  }

  // Função para enviar mensagem
  function sendMessage(text: string) {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const payload = { user: userId, message: text };
      console.log('📤 Enviando mensagem:', payload);
      wsRef.current.send(JSON.stringify(payload));
      setIsTyping(true);

    } else {
      console.warn('⚠️ WebSocket não está conectado!');
    }
  }

  // Conectar ao montar
  useEffect(() => {
    connectWebSocket();
    return () => disconnectWebSocket();
  }, []);

  return {
    messages,
    currentUser,
    isTyping,
    connectionStatus,
    sendMessage,
    connectWebSocket,
    disconnectWebSocket,
  };
};
