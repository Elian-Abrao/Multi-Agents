
import React, { useRef, useState } from 'react';
import { ChatHeader } from '@/components/ChatHeader';
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';
import { ScrollToBottom } from '@/components/ScrollToBottom';
import { useChat } from '@/hooks/useChat';

/**
 * Página principal do chat redesenhada
 * Interface moderna com microinterações e design responsivo
 */
const Index = () => {
  const { 
    messages, 
    currentUser, 
    isTyping, 
    connectionStatus, 
    sendMessage 
  } = useChat();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleSettingsClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto bg-white shadow-2xl">
        {/* Header */}
        <ChatHeader
          user={currentUser}
          onSettingsClick={handleSettingsClick}
          unreadCount={0}
        />

        {/* Connection Status Indicator */}
        {connectionStatus !== 'connected' && (
          <div className={`px-6 py-2 text-sm text-center ${
            connectionStatus === 'connecting' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-red-100 text-red-800'
          } animate-slide-down`}>
            {connectionStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}
          </div>
        )}

        {/* Messages Container */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 relative bg-gradient-to-b from-white to-gray-50"
        >
          <MessageList
            messages={messages}
            isTyping={isTyping}
            currentUser={currentUser.name}
          />
          
          {/* Scroll to Bottom Button */}
          <ScrollToBottom containerRef={messagesContainerRef} />
        </div>

        {/* Message Input */}
        <MessageInput
          onSendMessage={sendMessage}
          disabled={connectionStatus !== 'connected'}
          placeholder={
            connectionStatus === 'connected' 
              ? "Digite sua mensagem..." 
              : "Aguardando conexão..."
          }
        />
      </div>

      {/* Settings Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        >
          <div 
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-float animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-chat-text mb-4">
                Configurações
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-medium text-chat-text mb-2">Status</h3>
                  <p className="text-sm text-chat-text-light">
                    {connectionStatus === 'connected' ? 'Conectado' : 'Desconectado'}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-medium text-chat-text mb-2">Mensagens</h3>
                  <p className="text-sm text-chat-text-light">
                    {messages.length} mensagens na conversa
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
