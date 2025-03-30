import React from 'react';
import { useChatStore } from '../../../utils/chatStore';

interface ChatHeaderProps {
  title?: string;
  isAmplifyMember?: boolean;
  className?: string;
  onClose?: () => void;
}

/**
 * Header component for the chat widget with title and close button
 */
export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  isAmplifyMember = false,
  className = '',
  onClose,
}) => {
  const { setOpen } = useChatStore();

  // Determine the title based on whether the user is an Amplify member
  const headerTitle =
    title ?? (isAmplifyMember ? 'Chat with an advisor' : 'Chat with us');

  const handleClose = () => {
    // Call the onClose handler if provided
    if (onClose) {
      onClose();
    } else {
      // Otherwise, just close the chat
      setOpen(false);
    }
  };

  return (
    <div
      className={`p-4 bg-primary text-primary-content flex justify-between items-center ${className}`}
    >
      <h2 className="font-semibold text-lg">{headerTitle}</h2>
      <button
        onClick={handleClose}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-content"
        aria-label="Close chat"
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};
