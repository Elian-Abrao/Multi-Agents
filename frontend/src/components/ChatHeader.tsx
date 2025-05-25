
import React from 'react';
import { Bell, MessageSquare } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

interface ChatHeaderProps {
  user: User;
  onSettingsClick: () => void;
  unreadCount?: number;
}

/**
 * Header moderno do chat com avatar, status e notificações
 * Inclui animações suaves e design responsivo
 */
export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  user, 
  onSettingsClick, 
  unreadCount = 0 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-chat-success';
      case 'away': return 'bg-chat-warning';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Ausente';
      default: return 'Offline';
    }
  };

  return (
    <header className="bg-chat-surface border-b border-chat-border px-6 py-4 animate-slide-down">
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={user.avatar || `https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=40&h=40&fit=crop&crop=face`}
              alt={`Avatar de ${user.name}`}
              className="w-12 h-12 rounded-full border-2 border-white shadow-message hover:scale-105 transition-transform duration-200"
            />
            <div 
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user.status)}`}
              aria-label={`Status: ${getStatusText(user.status)}`}
            />
          </div>
          
          <div>
            <h1 className="text-lg font-semibold text-chat-text">
              {user.name}
            </h1>
            <p className="text-sm text-chat-text-light">
              {getStatusText(user.status)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5 text-chat-text-light" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-chat-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-in">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onSettingsClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Configurações"
          >
            <MessageSquare className="w-5 h-5 text-chat-text-light" />
          </button>
        </div>
      </div>
    </header>
  );
};
