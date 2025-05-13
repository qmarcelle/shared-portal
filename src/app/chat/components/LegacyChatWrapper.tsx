// @ts-nocheck
'use client';
import { setupChatDebugger } from '@/app/chat/utils/chatDebugUtils';
import {
  applyCriticalChatButtonStyles,
  createEmergencyChatButton,
  ensureChatCssIsLoaded,
} from '@/app/chat/utils/chatUtils';
import { useEffect } from 'react';

export function LegacyChatWrapper() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    ensureChatCssIsLoaded();
    setTimeout(applyCriticalChatButtonStyles, 500);
    setTimeout(() => {
      const chatButton = document.querySelector('.cx-webchat-chat-button');
      if (!chatButton) {
        createEmergencyChatButton();
      }
    }, 5000);
    // Optional: Setup debug utilities (can be removed later)
    setupChatDebugger();
  }, []);
  return null;
}

export default LegacyChatWrapper;
