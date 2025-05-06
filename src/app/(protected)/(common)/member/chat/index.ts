/**
 * Chat Module Exports
 * Centralizes all chat-related exports for easier imports
 */

// Components
export { ChatTrigger } from './components/ChatTrigger';
export { ChatWidget } from './components/ChatWidget';
export { ChatErrorBoundary } from './components/shared/ChatErrorBoundary';

// Hooks
export { useChatService } from './hooks/useChatService';

// Context
export {
  ChatServiceContext,
  ChatServiceProvider,
} from './context/ChatServiceContext';

// Types
export type {
  ChatDataPayload,
  ChatError,
  ChatInfoResponse,
  ChatMessage,
  ChatService as ChatServiceType,
  ChatState,
  UseChatReturn,
} from './types/index';
