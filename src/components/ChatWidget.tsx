'use client';

import CloudChatWrapper from '@/app/@chat/components/CloudChatWrapper';
import LegacyChatWrapper from '@/app/@chat/components/LegacyChatWrapper';
import { chatSelectors, useChatStore } from '@/app/@chat/stores/chatStore';
import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatWidget() {
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
  }, [chatMode, isOpen, isChatActive]);

  // Don't render chat on excluded paths or if user isn't authenticated with a plan
  if (
    excludedPaths.some((path) => pathname.startsWith(path)) ||
    !session?.user?.currUsr?.plan
  ) {
    return null;
  }

  // Don't render anything if chat is not open
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out">
      {chatMode === 'cloud' ? (
        <CloudChatWrapper chatSession={chatSession} />
      ) : (
        <LegacyChatWrapper chatSession={chatSession} />
      )}
    </div>
  );
}
