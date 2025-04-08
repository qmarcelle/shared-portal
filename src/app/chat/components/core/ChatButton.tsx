'use client';

import { useUIStore } from '../../stores/shared/uiStore';

interface ChatButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

/**
 * A button component to open the Genesys chat widget
 */
export const ChatButton: React.FC<ChatButtonProps> = ({
  onClick,
  label = 'Chat with Us',
  className = 'fixed bottom-4 right-4 bg-primary hover:bg-primary-focus text-white font-bold py-3 px-6 rounded-lg shadow-md z-50',
}) => {
  const { openChat } = useUIStore();

  // Use provided onClick or fallback to openChat from store
  const handleClick = onClick || openChat;

  return (
    <button
      onClick={handleClick}
      className={className}
      aria-label="Chat with us"
    >
      {label}
    </button>
  );
};
