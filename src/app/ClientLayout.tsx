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

  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    logger.info('[ClientLayout] Session data:', {
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
    });

    if (sessionStatus === 'authenticated') {
      logger.info(
        '[ClientLayout] User is authenticated. Setting shouldRenderChat to true.',
      );
      setShouldRenderChat(true);

      if (!hasInitializedGlobalOpener.current) {
        logger.info(
          '[ClientLayout] First initialization - registering global opener',
        );
        registerGlobalChatOpener();
        hasInitializedGlobalOpener.current = true;
      }
    } else if (sessionStatus === 'unauthenticated') {
      logger.info(
        '[ClientLayout] User is unauthenticated. Setting shouldRenderChat to false.',
      );
      setShouldRenderChat(false);
    }
  }, [session, sessionStatus]);

  useEffect(() => {
    logger.info(`[ClientLayout] shouldRenderChat changed: ${shouldRenderChat}`);
  }, [shouldRenderChat]);

  return (
    <>
      {shouldRenderChat && <ChatClientEntry />}
      {children}
    </>
  );
}
