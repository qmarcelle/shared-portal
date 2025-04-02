import React from 'react';
import { useChatStore } from '../../../utils/chatStore';

interface ChatButtonProps {
  label?: string;
  className?: string;
}

export const ChatButton: React.FC<ChatButtonProps> = ({
  label = 'Chat with Us',
  className = '',
}) => {
  // Use selector pattern for better performance
  const setOpen = useChatStore((state) => state.setOpen);

  return (
    <button
      className={`bcbst-button bcbst-button-primary ${className}`}
      onClick={() => setOpen(true)}
      aria-label={label}
    >
      {label}
    </button>
  );
};
