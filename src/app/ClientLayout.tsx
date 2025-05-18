'use client';

import { ChatClientEntry } from '@/app/chat/components';
import { registerGlobalChatOpener } from '@/app/chat/utils/chatOpenHelpers';
import {
  ChatLoadingState,
  initializeChatSequentially,
  resetChatLoader,
} from '@/app/chat/utils/chatSequentialLoader';
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

  // Only run on client-side
  useEffect(() => {
    // Use our sequential loader to manage initialization
    if (!hasInitialized.current) {
      logger.info('[ClientLayout] Initializing chat functionality');

      // Check if the API state is stalled - if API state is complete but scripts aren't allowed to load
      // This can happen if state gets out of sync between client/server
      if (
        ChatLoadingState.apiState.isComplete &&
        !ChatLoadingState.scriptState.isComplete &&
        !ChatLoadingState.scriptState.isLoading
      ) {
        logger.info(
          '[ClientLayout] Chat loader state detected as stalled - API complete but scripts not loading',
        );
        // Reset the loader to ensure clean state
        resetChatLoader();
      }

      // Initialize sequentially - will only run once even if ClientLayout is remounted
      if (initializeChatSequentially()) {
        logger.info(
          '[ClientLayout] First initialization - registering global opener',
        );
        // Register global chat opener for use in legacy components or direct script access
        registerGlobalChatOpener();
      } else {
        logger.info('[ClientLayout] Sequential loader already initialized');
      }

      hasInitialized.current = true;
    }

    // Short timeout to ensure DOM is fully ready before loading chat components
    const timer = setTimeout(() => {
      setIsClientReady(true);
      logger.info(
        '[ClientLayout] Client ready, ChatWidget can now be rendered',
        {
          hasGenesysConfig: !!genesysChatConfig,
          configKeys: genesysChatConfig ? Object.keys(genesysChatConfig) : [],
        },
      );
    }, 1000);

    return () => clearTimeout(timer);
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
      );
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

  // Don't render any client components while not ready
  if (!isClientReady) {
    return <>{children}</>;
  }

  // Always render ChatClientEntry at least once
  const chatClientEntry = <ChatClientEntry />;

  // Mark as initialized for subsequent renders
  if (!isChatClientInitialized) {
    console.log('[ClientLayout] First time rendering ChatClientEntry');
    isChatClientInitialized = true;
  } else {
    console.log('[ClientLayout] ChatClientEntry already initialized');
  }

  return (
    <>
      {chatClientEntry}
      {children}
    </>
  );
}
