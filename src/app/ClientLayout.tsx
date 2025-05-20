'use client';

import { ChatClientEntry } from '@/app/chat/components';
import { registerGlobalChatOpener } from '@/app/chat/utils/chatOpenHelpers';
import { logger } from '@/utils/logger';
import { useSession, type SessionContextValue } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shouldRenderChat, setShouldRenderChat] = useState(false);
  const hasInitializedGlobalOpener = useRef(false);

  const { data: session, status: sessionStatus } = useSession() as {
    data: SessionContextValue['data'];
    status: SessionContextValue['status'];
  };

  logger.info('[ClientLayout] Component RENDERED', {
    status: sessionStatus,
    sessionExists: !!session,
    shouldRenderChatState: shouldRenderChat,
  });

  useEffect(() => {
    logger.info('[ClientLayout] Session/Auth Status useEffect RUNNING', {
      status: sessionStatus,
      currentShouldRenderChat: shouldRenderChat,
      // Example: access session data here for logging if needed, without it being a dependency
      // sessionUserExists: !!session?.user
    });

    if (sessionStatus === 'authenticated') {
      if (!shouldRenderChat) {
        logger.info(
          '[ClientLayout] User is authenticated and shouldRenderChat is false. Setting to true.',
        );
        setShouldRenderChat(true);
      }

      if (!hasInitializedGlobalOpener.current) {
        logger.info('[ClientLayout] Registering global chat opener.');
        registerGlobalChatOpener();
        hasInitializedGlobalOpener.current = true;
      }
    } else if (sessionStatus === 'unauthenticated') {
      if (shouldRenderChat) {
        logger.info(
          '[ClientLayout] User is unauthenticated and shouldRenderChat is true. Setting to false.',
        );
        setShouldRenderChat(false);
        // Resetting global opener might be desired if chat is strictly for authenticated users
        // hasInitializedGlobalOpener.current = false;
      }
    }
  }, [sessionStatus]); // Dependency changed to ONLY sessionStatus

  useEffect(() => {
    logger.info(
      `[ClientLayout] shouldRenderChat state is now: ${shouldRenderChat}`,
    );
  }, [shouldRenderChat]);

  logger.info(
    `[ClientLayout] Rendering with shouldRenderChat: ${shouldRenderChat}`,
  );
  return (
    <>
      {shouldRenderChat && <ChatClientEntry key="chat-client-entry" />}
      {children}
    </>
  );
}
