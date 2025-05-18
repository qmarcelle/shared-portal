'use client';

/**
 * @file ChatControls.tsx
 * @description This component provides UI elements (e.g., an open/close button) for users to interact with the chat.
 * NOTE: With the updated implementation relying entirely on the official Genesys widget button,
 * this component is now deprecated and returns null. The official Genesys CXBus APIs
 * (WebChat.showChatButton and WebChat.hideChatButton) should be used to control button visibility.
 */

import { logger } from '@/utils/logger';

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
  // Log deprecation warning
  logger.warn(
    `${LOG_PREFIX} This component is deprecated. The Genesys widget provides its own chat button. ` +
      'Use window._genesysCXBus.command("WebChat.showChatButton") and "WebChat.hideChatButton" APIs instead.',
  );

  // Return null to prevent rendering any custom button
  return null;
}
