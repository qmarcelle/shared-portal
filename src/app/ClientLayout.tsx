'use client';

import ChatWidget from '@/components/ChatWidget';
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
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const isChatSettingsReady =
    !!chatSettings && Object.keys(chatSettings).length > 0;

  // Don't render chat components while loading
  if (!isClientReady || !isChatSettingsReady) {
    return <>{children}</>;
  }

  console.log(
    '[ClientLayout] Rendering ChatWidget with chatSettings:',
    chatSettings,
  );

  return (
    <>
      <ChatWidget chatSettings={chatSettings} />
      {children}
    </>
  );
}
