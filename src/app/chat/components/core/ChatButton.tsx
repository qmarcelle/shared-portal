import React from 'react';
import { useChatStore } from '../../../chat/providers';

export const ChatButton: React.FC = () => {
  const openChat = useChatStore((state) => state.openChat);

  return (
    <button onClick={openChat} className="chat-button">
      Chat with Us
    </button>
  );
};
