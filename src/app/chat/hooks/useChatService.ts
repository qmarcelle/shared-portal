import { useContext } from 'react';
import { ChatServiceContext } from '../context/ChatServiceContext';
import type { ChatService } from '../types';

export function useChatService(): ChatService {
  const chatService = useContext(ChatServiceContext);

  if (!chatService) {
    throw new Error('useChatService must be used within a ChatServiceProvider');
  }

  return chatService;
}
