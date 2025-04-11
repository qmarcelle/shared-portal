// Main chat widget component
export { ChatWidget } from './components/ChatWidget';

// Services
export { ChatService } from './services';

// Hooks
export { useChat } from './hooks/useChat';
export type { UseChatOptions } from './hooks/useChat';
export { useChatEligibility } from './hooks/useChatEligibility';
export { useChatService } from './hooks/useChatService';

// Types
export type {
  BusinessHours,
  ChatDataPayload,
  ChatError,
  ChatInfoResponse,
  ChatMessage,
  ChatSession,
  ChatState,
  ChatWidgetProps,
  IChatService,
  PlanInfo,
  UseChatReturn,
  UserInfo,
} from './types/index';
