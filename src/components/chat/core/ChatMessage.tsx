import { format } from 'date-fns';
import React from 'react';
import { ChatMessage as ChatMessageType } from '../../../models/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  className?: string;
}

/**
 * Component to display a single chat message with appropriate styling
 */
export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  className = '',
}) => {
  const { text, sender, timestamp } = message;

  // Determine alignment and styling based on sender type
  const isUser = sender === 'user';
  const containerClass = isUser ? 'flex flex-row-reverse' : 'flex flex-row';

  const messageClass = isUser
    ? 'bg-primary text-primary-content rounded-lg p-3 max-w-[80%]'
    : 'bg-secondary-focus text-neutral rounded-lg p-3 max-w-[80%]';

  // Format the timestamp
  const formattedTime = format(timestamp, 'h:mm a');

  // For bot messages, we use a different style and potentially add an avatar
  const isBotMessage = sender === 'bot';

  return (
    <div className={`py-2 px-4 ${containerClass} ${className}`}>
      {/* If it's a bot or agent message, render an avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-2 flex-shrink-0">
          {isBotMessage ? 'B' : 'A'}
        </div>
      )}

      <div className={messageClass}>
        <div>{text}</div>
        <div className="text-xs opacity-70 mt-1">{formattedTime}</div>
      </div>

      {/* If it's a user message, add some space at the end */}
      {isUser && <div className="w-2" />}
    </div>
  );
};

export default ChatMessage;
