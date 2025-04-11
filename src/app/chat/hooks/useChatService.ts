import { ChatServiceContext } from '@/app/chat/services';
import type { ChatService } from '@/app/chat/types/index';
import { useContext } from 'react';

export function useChatService(): ChatService {
  const chatService = useContext(ChatServiceContext);

  if (!chatService) {
    throw new Error('useChatService must be used within a ChatServiceProvider');
  }

  return chatService;
}
