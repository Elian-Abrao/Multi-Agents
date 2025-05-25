
import React, { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Input de mensagem com suporte a multi-linha e atalhos de teclado
 * Inclui validação e feedback visual
 */
export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Digite sua mensagem..."
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="border-t border-chat-border bg-chat-surface px-6 py-4">
      <div 
        className={`flex items-end space-x-3 p-3 rounded-2xl border transition-all duration-200 ${
          isFocused 
            ? 'border-chat-primary shadow-chat bg-white' 
            : 'border-chat-border bg-gray-50'
        }`}
      >
        {/* Textarea */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full resize-none bg-transparent border-none outline-none placeholder-chat-text-light text-chat-text text-sm leading-relaxed min-h-[24px] max-h-[120px]"
            style={{ scrollbarWidth: 'thin' }}
            aria-label="Campo de mensagem"
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || disabled}
          size="sm"
          className="bg-gradient-to-r from-chat-primary to-chat-secondary hover:from-chat-primary/90 hover:to-chat-secondary/90 text-white border-none rounded-xl px-4 py-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Enviar mensagem"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
            />
          </svg>
        </Button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-chat-text-light mt-2 px-3">
        Pressione Enter para enviar, Shift+Enter para nova linha
      </p>
    </div>
  );
};
