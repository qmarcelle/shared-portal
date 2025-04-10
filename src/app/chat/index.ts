// Main chat widget component
export { ChatWidget } from './components/ChatWidget';

// Types
export type {
  ChatError,
  ChatMessage,
  ChatServiceConfig,
  ChatSession,
} from './types';

// Hooks
export { useChat } from './hooks/useChat';
export type { UseChatOptions } from './hooks/useChat';
export { useChatService } from './hooks/useChatService';

// Services
export { ChatService } from './services/ChatService';

// Configuration
export { getGenesysConfig } from './config/genesys.config';
export type { ChatConfig } from './schemas/config';
