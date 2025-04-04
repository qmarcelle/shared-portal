'use client';

import { AlertBar } from '@/components/foundation/AlertBar';
import { ReactNode, useEffect } from 'react';
import { ChatErrorBoundary } from '../components/ChatErrorBoundary';
import { useChatStore } from '../stores/chatStore';

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { error, reset } = useChatStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  if (error) {
    return (
      <div className="p-4">
        <AlertBar alerts={[error.message]} />
      </div>
    );
  }

  return <ChatErrorBoundary onReset={reset}>{children}</ChatErrorBoundary>;
}

export { useChatStore };
