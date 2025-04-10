import { createContext, useContext } from 'react';
import type { ChatService } from '../types';

export const ChatServiceContext = createContext<ChatService | null>(null);

export function useChatService(): ChatService {
  const context = useContext(ChatServiceContext);
  if (!context) {
    throw new Error('useChatService must be used within a ChatServiceProvider');
  }
  return context;
}
