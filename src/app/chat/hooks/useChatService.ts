import { useContext } from 'react';
import { ChatServiceContext } from '../context/ChatServiceContext';
import { ChatService } from '../services/ChatService';

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
    throw new Error('useChatService must be used within a ChatServiceProvider');
  }

  return chatService;
}
