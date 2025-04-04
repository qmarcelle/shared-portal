import React from 'react';

interface ChatButtonProps {
  onClick: () => void;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="chat-button">
      Chat with Us
    </button>
  );
};
