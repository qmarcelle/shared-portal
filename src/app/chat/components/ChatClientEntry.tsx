'use client';

/**
 * ChatClientEntry Component
 *
 * This component is the main entry point for the chat functionality in client components.
 * It lazy-loads the chat components to improve initial load performance.
 * It also enhances all chat links on the page to open the chat when clicked.
 */

import { ChatLinkEnhancer } from '@/components/foundation/ChatLinkEnhancer';
import { logger } from '@/utils/logger';
import { useRef } from 'react';
import { ChatLazyLoader } from './index';

export function ChatClientEntry() {
  // Generate a unique ID on first render to prevent multiple initializations
  const instanceId = useRef(`chat-client-${Date.now()}`);

  console.log('[ChatClientEntry] Component rendered');
  logger.info('[ChatClientEntry] Component rendered');

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
