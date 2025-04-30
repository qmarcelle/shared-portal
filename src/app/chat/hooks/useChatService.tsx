import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { ChatService } from '../services/ChatService';

/**
 * Creates a context for the chat service to allow
 * component-level access to chat functionality.
 */
const ChatServiceContext = createContext<ChatService | null>(null);

/**
 * Custom hook to access the chat service from any component.
 * This hook provides access to the chat service instance for
 * chat operations like starting/ending chats and sending messages.
 * 
 * @returns The current chat service instance
 * @throws Error when used outside of a ChatServiceProvider
 */
export function useChatService(): ChatService {
  const chatService = useContext(ChatServiceContext);
  
  if (!chatService) {
    throw new Error(
      'useChatService must be used within a ChatServiceProvider'
    );
  }
  
  return chatService;
}

/**
 * Provider props interface
 */
interface ChatServiceProviderProps {
  children: ReactNode;
  memberId: string;
  planId: string;
  planName: string;
  hasMultiplePlans: boolean;
  onLockPlanSwitcher: (locked: boolean) => void;
}

/**
 * Provider component for the chat service
 */
export function ChatServiceProvider({
  children,
  memberId,
  planId,
  planName,
  hasMultiplePlans,
  onLockPlanSwitcher,
}: ChatServiceProviderProps) {
  const chatService = useMemo(
    () => new ChatService(
      memberId,
      planId,
      planName,
      hasMultiplePlans,
      onLockPlanSwitcher
    ),
    [memberId, planId, planName, hasMultiplePlans, onLockPlanSwitcher]
  );
  
  return (
    <ChatServiceContext.Provider value={chatService}>
      {children}
    </ChatServiceContext.Provider>
  );
}

// Export the context for advanced use cases
export { ChatServiceContext };
