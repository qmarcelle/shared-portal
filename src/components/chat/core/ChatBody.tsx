import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../../utils/chatStore';
import ChatMessage from './ChatMessage';

interface ChatBodyProps {
  className?: string;
  showPlanInfo?: boolean;
  planName?: string;
}

/**
 * Component to display all chat messages with auto-scrolling
 */
export const ChatBody: React.FC<ChatBodyProps> = ({
  className = '',
  showPlanInfo = false,
  planName = '',
}) => {
  const { messages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={`flex-grow overflow-y-auto ${className}`}>
      {/* Plan information banner for multi-plan members */}
      {showPlanInfo && planName && (
        <div className="bg-secondary-focus text-neutral p-2 text-center text-sm sticky top-0 z-10 shadow-sm">
          <span className="font-semibold">Current Plan:</span> {planName}
        </div>
      )}

      {/* Empty state when no messages */}
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-neutral opacity-70">
          Start a conversation...
        </div>
      )}

      {/* Message list */}
      <div className="flex flex-col">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatBody;
