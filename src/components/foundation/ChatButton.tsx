'use client';

import { useChatStore } from '@/app/chat/stores/chatStore';
import { Button } from './Button';

interface ChatButtonProps {
  asButton?: boolean;
  label?: string;
  className?: string;
}

/**
 * Universal chat button that can be used anywhere in the app
 * Can be rendered as either a link or a Button component
 */
export function ChatButton({
  asButton = false,
  label = 'start a chat',
  className = '',
}: ChatButtonProps) {
  // Get the setOpen action from the chat store
  const setOpen = useChatStore((state) => state.actions.setOpen);

  // Handler for click events that matches Button's callback type
  const handleClick = () => {
    setOpen(true);
  };

  if (asButton) {
    return (
      <Button callback={handleClick} label={label} className={className} />
    );
  }

  // Link version still needs the event parameter to prevent default behavior
  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <a
      href="#"
      onClick={handleLinkClick}
      className={className}
      role="button"
      aria-label="Open chat window"
    >
      {label}
    </a>
  );
}
