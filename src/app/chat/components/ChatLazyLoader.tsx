'use client';

/**
 * ChatLazyLoader Component
 *
 * Lazy loads the chat functionality only when the user interacts with a button.
 * This significantly improves initial page load performance by deferring the loading
 * of heavy chat scripts (~1MB+) until they're actually needed.
 */

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';

// Dynamically import components to prevent them from loading until needed
const ChatProvider = dynamic(() => import('./ChatProvider'), { ssr: false });
const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false });
const ChatControls = dynamic(() => import('./ChatControls'), { ssr: false });

interface ChatLazyLoaderProps {
  /** Custom text for the initialization button */
  buttonText?: string;
  /** Additional CSS class for the initialization button */
  buttonClassName?: string;
  /** Custom CSS class for the chat controls once loaded */
  chatControlsClassName?: string;
  /** Callback when chat is initialized */
  onChatInitialized?: () => void;
}

export default function ChatLazyLoader({
  buttonText = 'Chat with us',
  buttonClassName = '',
  chatControlsClassName = '',
  onChatInitialized,
}: ChatLazyLoaderProps) {
  const [chatInitialized, setChatInitialized] = useState(false);

  // Initialize chat components when the user clicks the button
  const initializeChat = useCallback(() => {
    setChatInitialized(true);
    if (onChatInitialized) {
      onChatInitialized();
    }

    // Log initialization for analytics
    console.log(
      '[ChatLazyLoader] Chat components initialized on user interaction',
    );

    // You could also track this event with your analytics service
    try {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'chat_initialized',
          eventCategory: 'Chat',
          eventAction: 'Initialize',
          eventLabel: 'User Initiated',
        });
      }
    } catch (e) {
      console.error('[ChatLazyLoader] Error logging analytics event', e);
    }
  }, [onChatInitialized]);

  // Only show the initialization button if chat hasn't been initialized
  if (!chatInitialized) {
    return (
      <button
        className={`chat-init-button ${buttonClassName}`}
        onClick={initializeChat}
        aria-label="Start chat"
      >
        {buttonText}
      </button>
    );
  }

  // Once initialized, render the chat components
  return (
    <ChatProvider>
      <ChatWidget />
      <ChatControls className={chatControlsClassName} />
    </ChatProvider>
  );
}

// Add TypeScript interface for global window object
declare global {
  interface Window {
    dataLayer?: any[];
  }
}
