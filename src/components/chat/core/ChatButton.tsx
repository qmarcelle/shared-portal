import React from 'react';
import { useChatStore } from '../../../utils/chatStore';

interface ChatButtonProps {
  className?: string;
  label?: string;
}

/**
 * Button component that opens the chat widget when clicked
 */
export const ChatButton: React.FC<ChatButtonProps> = ({
  className = '',
  label = 'Chat with us',
}) => {
  const { setOpen } = useChatStore();

  return (
    <button
      onClick={() => setOpen(true)}
      className={`fixed bottom-4 right-4 z-50 flex items-center justify-center rounded-full bg-primary text-primary-content shadow-soft hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary h-14 w-14 ${className}`}
      aria-label={label}
      type="button"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary-content"
      >
        <path
          d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"
          fill="currentColor"
        />
        <path
          d="M7 9H17V11H7V9ZM7 7H17V9H7V7ZM7 11H17V13H7V11Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
};
