'use client';

/**
 * ChatClientEntry Component
 * 
 * This component is the main entry point for the chat functionality in client components.
 * It lazy-loads the chat components to improve initial load performance.
 */

import { ChatLazyLoader } from './index';

export function ChatClientEntry() {
  return <ChatLazyLoader />;
}