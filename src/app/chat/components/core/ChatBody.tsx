import React from 'react';
import { useChatStore } from '../../../chat/providers';

export const ChatBody: React.FC = () => {
  const messages = useChatStore((state) => state.messages);

  return (
    <div
      className="chat-body"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender}`}
            role="article"
            aria-label={`${message.sender} message`}
          >
            {message.text}
          </div>
        ))}
      </div>
    </div>
  );
};
