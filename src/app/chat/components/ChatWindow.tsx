import { Button } from '@/components/foundation/Button';
import React, { FormEvent, useRef, useState } from 'react';

interface ChatWindowProps {
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'agent';
  }>;
  error: Error | null;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onFileUpload: (file: File) => void;
}

/**
 * ChatWindow component that renders the main chat interface.
 * Handles message display, user input, file uploads, and error states.
 *
 * @component
 * @example
 * ```tsx
 * <ChatWindow
 *   messages={messages}
 *   error={error}
 *   onClose={() => setIsOpen(false)}
 *   onSendMessage={(msg) => sendMessage(msg)}
 *   onFileUpload={(file) => handleFileUpload(file)}
 * />
 * ```
 */
export function ChatWindow({
  messages,
  error,
  onClose,
  onSendMessage,
  onFileUpload,
}: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>Chat Support</h2>
        <Button
          type="ghost"
          label="✕"
          callback={onClose}
          aria-label="Close chat"
        />
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.content}
          </div>
        ))}
        {error && (
          <div className="error-message">
            <p>Unable to start chat</p>
            <p>Please try again</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          aria-label="message"
        />
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          aria-label="attach file"
          style={{ display: 'none' }}
        />
        <Button
          type="ghost"
          label="📎"
          callback={() => fileInputRef.current?.click()}
          aria-label="attach file"
        />
        <Button type="primary" style="submit" label="Send" aria-label="send" />
      </form>
    </div>
  );
}
