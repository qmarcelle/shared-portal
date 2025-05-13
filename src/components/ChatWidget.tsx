'use client';

/**
 * @deprecated This component is deprecated in favor of the new ChatProvider.
 * Please use the ChatProvider component from '@/app/chat/components/ChatProvider' instead.
 *
 * The new implementation avoids reload issues and ensures proper script loading sequence.
 */

// Importing just for types, the actual implementation is deprecated
import { chatSelectors, useChatStore } from '@/app/chat/stores/chatStore';
import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

// Accept any shape for chatSettings, as it is aggregated server-side
export interface ChatWidgetProps {
  chatSettings: any;
}

export default function ChatWidget({ chatSettings }: ChatWidgetProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isOpen, isChatActive, isLoading, error, loadChatConfiguration } =
    useChatStore();
  const chatMode = chatSelectors.chatMode(useChatStore());

  // Define routes where chat should never appear
  const excludedPaths = [
    '/login',
    '/error',
    '/auth/error',
    '/sso/redirect',
    '/embed/security',
  ];

  // Chat session for passing to wrappers
  const chatSession = {
    isOpen,
    isChatActive,
    isLoading,
    error,
    startChat: useChatStore((state) => state.startChat),
    endChat: useChatStore((state) => state.endChat),
  };

  // Load chat configuration when the component mounts if the user is logged in with a plan
  useEffect(() => {
    if (session?.user?.currUsr?.plan) {
      const { memCk, grpId } = session.user.currUsr.plan;

      if (memCk && grpId) {
        logger.info('[ChatWidget] Loading chat configuration', {
          memberId: memCk,
          planId: grpId,
        });

        loadChatConfiguration(memCk, grpId);
      }
    }
  }, [session, loadChatConfiguration]);

  useEffect(() => {
    logger.info('[ChatWidget] Chat component mounted', {
      chatMode,
      isOpen,
      isChatActive,
    });
    // eslint-disable-next-line no-console
    console.log('[ChatWidget] Chat component mounted', {
      chatMode,
      isOpen,
      isChatActive,
    });
  }, [chatMode, isOpen, isChatActive]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.chatSettings = chatSettings;
      logger.info('[ChatWidget] window.chatSettings set', { chatSettings });
      // eslint-disable-next-line no-console
      console.log('[ChatWidget] window.chatSettings set', window.chatSettings);
    }
  }, [chatSettings]);

  // Add a useEffect to log just before rendering the Script tag
  useEffect(() => {
    if (typeof window !== 'undefined' && chatSettings) {
      // Only log if chatSettings is present
      console.log(
        '[ChatWidget] About to render click_to_chat.js',
        window.chatSettings,
      );
    }
  }, [chatSettings]);

  // Don't render chat on excluded paths or if user isn't authenticated with a plan
  if (
    excludedPaths.some((path) => pathname.startsWith(path)) ||
    !session?.user?.currUsr?.plan
  ) {
    return null;
  }

  // Don't render anything if chat is not open
  if (!isOpen) return null;

  // This component is deprecated. Use ChatProvider instead.
  logger.warn(
    '[ChatWidget] This component is deprecated. Use ChatProvider from @/app/chat/components/ChatProvider',
  );
  return (
    <>
      <Script
        src="/assets/genesys/click_to_chat.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined') {
            window.chatSettings = chatSettings;
            logger.info(
              '[ChatWidget] click_to_chat.js loaded with settings',
              window.chatSettings,
            );
            // eslint-disable-next-line no-console
            console.log(
              '[ChatWidget] click_to_chat.js loaded with settings',
              window.chatSettings,
            );
          }
        }}
      />
    </>
  );
}
