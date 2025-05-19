'use client';

import { ChatClientEntry } from '@/app/chat/components';
import { registerGlobalChatOpener } from '@/app/chat/utils/chatOpenHelpers';
import { ChatLoadingState } from '@/app/chat/utils/chatSequentialLoader';
import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { chatConfigSelectors, useChatStore } from './chat/stores/chatStore';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add loading state to prevent rendering before data is ready
  const [shouldRenderChat, setShouldRenderChat] = useState(false);
  const hasInitialized = useRef(false);
  const chatMode = useChatStore(chatConfigSelectors.chatMode);
  const legacyConfig = useChatStore((state) => state.config.legacyConfig);
  const cloudConfig = useChatStore((state) => state.config.cloudConfig);
  const loadChatConfiguration = useChatStore(
    (state) => state.actions.loadChatConfiguration,
  );

  const genesysChatConfig = chatMode === 'legacy' ? legacyConfig : cloudConfig;

  // Get session data
  const { data: session } = useSession();

  // Log session data for debugging
  useEffect(() => {
    logger.info('[ClientLayout] Session data:', {
      isAuthenticated: !!session,
      user: session?.user ? 'exists' : 'null',
      plan: session?.user?.currUsr?.plan
        ? {
            memCk: session?.user?.currUsr?.plan?.memCk,
            grpId: session?.user?.currUsr?.plan?.grpId,
          }
        : 'null',
      timestamp: new Date().toISOString(),
    });
  }, [session]);

  // Determine when to render chat based on API state and config
  useEffect(() => {
    const eligibleWithConfig =
      ChatLoadingState.apiState.isComplete &&
      ChatLoadingState.apiState.isEligible &&
      !!genesysChatConfig &&
      Object.keys(genesysChatConfig).length > 0;

    const scriptsAlreadyLoaded = ChatLoadingState.scriptState.isComplete;
    const notEligible =
      ChatLoadingState.apiState.isComplete &&
      !ChatLoadingState.apiState.isEligible;

    const readyForRender =
      eligibleWithConfig || scriptsAlreadyLoaded || notEligible;

    logger.info('[ClientLayout] Checking readiness for chat widget', {
      eligibleWithConfig,
      scriptsAlreadyLoaded,
      notEligible,
      readyForRender,
      apiComplete: ChatLoadingState.apiState.isComplete,
      apiEligible: ChatLoadingState.apiState.isEligible,
      hasConfig: !!genesysChatConfig,
      configKeys: genesysChatConfig ? Object.keys(genesysChatConfig).length : 0,
      scriptsLoaded: ChatLoadingState.scriptState.isComplete,
    });

    setShouldRenderChat(readyForRender);

    // Register global opener only once when ready
    if (readyForRender && !hasInitialized.current) {
      logger.info(
        '[ClientLayout] First initialization - registering global opener',
      );
      registerGlobalChatOpener();
      hasInitialized.current = true;
    }
  }, [genesysChatConfig]);

  // Auto-check eligibility after authentication
  useEffect(() => {
    logger.info(
      '[ClientLayout] Session useEffect triggered. Checking conditions for loadChatConfiguration.',
    );

    // Only proceed if session exists and has user data
    if (
      session?.user?.id &&
      session?.user?.currUsr?.plan?.memCk &&
      session?.user?.currUsr?.plan?.grpId
    ) {
      logger.info(
        '[ClientLayout] User authenticated, loading chat configuration',
      );

      // Extract member info from session
      const userId = session.user.id;
      const memberId = session.user.currUsr.plan.memCk;
      const planId = session.user.currUsr.plan.grpId;

      // Add basic user context with plan information
      const userContext = {
        userID: userId,
        groupId: planId,
        memberId: memberId,
      };

      // Pre-fetch chat eligibility
      loadChatConfiguration(
        memberId,
        planId,
        'MEM', // Default member type
        userContext,
      ).then((chatData: any) => {
        logger.info(
          '[ClientLayout] loadChatConfiguration completed:',
          chatData?.isEligible,
        );
      });
    }
  }, [session, loadChatConfiguration]);

  // Log when chat rendering state changes
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
