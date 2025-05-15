'use client';

/**
 * @file ChatLazyLoader.tsx
 * @description Component responsible for deferring the loading of the entire Genesys chat system
 * until explicit user interaction (e.g., clicking a "Chat with Us" button).
 * This is a key performance optimization, preventing heavy chat scripts from impacting
 * initial page load times. It dynamically loads ChatProvider, ChatWidget, and ChatControls.
 * As per README.md: Defers loading of the entire chat system until user interaction.
 */

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

const ChatControls = dynamic(
  () => {
    console.log(`${LOG_PREFIX} Dynamically importing ChatControls...`);
    return import('./ChatControls')
      .then((mod) => {
        console.log(`${LOG_PREFIX} ChatControls imported successfully.`);
        return mod;
      })
      .catch((err) => {
        console.error(`${LOG_PREFIX} Failed to import ChatControls:`, err);
        throw err;
      });
  },
  { ssr: false },
);

interface ChatLazyLoaderProps {
  /** Custom text for the initialization button */
  buttonText?: string;
  /** Additional CSS class for the initialization button */
  buttonClassName?: string;
  /** Custom CSS class for the chat controls once loaded */
  chatControlsClassName?: string;
  /** Callback when chat is initialized by user interaction */
  onChatInitialized?: () => void;
}

/**
 * ChatLazyLoader component.
 * Renders a button to initiate chat. Upon user click, it dynamically loads and renders
 * the core chat components (ChatProvider, ChatWidget, ChatControls).
 * @param {ChatLazyLoaderProps} props - The component props.
 */
export default function ChatLazyLoader({
  buttonText = 'Chat with us',
  buttonClassName = '',
  chatControlsClassName = '',
  onChatInitialized,
}: ChatLazyLoaderProps) {
  const [chatInitialized, setChatInitialized] = useState(false);

  useEffect(() => {
    console.log(
      `${LOG_PREFIX} Component mounted. Chat initialized: ${chatInitialized}`,
    );
  }, [chatInitialized]); // Empty dependency array ensures this runs only on mount

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
      `${LOG_PREFIX} Chat components will now be rendered due to user interaction.`,
    );

    // Example of pushing to dataLayer for analytics
    try {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'chat_lazy_load_initialized',
          eventCategory: 'Chat',
          eventAction: 'LazyLoadInitialize',
          eventLabel: 'User Initiated',
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
  }, [onChatInitialized]);

  if (!chatInitialized) {
    console.log(
      `${LOG_PREFIX} Chat not yet initialized. Rendering initialization button.`,
    );
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
    `${LOG_PREFIX} Chat initialized. Rendering ChatProvider, ChatWidget, and ChatControls.`,
  );
  // Once initialized, render the chat components
  return (
    <ChatProvider>
      <ChatWidget />
      <ChatControls className={chatControlsClassName} />
    </ChatProvider>
  );
}

// Add TypeScript interface for global window object if not already present globally
declare global {
  interface Window {
    dataLayer?: unknown[]; // For Google Tag Manager or similar analytics
  }
}
