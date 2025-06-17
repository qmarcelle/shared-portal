'use client';
import React from 'react';

// Extend the Window interface to include openWebChatWidget
declare global {
  interface Window {
    openWebChatWidget?: () => void;
  }
}

interface ChatTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ChatTrigger: React.FC<ChatTriggerProps> = ({
  children,
  className = 'chat-trigger',
  onClick,
}) => {
  const handleClick = () => {
    if (typeof window.openWebChatWidget === 'function') {
      window.openWebChatWidget();
    } else {
      console.error('openWebChatWidget is not available on window');
    }
    onClick?.();
  };

  return (
    <button className={className} onClick={handleClick} type="button">
      {children}
    </button>
  );
};

export default ChatTrigger;
