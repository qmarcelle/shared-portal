import React, { createContext, useMemo } from 'react';
import { ChatService } from '../services/ChatService';

/**
 * Creates a context for the chat service to allow
 * component-level access to chat functionality.
 */
export const ChatServiceContext = createContext<ChatService | null>(null);

interface ChatServiceProviderProps {
  children: React.ReactNode;
  memberId: string;
  planId: string;
  planName: string;
  hasMultiplePlans: boolean;
  onLockPlanSwitcher: (locked: boolean) => void;
}

/**
 * Provider component for the chat service.
 * This component creates and provides a ChatService instance to its children.
 */
export function ChatServiceProvider({
  children,
  memberId,
  planId,
  planName,
  hasMultiplePlans,
  onLockPlanSwitcher,
}: ChatServiceProviderProps): JSX.Element {
  const chatService = useMemo(
    () =>
      new ChatService(
        memberId,
        planId,
        planName,
        hasMultiplePlans,
        onLockPlanSwitcher,
      ),
    [memberId, planId, planName, hasMultiplePlans, onLockPlanSwitcher],
  );

  return (
    <ChatServiceContext.Provider value={chatService}>
      {children}
    </ChatServiceContext.Provider>
  );
}
