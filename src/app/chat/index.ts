// Main chat widget component
export { ChatWidget } from './components/core/ChatWidget';

// Types
export type { ChatWidgetProps } from './components/core/ChatWidget';
export type { ChatError } from './types/errors';
export type { ChatMessage, ChatPlan, ChatSession } from './types/types';

// Hooks
export { useChat } from './hooks/useChat';
export { useChatStore } from './stores/chatStore';

// Configuration
export { ENV_CONFIG, FEATURES, chatConfig } from './config';

// Services
export { ChatAuthService } from './services/ChatAuthService';
export { ChatService } from './services/ChatService';
