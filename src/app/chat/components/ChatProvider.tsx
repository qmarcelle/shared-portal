'use client';

import { useSession } from 'next-auth/react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ChatErrorBoundary } from './ChatErrorBoundary';
import { ChatLoading } from './StatusComponents';

// Dynamically import the ChatEntry component to avoid SSR issues
const ChatEntry = dynamic(() => import('./ChatEntry'), {
  ssr: false
});

/**
 * ChatProvider component that conditionally renders the chat widget
 * based on authentication state. This can be used anywhere in the app
 * without requiring a specific directory structure.
 */
export function ChatProvider() {
  const { data: session, status } = useSession();
  
  // Don't render anything during loading or if not authenticated
  if (status === 'loading' || status !== 'authenticated') {
    return null;
  }
  
  // Only render chat if user is authenticated and has a plan
  if (!session?.user?.currUsr?.plan) {
    return null;
  }

  return (
    <ChatErrorBoundary>
      <Suspense fallback={<ChatLoading />}>
        <ChatEntry />
      </Suspense>
    </ChatErrorBoundary>
  );
}