import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../../../utils/chatStore';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Input component for typing and sending chat messages
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  className = '',
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage } = useChatStore();

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || disabled) {
      return;
    }

    // Add message to store
    addMessage({
      text: message.trim(),
      sender: 'user',
    });

    // Call the provided send handler
    onSendMessage(message.trim());

    // Clear the input
    setMessage('');
  };

  // Handle Enter key to send message (Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-3 border-t border-tertiary-4 ${className}`}
    >
      <div className="flex items-end">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-grow p-2 border border-tertiary-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          rows={1}
          aria-label="Message input"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="ml-2 p-2 bg-primary text-primary-content rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
