import React from 'react';
import { useChatStore } from '../../../chat/providers';

export const ChatHeader: React.FC = () => {
  const closeChat = useChatStore((state) => state.closeChat);

  return (
    <div className="chat-header" role="banner">
      <h2>Chat Support</h2>
      <button
        onClick={closeChat}
        className="close-button"
        aria-label="Close chat"
      >
        ×
      </button>
    </div>
  );
};
