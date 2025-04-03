import { Button } from '@/components/foundation/Button';
import { TextField } from '@/components/foundation/TextField';
import React, { useState } from 'react';

interface ChatFooterProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
  disabled: boolean;
}

export const ChatFooter: React.FC<ChatFooterProps> = ({
  onSendMessage,
  isSending,
  disabled,
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSending && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-footer">
      <TextField
        label="Message"
        value={message}
        valueCallback={setMessage}
        hint="Type your message..."
        disabled={isSending || disabled}
      />
      <Button
        type="primary"
        style="button"
        label={isSending ? 'Sending...' : 'Send'}
        callback={isSending ? undefined : () => onSendMessage(message)}
        disabled={!message.trim() || disabled || isSending}
      />
    </form>
  );
};
