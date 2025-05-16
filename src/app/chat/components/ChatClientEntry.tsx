'use client';

/**
 * ChatClientEntry Component
 *
 * This component is the main entry point for the chat functionality in client components.
 * It lazy-loads the chat components to improve initial load performance.
 * It also enhances all chat links on the page to open the chat when clicked.
 */

import { ChatLinkEnhancer } from '@/components/foundation/ChatLinkEnhancer';
import { ChatLazyLoader } from './index';

export function ChatClientEntry() {
  return (
    <>
      <ChatLazyLoader />
      <ChatLinkEnhancer />
    </>
  );
}
