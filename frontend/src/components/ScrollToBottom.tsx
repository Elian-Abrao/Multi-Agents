
import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

interface ScrollToBottomProps {
  containerRef: React.RefObject<HTMLDivElement>;
  threshold?: number;
}

/**
 * Botão flutuante para scroll automático até o final da conversa
 * Aparece automaticamente quando o usuário rola para cima
 */
export const ScrollToBottom: React.FC<ScrollToBottomProps> = ({ 
  containerRef, 
  threshold = 100 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setIsVisible(distanceFromBottom > threshold);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef, threshold]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToBottom}
      className="scroll-to-bottom animate-scale-in"
      aria-label="Ir para o final da conversa"
    >
      <ArrowDown className="w-5 h-5" />
    </button>
  );
};
