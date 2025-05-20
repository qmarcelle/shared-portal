'use client';

import { ChatClientEntry } from '@/app/chat/components';
import { registerGlobalChatOpener } from '@/app/chat/utils/chatOpenHelpers';
import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shouldRenderChat, setShouldRenderChat] = useState(false);
  const hasInitializedGlobalOpener = useRef(false);
  const previousSessionRef = useRef<typeof session>(null); // To track session object reference

  const { data: session, status: sessionStatus } = useSession();

  // Log when ClientLayout re-renders
  logger.info('[ClientLayout] Component RENDERED', {
    status: sessionStatus,
    sessionExists: !!session,
    shouldRenderChatState: shouldRenderChat,
  });

  useEffect(() => {
    const isSessionRefDifferent = previousSessionRef.current !== session;
    logger.info('[ClientLayout] Main useEffect RUNNING', {
      status: sessionStatus,
      isAuthenticated: sessionStatus === 'authenticated' && !!session,
      user: session?.user ? 'exists' : 'null',
      plan: session?.user?.currUsr?.plan
        ? {
            memCk: session?.user?.currUsr?.plan?.memCk,
            grpId: session?.user?.currUsr?.plan?.grpId,
          }
        : 'null',
      timestamp: new Date().toISOString(),
      isSessionRefDifferent, // Log if session object reference changed
      shouldRenderChatState: shouldRenderChat, // Log current state
    });
    previousSessionRef.current = session; // Update ref for next run

    if (sessionStatus === 'authenticated') {
      if (!shouldRenderChat) {
        logger.info(
          '[ClientLayout] User is authenticated and shouldRenderChat is false. Setting to true.',
        );
        setShouldRenderChat(true);
      }

      if (!hasInitializedGlobalOpener.current) {
        logger.info(
          '[ClientLayout] First initialization - registering global opener',
        );
        registerGlobalChatOpener();
        hasInitializedGlobalOpener.current = true;
      }
    } else if (sessionStatus === 'unauthenticated') {
      if (shouldRenderChat) {
        logger.info(
          '[ClientLayout] User is unauthenticated and shouldRenderChat is true. Setting to false.',
        );
        setShouldRenderChat(false);
        // Optionally reset global opener if chat is hidden due to unauthentication
        // hasInitializedGlobalOpener.current = false;
      }
    }
  }, [session, sessionStatus, shouldRenderChat]);

  useEffect(() => {
    logger.info(
      `[ClientLayout] shouldRenderChat state CHANGED to: ${shouldRenderChat}`,
    );
  }, [shouldRenderChat]);

  return (
    <>
      {shouldRenderChat && <ChatClientEntry />}
      {children}
    </>
  );
}
