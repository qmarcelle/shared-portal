'use client';

import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
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
  // Use refs for DOM manipulation to avoid hydration warnings
  const debugButtonRef = useRef<HTMLButtonElement | null>(null);
  const buttonCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Properly handle client/server rendering
  const [mounted, setMounted] = useState(false);
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

  // Debug function to create a manual chat button if Genesys fails
  const createDebugChatButton = () => {
    // Only run on client side
    if (typeof window === 'undefined' || !mounted) return;

    // Check if button already exists to avoid duplicates
    if (document.querySelector('#debug-chat-button')) return;

    const existingButton = document.querySelector('.cx-webchat-chat-button');
    if (existingButton) {
      logger.info('[ChatEntry] Genesys button found, enhancing it');
      existingButton.textContent = 'Chat Now';
      existingButton.setAttribute(
        'style',
        'display: flex; opacity: 1; visibility: visible; background-color: #0078d4; color: white; padding: 10px 20px; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); position: fixed; right: 20px; bottom: 20px; z-index: 9999;',
      );
      return;
    }

    logger.info('[ChatEntry] Creating debug chat button');
    const debugButton = document.createElement('button');
    debugButton.id = 'debug-chat-button';
    debugButton.textContent = 'Chat Now';
    debugButton.setAttribute(
      'style',
      'position: fixed; right: 20px; bottom: 20px; background-color: #0078d4; color: white; padding: 10px 20px; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 9999;',
    );

    // Add click handler to open chat
    debugButton.onclick = function () {
      if (window.CXBus && typeof window.CXBus.command === 'function') {
        window.CXBus.command('WebChat.open');
      } else if (window.openGenesysChat) {
        window.openGenesysChat();
      } else {
        alert('Chat not fully initialized yet. Please try again in a moment.');
      }
    };

    document.body.appendChild(debugButton);
    debugButtonRef.current = debugButton;
  };

  // CLIENT-ONLY: First mount effect - mark component as mounted
  useEffect(() => {
    setMounted(true);

    // Cleanup function
    return () => {
      // Clean up any intervals
      if (buttonCheckIntervalRef.current) {
        clearInterval(buttonCheckIntervalRef.current);
      }

      // Remove debug button if we created one
      if (debugButtonRef.current && debugButtonRef.current.parentNode) {
        debugButtonRef.current.parentNode.removeChild(debugButtonRef.current);
      }
    };
  }, []);

  // CLIENT-ONLY: Chat configuration loading - separated for clarity
  useEffect(() => {
    // Only run when component is mounted client-side
    if (!mounted) return;

    if (!session?.user?.currUsr?.plan?.memCk) {
      logger.warn('[ChatEntry] No memberId available in session');
      return;
    }

    const memberId = session.user.currUsr.plan.memCk;
    const planId = session.user.currUsr.plan.grpId;

    logger.info('[ChatEntry] Loading chat configuration', {
      memberId,
      planId,
    });

    // Force set debug flags
    if (typeof window !== 'undefined') {
      window._FORCE_CHAT_AVAILABLE = true;
      window._DEBUG_CHAT = true;
    }

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

          // Log the current state for debugging
          logger.info(
            '[ChatEntry] Chat configuration loaded with forced settings',
            {
              eligibility: store.chatData.isEligible,
              cloudEligible: store.chatData.cloudChatEligible,
              chatAvailable: (store.chatData as any).chatAvailable,
              businessHours: store.chatData.businessHours,
            },
          );

          // Create debug button after a delay to ensure Genesys has time to initialize
          setTimeout(createDebugChatButton, 3000);
        }
      })
      .catch((error) => {
        logger.error('[ChatEntry] Error loading chat configuration', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        });

        // Create fallback button anyway
        setTimeout(createDebugChatButton, 3000);
      });
  }, [session, loadChatConfiguration, mounted]);

  // CLIENT-ONLY: Button visibility checker
  useEffect(() => {
    // Only run when component is mounted client-side
    if (!mounted) return;

    // Set up a monitor to check for button visibility periodically
    buttonCheckIntervalRef.current = setInterval(() => {
      if (
        document.querySelector('.cx-webchat-chat-button') ||
        document.querySelector('#debug-chat-button')
      ) {
        logger.info('[ChatEntry] Chat button found in DOM');
        if (buttonCheckIntervalRef.current) {
          clearInterval(buttonCheckIntervalRef.current);
        }
      } else {
        logger.warn(
          '[ChatEntry] Chat button not found in DOM, creating debug button',
        );
        createDebugChatButton();
      }
    }, 5000);

    // Clean up interval on unmount
    return () => {
      if (buttonCheckIntervalRef.current) {
        clearInterval(buttonCheckIntervalRef.current);
      }
    };
  }, [mounted]);

  // Guard for server-side rendering to avoid hydration errors
  if (!mounted) {
    return null; // Return null during SSR and initial render to avoid hydration issues
  }

  // Don't render if settings aren't loaded yet
  if (!chatSettings || scriptLoadPhase === ScriptLoadPhase.INIT) {
    return null;
  }

  // Determine which chat wrapper to use based on the chat mode
  return chatMode === 'cloud' ? <CloudChatWrapper /> : <LegacyChatWrapper />;
}

// Also export as default for dynamic imports
export default ChatEntry;

declare global {
  interface Window {
    _FORCE_CHAT_AVAILABLE?: boolean;
    _DEBUG_CHAT?: boolean;
    openGenesysChat?: () => void;
  }
}
