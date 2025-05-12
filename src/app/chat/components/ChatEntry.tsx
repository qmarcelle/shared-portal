'use client';

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
    if (!session?.user?.currUsr?.plan) return;

    setIsClientSide(true);

    const memberId = session.user.currUsr.umpi || session.user.currUsr.fhirId;
    const planId = session.user.currUsr.plan.grpId;

    // Load chat configuration with user data
    loadChatConfiguration(memberId, planId)
      .then(() => {
        // Initialize chat settings after configuration is loaded
        if (userData && Object.keys(userData).length > 0) {
          initializeChatSettings(userData, chatMode);
        }
      })
      .catch((error) => {
        console.error('Failed to initialize chat:', error);
      });
  }, [
    session,
    loadChatConfiguration,
    initializeChatSettings,
    userData,
    chatMode,
  ]);

  // Only render on client side to avoid hydration issues
  if (!isClientSide) return null;

  // Don't render if settings aren't loaded yet
  if (!chatSettings || scriptLoadPhase === ScriptLoadPhase.INIT) return null;

  // Determine which chat wrapper to use based on the chat mode
  return chatMode === 'cloud' ? <CloudChatWrapper /> : <LegacyChatWrapper />;
}

// Also export as default for dynamic imports
export default ChatEntry;
