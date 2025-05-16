'use client';

import { ChatClientEntry } from '@/app/chat/components';
import { registerGlobalChatOpener } from '@/app/chat/utils/chatOpenHelpers';
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

  const genesysChatConfig = chatMode === 'legacy' ? legacyConfig : cloudConfig;

  // Only run on client-side
  useEffect(() => {
    // Register global chat opener for use in legacy components or direct script access
    // Only do this once per session/page load
    if (!hasInitialized.current) {
      console.log('[ClientLayout] Initializing chat functionality');
      registerGlobalChatOpener();
      hasInitialized.current = true;
    }

    // Short timeout to ensure DOM is fully ready before loading chat components
    const timer = setTimeout(() => {
      setIsClientReady(true);
      console.log(
        '[ClientLayout] Client ready, ChatWidget can now be rendered',
        {
          hasGenesysConfig: !!genesysChatConfig,
          configKeys: genesysChatConfig ? Object.keys(genesysChatConfig) : [],
          isChatClientInitialized,
        },
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [genesysChatConfig]);

  // Get session data
  const { data: session } = useSession();

  // Log session data for debugging
  useEffect(() => {
    console.log('[ClientLayout] Session data:', {
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

  const isChatConfigReady =
    !!genesysChatConfig && Object.keys(genesysChatConfig).length > 0;

  // Log when chatSettings changes for debugging
  useEffect(() => {
    console.log(
      '[ClientLayout] genesysChatConfig updated:',
      genesysChatConfig ? Object.keys(genesysChatConfig).length : 0,
      'keys',
    );
  }, [genesysChatConfig]);

  // Don't render any client components while not ready
  if (!isClientReady) {
    return <>{children}</>;
  }

  // IMPORTANT: Only render ChatClientEntry once per app lifetime
  // This prevents multiple instances of Genesys scripts
  let chatClientEntry = null;
  if (!isChatClientInitialized) {
    console.log('[ClientLayout] First time rendering ChatClientEntry');
    isChatClientInitialized = true;
    chatClientEntry = <ChatClientEntry />;
  } else {
    console.log(
      '[ClientLayout] ChatClientEntry already initialized, skipping render',
    );
  }

  return (
    <>
      {chatClientEntry}
      {children}
    </>
  );
}
