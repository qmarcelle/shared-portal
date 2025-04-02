import React from 'react';
import { useChatStore } from '../../../utils/chatStore';

interface ChatBodyProps {
  className?: string;
}

export const ChatBody: React.FC<ChatBodyProps> = ({ className = '' }) => {
  const messages = useChatStore((state) => state.messages);

  return (
    <div className={`chat-body ${className}`}>
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-item ${message.sender === 'user' ? 'user-message' : 'agent-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
    </div>
  );
};
