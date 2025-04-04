import React from 'react';

interface ChatHeaderProps {
  title: string;
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="chat-header" role="banner">
      <h2>{title}</h2>
      <button
        onClick={onClose}
        className="close-button"
        aria-label="Close chat"
      >
        ×
      </button>
    </div>
  );
};
