import React, { useState } from 'react';
import { useChatStore } from '../../../utils/chatStore';

interface ChatInputProps {
  className?: string;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  className = '',
  placeholder = 'Type your message...',
}) => {
  const addMessage = useChatStore((state) => state.addMessage);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    addMessage({
      id: `user-${Date.now()}`,
      text: message,
      sender: 'user',
      timestamp: Date.now(),
    });

    // Clear input
    setMessage('');
  };

  return (
    <form className={`chat-input-form ${className}`} onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="chat-input-field"
      />
      <button type="submit" className="chat-send-button">
        Send
      </button>
    </form>
  );
};
