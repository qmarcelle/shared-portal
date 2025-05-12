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
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Don't render chat components while loading
  return (
    <>
      {children}
      {isClientReady && <ChatProvider />}
    </>
  );
}
