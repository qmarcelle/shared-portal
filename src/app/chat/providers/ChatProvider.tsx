'use client';

import { AlertBar } from '@/components/foundation/AlertBar';
import { ReactNode, useEffect } from 'react';
import { ChatErrorBoundary } from '../components/shared/ChatErrorBoundary';
import { useChatStore } from '../stores/chatStore';
import { ChatProviderFactory } from './ChatProviderFactory';

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { error, clearSession, setError, closeChat } = useChatStore();

  // Reset function to reset the store state
  const resetStore = () => {
    clearSession();
    setError(null);
    closeChat();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetStore();
    };
  }, []);

  if (error) {
    return (
      <div className="p-4">
        <AlertBar alerts={[error.message]} />
      </div>
    );
  }

  return (
    <ChatErrorBoundary onReset={resetStore}>
      <ChatProviderFactory>{children}</ChatProviderFactory>
    </ChatErrorBoundary>
  );
}

export { useChatStore };
