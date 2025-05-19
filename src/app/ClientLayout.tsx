'use client';

import { ChatClientEntry } from '@/app/chat/components';
import { registerGlobalChatOpener } from '@/app/chat/utils/chatOpenHelpers';
import { ChatLoadingState } from '@/app/chat/utils/chatSequentialLoader';
import { logger } from '@/utils/logger';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { chatConfigSelectors, useChatStore } from './chat/stores/chatStore';

// Global tracking to prevent multiple initializations
let isChatClientInitialized = false;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add loading state to prevent rendering before data is ready
  const [isClientReady, setIsClientReady] = useState(false);
  const hasInitialized = useRef(false);
  const chatMode = useChatStore(chatConfigSelectors.chatMode);
  const legacyConfig = useChatStore((state) => state.config.legacyConfig);
  const cloudConfig = useChatStore((state) => state.config.cloudConfig);
  const loadChatConfiguration = useChatStore(
    (state) => state.actions.loadChatConfiguration,
  );

  const genesysChatConfig = chatMode === 'legacy' ? legacyConfig : cloudConfig;

  useEffect(() => {
    const eligibleWithConfig =
      ChatLoadingState.apiState.isComplete &&
      ChatLoadingState.apiState.isEligible &&
      !!genesysChatConfig &&
      Object.keys(genesysChatConfig).length > 0 &&
      !!(genesysChatConfig as any)?.targetContainer;

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
      hasTargetContainer: !!(genesysChatConfig as any)?.targetContainer,
      scriptsLoaded: ChatLoadingState.scriptState.isComplete,
    });

    setIsClientReady(readyForRender);

    if (readyForRender && !hasInitialized.current) {
      logger.info(
        '[ClientLayout] First initialization - registering global opener',
      );
      registerGlobalChatOpener();
      hasInitialized.current = true;
    }
  }, [genesysChatConfig]);

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

  // Auto-check eligibility after authentication
  useEffect(() => {
    logger.info(
      '[ClientLayout] Session useEffect triggered. Checking conditions for loadChatConfiguration.',
    );
    logger.info('[ClientLayout] Session object (full):', session);
    if (session?.user) {
      logger.info('[ClientLayout] Session user object:', session.user);
    }

    if (session?.user?.currUsr?.plan) {
      logger.info(
        '[ClientLayout] session.user.currUsr.plan object (raw):',
        session.user.currUsr.plan, // Keep original log for comparison
      );
      logger.info(
        '[ClientLayout] session.user.currUsr.plan object (JSON stringified):',
        JSON.stringify(session.user.currUsr.plan, null, 2), // Log as stringified JSON
      );
      logger.info(
        '[ClientLayout] session.user.currUsr.plan.memCk:',
        session.user.currUsr.plan.memCk,
      );
      logger.info(
        '[ClientLayout] session.user.currUsr.plan.grpId:',
        session.user.currUsr.plan.grpId,
      );
    } else {
      logger.info('[ClientLayout] session.user.currUsr.plan is not available.');
    }

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
        // Can't reliably access firstName or lastName as they might not exist on the user object
        groupId: planId,
        memberId: memberId,
      };

      // Pre-fetch chat eligibility as soon as we have user data
      loadChatConfiguration(
        memberId,
        planId,
        'MEM', // Default member type
        userContext,
      ).then((chatData) => {
        // Log the chatData that loadChatConfiguration resolves with
        logger.info(
          '[ClientLayout] loadChatConfiguration completed. Resolved chatData:',
          chatData,
        );
      });
    }
  }, [session, loadChatConfiguration]);

  const isChatConfigReady =
    !!genesysChatConfig && Object.keys(genesysChatConfig).length > 0;

  // Log when chatSettings changes for debugging
  useEffect(() => {
    logger.info('[ClientLayout] genesysChatConfig updated:', {
      keyCount: genesysChatConfig ? Object.keys(genesysChatConfig).length : 0,
    });
  }, [genesysChatConfig]);

  useEffect(() => {
    logger.info('[ClientLayout] ClientLayout mounted or updated.');
    console.log('[ClientLayout] ClientLayout mounted or updated.');
  });

  useEffect(() => {
    logger.info(`[ClientLayout] isClientReady changed: ${isClientReady}`);
    console.log(`[ClientLayout] isClientReady changed: ${isClientReady}`);
  }, [isClientReady]);

  useEffect(() => {
    logger.info(
      `[ClientLayout] hasInitialized.current changed: ${hasInitialized.current}`,
    );
    console.log(
      `[ClientLayout] hasInitialized.current changed: ${hasInitialized.current}`,
    );
  }, [hasInitialized]); // Corrected dependency to the ref object itself if monitoring its assignment, though typically not needed. Or remove if only for direct mutation logging.

  // Manage _chatClientInitialized flag - MOVED HERE
  useEffect(() => {
    if (isClientReady && !window._chatClientInitialized) {
      console.log(
        '[ClientLayout] First time rendering and initializing ChatClientEntry via useEffect',
      );
      window._chatClientInitialized = true; // Set the global flag
    } else if (isClientReady && window._chatClientInitialized) {
      // Added isClientReady here too
      console.log(
        '[ClientLayout] ChatClientEntry already initialized (checked in useEffect)',
      );
    }
    // We might want to reset _chatClientInitialized if isClientReady becomes false,
    // but that depends on the desired behavior if the client becomes "not ready" again.
  }, [isClientReady]);

  // Don't render any client components while not ready
  if (!isClientReady) {
    return <>{children}</>;
  }

  // Only render ChatClientEntry when client is ready
  const chatClientEntry = isClientReady ? <ChatClientEntry /> : null;

  return (
    <>
      {chatClientEntry}
      {children}
    </>
  );
}
