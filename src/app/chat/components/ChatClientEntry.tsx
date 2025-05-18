'use client';

/**
 * ChatClientEntry Component
 *
 * This component is the main entry point for the chat functionality in client components.
 * It lazy-loads the chat components to improve initial load performance.
 * It also enhances all chat links on the page to open the chat when clicked.
 */

import { ChatLinkEnhancer } from '@/components/foundation/ChatLinkEnhancer';
import { useRef } from 'react';
import { ChatLazyLoader } from './index';

export function ChatClientEntry() {
  // Generate a unique ID on first render to prevent multiple initializations
  const instanceId = useRef(`chat-client-${Date.now()}`);

  // Track if we've already initialized
  if (typeof window !== 'undefined' && window._chatClientInitialized) {
    console.log(
      '[ChatClientEntry] Already initialized. Skipping duplicate initialization.',
    );
    // Return empty fragment to prevent multiple instances
    return null;
  }

  // Mark as initialized
  if (typeof window !== 'undefined') {
    window._chatClientInitialized = true;
    console.log('[ChatClientEntry] Initializing chat client entry');
  }

  return (
    <>
      <ChatLazyLoader autoInitialize={true} key={instanceId.current} />
      <ChatLinkEnhancer />
    </>
  );
}

// Add to global Window interface
declare global {
  interface Window {
    _chatClientInitialized?: boolean;
  }
}
