'use client';

import { ChatProvider } from './chat/components/ChatProvider';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add loading state to prevent rendering before data is ready

  // Don't render chat components while loading

  return (
    <>
      {children}
      <ChatProvider />
    </>
  );
}
