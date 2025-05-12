'use client';

import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { chatSelectors, useChatStore } from '../stores/chatStore';
import { ScriptLoadPhase } from '../types';
import { CloudChatWrapper } from './CloudChatWrapper';
import { LegacyChatWrapper } from './LegacyChatWrapper';

/**
 * ChatEntry component that determines which chat implementation to use
 * based on the chat settings and user configuration.
 *
 * This component is responsible for:
 * 1. Loading chat configuration
 * 2. Initializing chat settings
 * 3. Determining which chat implementation to use (legacy or cloud)
 * 4. Rendering the appropriate chat wrapper component
 */
// Export both as named and default export for compatibility
export function ChatEntry() {
  const [isClientSide, setIsClientSide] = useState(false);
  const { data: session } = useSession();

  const chatMode = chatSelectors.chatMode(useChatStore());
  const chatSettings = useChatStore((state) => state.chatSettings);
  const scriptLoadPhase = useChatStore((state) => state.scriptLoadPhase);
  const loadChatConfiguration = useChatStore(
    (state) => state.loadChatConfiguration,
  );
  const initializeChatSettings = useChatStore(
    (state) => state.initializeChatSettings,
  );
  const userData = chatSelectors.userData(useChatStore());

  // Combined useEffect to load chat config and settings
  useEffect(() => {
    if (session?.user?.currUsr?.plan?.memCk) {
      const memberId = session.user.currUsr.plan.memCk;
      const planId = session.user.currUsr.plan.grpId;

      logger.info('[ChatEntry] Loading chat configuration', {
        memberId,
        planId,
      });

      // Force set debug flags
      window._FORCE_CHAT_AVAILABLE = true;
      window._DEBUG_CHAT = true;

      loadChatConfiguration(memberId, planId)
        .then(() => {
          // Force set eligibility after loading
          const store = useChatStore.getState();
          if (store.chatData) {
            store.chatData.isEligible = true;
            store.chatData.cloudChatEligible = false;

            // Use a type assertion to add the property
            (store.chatData as any).chatAvailable = true;

            if (store.chatData.businessHours) {
              store.chatData.businessHours.isOpen = true;
              store.chatData.businessHours.text = 'S_S_24';
            } else {
              store.chatData.businessHours = {
                isOpen: true,
                text: 'S_S_24',
              };
            }
          }

          logger.info(
            '[ChatEntry] Chat configuration loaded and eligibility forced',
          );
        })
        .catch((error) => {
          logger.error('[ChatEntry] Error loading chat configuration', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
          });
        });
    } else {
      logger.warn('[ChatEntry] No memberId available in session');
    }
  }, [session, loadChatConfiguration]);

  // Only render on client side to avoid hydration issues
  if (!isClientSide) return null;

  // Don't render if settings aren't loaded yet
  if (!chatSettings || scriptLoadPhase === ScriptLoadPhase.INIT) return null;

  // Determine which chat wrapper to use based on the chat mode
  return chatMode === 'cloud' ? <CloudChatWrapper /> : <LegacyChatWrapper />;
}

// Also export as default for dynamic imports
export default ChatEntry;

declare global {
  interface Window {
    _FORCE_CHAT_AVAILABLE?: boolean;
    _DEBUG_CHAT?: boolean;
  }
}
