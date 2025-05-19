'use client';

/**
 * @file ChatLazyLoader.tsx
 * @description Component responsible for deferring the loading of the entire Genesys chat system
 * until explicit user interaction (e.g., clicking a "Chat with Us" button) or automatically.
 * This is a key performance optimization, preventing heavy chat scripts from impacting
 * initial page load times. It dynamically loads ChatProvider, ChatWidget, and ChatControls.
 * As per README.md: Defers loading of the chat system until user interaction or auto-initializes.
 */

import { logger } from '@/utils/logger';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const LOG_PREFIX = '[ChatLazyLoader]';

// Dynamically import components to prevent them from loading until needed
// These components form the core of the chat system.
const ChatProvider = dynamic(
  () => {
    console.log(`${LOG_PREFIX} Dynamically importing ChatProvider...`);
    return import('./ChatProvider')
      .then((mod) => {
        console.log(`${LOG_PREFIX} ChatProvider imported successfully.`);
        return mod;
      })
      .catch((err) => {
        console.error(`${LOG_PREFIX} Failed to import ChatProvider:`, err);
        throw err; // Re-throw to allow Next.js to handle the error
      });
  },
  { ssr: false },
);

const ChatWidget = dynamic(
  () => {
    console.log(`${LOG_PREFIX} Dynamically importing ChatWidget...`);
    return import('./ChatWidget')
      .then((mod) => {
        console.log(`${LOG_PREFIX} ChatWidget imported successfully.`);
        return mod;
      })
      .catch((err) => {
        console.error(`${LOG_PREFIX} Failed to import ChatWidget:`, err);
        throw err;
      });
  },
  { ssr: false },
);

// Remove ChatControls - it's deprecated and causing warnings
// const ChatControls = dynamic(...);

interface ChatLazyLoaderProps {
  /** Custom text for the initialization button */
  buttonText?: string;
  /** Additional CSS class for the initialization button */
  buttonClassName?: string;
  /** Custom CSS class for the chat controls once loaded */
  chatControlsClassName?: string;
  /** Callback when chat is initialized by user interaction */
  onChatInitialized?: () => void;
  /** Automatically initialize chat without requiring button click */
  autoInitialize?: boolean;
}

/**
 * ChatLazyLoader component.
 * Either automatically initializes chat or renders a button to initiate chat.
 * Upon initialization, it dynamically loads and renders the core chat components
 * (ChatProvider, ChatWidget).
 * @param {ChatLazyLoaderProps} props - The component props.
 */
export default function ChatLazyLoader({
  buttonText = 'Chat with us',
  buttonClassName = '',
  chatControlsClassName = '', // Keep for backward compatibility
  onChatInitialized,
  autoInitialize = true, // Default to auto-initialize
}: ChatLazyLoaderProps) {
  const [chatInitialized, setChatInitialized] = useState(false);

  useEffect(() => {
    console.log(
      `${LOG_PREFIX} Component mounted. Chat initialized: ${chatInitialized}`,
    );

    // Cleanup function to remove stale ChatControls
    return () => {
      // Attempt to remove any previous fallback chat buttons that may exist
      if (typeof document !== 'undefined') {
        const fallbackButton = document.getElementById('fallback-chat-button');
        if (fallbackButton) {
          console.log(`${LOG_PREFIX} Removing previous fallback button`);
          fallbackButton.remove();
        }
      }
    };
  }, [chatInitialized]);

  // Initialize chat components when the user clicks the button
  const initializeChat = useCallback(() => {
    console.log(
      `${LOG_PREFIX} initializeChat called. Setting chatInitialized to true.`,
    );
    setChatInitialized(true);
    if (onChatInitialized) {
      console.log(`${LOG_PREFIX} Calling onChatInitialized callback.`);
      onChatInitialized();
    }

    // Log initialization for analytics or internal tracking
    console.log(
      `${LOG_PREFIX} Chat components will now be rendered due to ${autoInitialize ? 'auto-initialization' : 'user interaction'}.`,
    );

    // Example of pushing to dataLayer for analytics
    try {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'chat_lazy_load_initialized',
          eventCategory: 'Chat',
          eventAction: 'LazyLoadInitialize',
          eventLabel: autoInitialize ? 'Auto Initiated' : 'User Initiated',
        });
        console.log(
          `${LOG_PREFIX} Pushed chat_lazy_load_initialized event to dataLayer.`,
        );
      }
    } catch (e) {
      console.error(
        `${LOG_PREFIX} Error pushing analytics event to dataLayer:`,
        e,
      );
    }
  }, [onChatInitialized, autoInitialize]);

  // Auto-initialize effect - will run once on component mount if autoInitialize is true
  useEffect(() => {
    if (autoInitialize && !chatInitialized) {
      console.log(`${LOG_PREFIX} Auto-initializing chat...`);
      // Increased delay to ensure other components are loaded first
      // and authentication is complete
      const timer = setTimeout(() => {
        console.log(
          `${LOG_PREFIX} Auto-initialization timer fired after 3s delay`,
        );
        try {
          console.log(`${LOG_PREFIX} Calling initializeChat`);
          initializeChat();
          console.log(`${LOG_PREFIX} initializeChat called successfully`);
        } catch (error) {
          console.error(`${LOG_PREFIX} Error in auto-initialization:`, error);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [autoInitialize, chatInitialized, initializeChat]);

  if (!chatInitialized) {
    console.log(
      `${LOG_PREFIX} Chat not yet initialized. ${autoInitialize ? 'Auto-initializing...' : 'Rendering initialization button.'}`,
    );

    // If auto-initializing, show nothing or a loading indicator
    if (autoInitialize) {
      return null; // Or return a loading indicator if desired
    }

    // Otherwise show the button
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

  console.log(
    `${LOG_PREFIX} Chat initialized. Rendering ChatProvider and ChatWidget.`,
  );
  // Once initialized, render the chat components - removed ChatControls
  console.log('[ChatLazyLoader] About to render ChatProvider');
  logger.info('[ChatLazyLoader] About to render ChatProvider');
  return (
    <ChatProvider>
      <ChatWidget />
    </ChatProvider>
  );
}

// Add TypeScript interface for global window object if not already present globally
declare global {
  interface Window {
    dataLayer?: unknown[]; // For Google Tag Manager or similar analytics
  }
}
