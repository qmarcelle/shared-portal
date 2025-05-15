'use client';

import ChatWidget from '@/app/chat/components/ChatWidget';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useChatStore } from './chat/stores/chatStore';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add loading state to prevent rendering before data is ready
  const [isClientReady, setIsClientReady] = useState(false);
  const genesysChatConfig = useChatStore(
    (state) => state.config.genesysChatConfig,
  );

  // Only run on client-side
  useEffect(() => {
    // Short timeout to ensure DOM is fully ready before loading chat components
    const timer = setTimeout(() => {
      setIsClientReady(true);
      console.log(
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

  // IMPORTANT: Always render ChatWidget once the client is ready,
  // even if genesysChatConfig isn't available yet.
  // This allows ChatWidget to make the API call to load the chat configuration,
  // which will in turn populate the store.
  console.log(
    '[ClientLayout] Rendering ChatWidget with or without config',
    genesysChatConfig ? Object.keys(genesysChatConfig) : 'none',
  );

  return (
    <>
      <ChatWidget />
      {children}
    </>
  );
}
