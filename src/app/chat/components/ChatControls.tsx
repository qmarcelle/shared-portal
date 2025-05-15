'use client';

/**
 * @file ChatControls.tsx
 * @description This component provides UI elements (e.g., an open/close button) for users to interact with the chat.
 * It exclusively uses the `chatStore` for its state (e.g., `isOpen`, `isChatEnabled`) and to dispatch actions (e.g., `setOpen`).
 * As per README.md: "Provides UI controls (e.g., open/close button) interacting with the store."
 * It does NOT directly interact with `window.GenesysChat` or `CXBus`; `ChatWidget` handles those interactions based on store changes.
 */

import { logger } from '@/utils/logger';
import { useCallback } from 'react';
import {
  chatConfigSelectors,
  chatUISelectors,
  useChatStore,
} from '../stores/chatStore';

const LOG_PREFIX = '[ChatControls]';

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
  // Get state from store using selectors for optimized rendering
  const isOpen = useChatStore(chatUISelectors.isOpen);
  const isChatEnabled = useChatStore(chatConfigSelectors.isChatEnabled);
  const isLoading = useChatStore(chatConfigSelectors.isLoading);

  logger.info(`${LOG_PREFIX} Component rendered. Status:`, {
    isOpen,
    isChatEnabled,
    isLoading,
  });

  // Get actions from store
  const setOpen = useChatStore((state) => state.actions.setOpen);

  // Handle chat button click - only interacts with the Zustand store
  const handleClick = useCallback(() => {
    logger.info('[ChatControls] Chat button clicked');

    // Call user-provided onClick handler
    if (onClick) onClick();

    // Toggle chat open state in the store
    // The ChatWidget component will detect this state change
    // and issue the appropriate CXBus command
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
