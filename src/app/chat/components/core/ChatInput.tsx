import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../../../chat/providers';

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
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      className={`chat-input-form ${className}`}
      onSubmit={handleSubmit}
      aria-label="Chat message form"
    >
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="chat-input-field"
        aria-label="Message input"
        onKeyPress={handleKeyPress}
      />
      <button
        type="submit"
        className="chat-send-button"
        aria-label="Send message"
        disabled={!message.trim()}
      >
        Send
      </button>
    </form>
  );
};
