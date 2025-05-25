
import React, { useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  avatar?: string;
  senderName?: string;
}

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
  currentUser?: string;
}

/**
 * Lista de mensagens com scroll automático e animações suaves
 * Suporte para indicador de digitação e formatação de texto
 */
export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isTyping = false,
  currentUser = 'Você'
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  }, [messages, isTyping]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatMessageText = (text: string) => {
    // Suporte básico para formatação: **negrito** e *itálico*
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth"
      style={{ scrollbarWidth: 'thin' }}
    >
      {messages.map((message, index) => {
        const isUserMessage = message.sender === 'user';
        const showAvatar = !isUserMessage && (index === 0 || messages[index - 1]?.sender !== message.sender);
        
        return (
          <div
            key={message.id}
            className={`flex items-end space-x-2 animate-fade-in ${
              isUserMessage ? 'justify-end' : 'justify-start'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Avatar para mensagens recebidas */}
            {!isUserMessage && (
              <div className="flex-shrink-0">
                {showAvatar ? (
                  <img
                    src={message.avatar || `https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=32&h=32&fit=crop&crop=face`}
                    alt={`Avatar de ${message.senderName || 'Usuário'}`}
                    className="w-8 h-8 rounded-full border border-chat-border"
                  />
                ) : (
                  <div className="w-8 h-8" />
                )}
              </div>
            )}

            {/* Mensagem */}
            <div className={`max-w-xs lg:max-w-md ${isUserMessage ? 'order-first' : ''}`}>
              {/* Nome do remetente (apenas para mensagens recebidas e quando muda) */}
              {!isUserMessage && showAvatar && (
                <p className="text-xs text-chat-text-light mb-1 px-2">
                  {message.senderName || 'Usuário'}
                </p>
              )}
              
              {/* Bolha da mensagem */}
              <div
                className={`message-bubble ${
                  isUserMessage ? 'message-bubble-sent' : 'message-bubble-received'
                } hover:shadow-message transition-shadow duration-200`}
              >
                <p 
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMessageText(message.text) 
                  }}
                />
                
                {/* Timestamp */}
                <p className={`text-xs mt-1 ${
                  isUserMessage ? 'text-white/70' : 'text-chat-text-light'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Indicador de digitação */}
      {isTyping && (
        <div className="flex items-end space-x-2 justify-start animate-fade-in">
          <div className="flex-shrink-0">
            <img
              src={`https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=32&h=32&fit=crop&crop=face`}
              alt="Digitando..."
              className="w-8 h-8 rounded-full border border-chat-border"
            />
          </div>
          
          <div className="message-bubble message-bubble-received">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        </div>
      )}

      {/* Referência para scroll automático */}
      <div ref={messagesEndRef} />
    </div>
  );
};
