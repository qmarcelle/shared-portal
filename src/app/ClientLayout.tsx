'use client';

import { useEffect, useState } from 'react';
import { ChatProvider } from './chat/components/ChatProvider';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add loading state to prevent rendering before data is ready
  const [isClientReady, setIsClientReady] = useState(false);

  // Only run on client-side
  useEffect(() => {
    // Short timeout to ensure DOM is fully ready before loading chat components
    const timer = setTimeout(() => {
      setIsClientReady(true);
      console.log(
        '[ClientLayout] Client ready, ChatProvider can now be rendered',
      );

      // Make directChatOpen globally available if it's defined in LegacyChatWrapper
      if (typeof window !== 'undefined') {
        // Check periodically until the function is available (it may be loaded asynchronously)
        const checkInterval = setInterval(() => {
          const legacyWrapper = document.getElementById('legacy-chat-wrapper');
          if (
            legacyWrapper &&
            typeof (window as any).directChatOpen === 'function'
          ) {
            console.log(
              '[ClientLayout] directChatOpen function is available globally',
            );
            clearInterval(checkInterval);
          } else if (
            typeof (window as any)._makeDirectChatOpenGlobal === 'function'
          ) {
            (window as any)._makeDirectChatOpenGlobal();
            console.log(
              '[ClientLayout] Attempted to make directChatOpen available globally',
            );
          }
        }, 1000);

        // Clean up interval on unmount
        return () => clearInterval(checkInterval);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Don't render chat components while loading
  if (!isClientReady) {
    return <>{children}</>;
  }

  return (
    <>
      <ChatProvider />
      {children}
    </>
  );
}
