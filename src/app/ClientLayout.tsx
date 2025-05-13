'use client';

import ChatWidget from '@/components/ChatWidget';
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
  const chatSettings = useChatStore((state) => state.chatSettings);

  // Only run on client-side
  useEffect(() => {
    // Short timeout to ensure DOM is fully ready before loading chat components
    const timer = setTimeout(() => {
      setIsClientReady(true);
      console.log(
        '[ClientLayout] Client ready, ChatWidget can now be rendered',
        {
          hasChatSettings: !!chatSettings,
          chatSettingsKeys: chatSettings ? Object.keys(chatSettings) : [],
        },
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [chatSettings]);

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

  const isChatSettingsReady =
    !!chatSettings && Object.keys(chatSettings).length > 0;

  // Log when chatSettings changes for debugging
  useEffect(() => {
    console.log(
      '[ClientLayout] chatSettings updated:',
      chatSettings ? Object.keys(chatSettings).length : 0,
      'keys',
    );
  }, [chatSettings]);

  // Don't render any client components while not ready
  if (!isClientReady) {
    return <>{children}</>;
  }

  // IMPORTANT: Always render ChatWidget once the client is ready,
  // even if chatSettings isn't available yet.
  // This allows ChatWidget to make the API call to load the chat configuration,
  // which will in turn populate chatSettings.
  console.log(
    '[ClientLayout] Rendering ChatWidget with or without chatSettings',
    chatSettings ? Object.keys(chatSettings) : 'none',
  );

  return (
    <>
      <ChatWidget chatSettings={chatSettings || {}} />
      {children}
    </>
  );
}
