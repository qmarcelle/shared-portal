'use client';

import { useChatStore } from '../stores/chatStore';

interface ChatTriggerProps {
  /** Callback when the chat is opened */
  onOpen?: () => void;
  /** Custom class name to override default styles */
  className?: string;
  /** Custom label for the button */
  label?: string;
  /** Whether the button should be fixed position (default: true) */
  fixed?: boolean;
  /** Whether to use a custom icon */
  customIcon?: React.ReactNode;
  /** Custom data-testid for testing */
  testId?: string;
}

/**
 * ChatTrigger component
 *
 * The canonical implementation for the minimized chat button.
 * This component can be used standalone or within ChatWidget.
 */
export function ChatTrigger({
  onOpen,
  className = '',
  label = 'Chat with us',
  fixed = true,
  customIcon,
  testId = 'button-chat-with-us',
}: ChatTriggerProps) {
  const { setOpen, isOpen } = useChatStore();

  const handleClick = () => {
    setOpen(true);
    onOpen?.();
  };

  // Determine the CSS classes based on props
  const baseClass =
    'flex items-center justify-center bg-primary text-white rounded-full shadow-lg transition-transform hover:scale-105 z-50';
  const fixedClass = fixed ? 'fixed bottom-8 right-8 w-16 h-16' : '';
  const combinedClassName = `${baseClass} ${fixedClass} ${className}`.trim();

  return (
    <button
      onClick={handleClick}
      className={combinedClassName}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      data-testid={testId}
    >
      {customIcon ? (
        customIcon
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
        >
          <circle cx="16" cy="16" r="16" fill="currentColor" />
          <path
            d="M22.5 6.6H9.95C7.59 6.6 5.67 8.53 5.67 10.9v7.61c0 4.11 3.08 4.29 3.08 4.29v3.33c0 .74.87 1.13 1.43.65l4.6-3.98h7.72c2.36 0 4.25-1.92 4.25-4.29v-7.61c0-2.37-1.89-4.29-4.25-4.29z"
            fill="#fff"
          />
        </svg>
      )}
    </button>
  );
}
