// Export all chat-related types
export type {
  CobrowseConfig,
  CobrowseInitResponse,
  CobrowseSession,
  CobrowseSessionResponse,
} from './cobrowse';

// Make sure the ChatMessage type is consistent by defining it inline here
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
}

export * from './plans';
export type {
  ChatEligibility,
  ChatPayload,
  ChatSession,
  ChatSessionJWT,
  ChatState,
  PlanSwitcherState,
} from './session';
export type {
  BusinessDay,
  BusinessHours,
  ChatConfig,
  ChatOption,
  CobrowseState,
  UserEligibility,
} from './types';
