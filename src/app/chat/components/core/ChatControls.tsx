'use client';

import { useChatStore, useChatUI } from '../../stores/chatStore';

interface ChatControlsProps {
  onClose?: () => void;
  onMinimize?: () => void;
}

export const ChatControls: React.FC<ChatControlsProps> = ({
  onClose,
  onMinimize,
}) => {
  const { isOpen, isMinimized } = useChatUI();
  const store = useChatStore();

  const handleClose = () => {
    store.closeChat();
    onClose?.();
  };

  const handleMinimize = () => {
    store.minimizeChat();
    onMinimize?.();
  };

  if (!isOpen) return null;

  return (
    <div className="chat-controls flex items-center gap-2">
      {!isMinimized && (
        <button
          onClick={handleMinimize}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Minimize chat"
        >
          <MinimizeIcon />
        </button>
      )}
      <button
        onClick={handleClose}
        className="p-2 hover:bg-gray-100 rounded-full"
        aria-label="Close chat"
      >
        <CloseIcon />
      </button>
    </div>
  );
};

const MinimizeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 8H2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4L4 12M4 4L12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
