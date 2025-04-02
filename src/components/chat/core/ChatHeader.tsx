import React from 'react';
import { useChatStore } from '../../../utils/chatStore';

interface ChatHeaderProps {
  title?: string;
  isAmplifyMember?: boolean;
  className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = 'Chat with Us',
  isAmplifyMember = false,
  className = '',
}) => {
  // Use selector pattern for better performance
  const setOpen = useChatStore((state) => state.setOpen);

  return (
    <div className={`chat-header ${className}`}>
      <h2 className="chat-title">
        {isAmplifyMember ? 'Amplify Support' : title}
      </h2>
      <button
        className="close-button"
        onClick={() => setOpen(false)}
        aria-label="Close chat"
      >
        ×
      </button>
    </div>
  );
};
