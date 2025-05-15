'use client';

/**
 * ChatControls Component
 *
 * Provides UI controls for the chat widget.
 * Uses the chat store for state and actions.
 */

import { logger } from '@/utils/logger';
import { useCallback } from 'react';
import {
  chatConfigSelectors,
  chatUISelectors,
  useChatStore,
} from '../stores/chatStore';

interface ChatControlsProps {
  /** Custom button text */
  buttonText?: string;
  /** Button className */
  className?: string;
  /** Callback when chat button is clicked */
  onClick?: () => void;
}

export default function ChatControls({
  buttonText = 'Chat with Us',
  className = '',
  onClick,
}: ChatControlsProps) {
  // Get state from store
  const isOpen = useChatStore(chatUISelectors.isOpen);
  const isChatEnabled = useChatStore(chatConfigSelectors.isChatEnabled);
  const isLoading = useChatStore(chatConfigSelectors.isLoading);

  // Get actions from store
  const setOpen = useChatStore((state) => state.actions.setOpen);

  // Handle chat button click
  const handleClick = useCallback(() => {
    logger.info('[ChatControls] Chat button clicked');

    // Call user-provided onClick handler
    if (onClick) onClick();

    // Toggle chat open state
    setOpen(!isOpen);
  }, [isOpen, setOpen, onClick]);

  // Don't render if chat isn't enabled or is still loading
  if (!isChatEnabled || isLoading) {
    return null;
  }

  return (
    <button
      className={`genesys-chat-button ${className}`}
      onClick={handleClick}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {isOpen ? 'Close Chat' : buttonText}
    </button>
  );
}
