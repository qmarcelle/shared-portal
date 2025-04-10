import type { ChatConfig } from './schemas/config';
import type {
  BusinessHours,
  ChatDataPayload,
  ChatInfoResponse,
  GenesysConfig,
  UserInfo,
} from './schemas/user';

// Core Chat Types
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

export interface ChatSession {
  id: string;
  status: 'active' | 'ended';
  startTime: string;
  endTime?: string;
}

// Chat Service Types
export interface IChatService {
  startChat(payload: ChatDataPayload): Promise<void>;
  endChat(): Promise<void>;
  sendMessage(text: string): Promise<void>;
  getChatInfo(): Promise<ChatInfoResponse>;
}

export interface ChatService extends IChatService {
  // Core properties
  memberId: string;
  planId: string;
  planName: string;
  hasMultiplePlans: boolean;
  language?: string;

  // Event handlers
  onError?: (error: Error) => void;
  onLockPlanSwitcher: (locked: boolean) => void;
  onAgentJoined?: (agentName: string) => void;
  onAgentLeft?: (agentName: string) => void;
  onChatTransferred?: () => void;
  onTranscriptRequested?: (email: string) => void;
  onFileUploaded?: (file: File) => void;

  // Configuration
  enableTranscript?: boolean;
  transcriptPosition?: 'top' | 'bottom';
  transcriptEmail?: string;
  enableFileAttachments?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
}

export interface ChatServiceConfig extends GenesysConfig {
  businessHours: BusinessHours;
  defaultPlan?: PlanInfo;
}

// State Management Types
export interface ChatState {
  isOpen: boolean;
  isInChat: boolean;
  messages: ChatMessage[];
  currentPlan: PlanInfo | null;
  error: ChatError | null;
  isPlanSwitcherLocked: boolean;
  session: ChatSession | null;
}

// Plan Management Types
export interface PlanInfo {
  id: string;
  name: string;
  groupId: string;
  description?: string;
  businessHours?: BusinessHours;
  lineOfBusiness?: string;
  hasMultiplePlans?: boolean;
}

// Error Handling Types
export class ChatError extends Error {
  public severity: ErrorSeverity;

  constructor(
    message: string,
    public code: ChatErrorCode,
    severity: ErrorSeverity = 'error',
  ) {
    super(message);
    this.name = 'ChatError';
    this.severity = severity;
  }

  static isChatError(error: unknown): error is ChatError {
    return error instanceof ChatError;
  }

  static fromError(
    error: unknown,
    code: ChatErrorCode = 'INITIALIZATION_ERROR',
  ): ChatError {
    if (error instanceof ChatError) {
      return error;
    }
    const message = error instanceof Error ? error.message : String(error);
    return new ChatError(message, code);
  }
}

export type ChatErrorCode =
  | 'INITIALIZATION_ERROR'
  | 'CHAT_START_ERROR'
  | 'CHAT_END_ERROR'
  | 'MESSAGE_ERROR'
  | 'FILE_UPLOAD_ERROR'
  | 'TRANSCRIPT_ERROR';

export type ErrorSeverity = 'error' | 'warning';

// Component Props Types
export interface ChatWidgetProps {
  onError?: (error: ChatError) => void;
  onSwitchPlan?: () => void;
  className?: string;
  customStyles?: React.CSSProperties;
  config: ChatConfig;
  userData: UserInfo;
}

// Re-export schema types
export type {
  BusinessHours,
  ChatConfig,
  ChatDataPayload,
  ChatInfoResponse,
  GenesysConfig,
  UserInfo,
};

// Add Genesys types to window
declare global {
  interface Window {
    CXBus?: {
      configure: (config: any) => void;
      subscribe: (event: string, handler: (data: any) => void) => void;
      command: (command: string, data?: any) => Promise<any>;
      publishEvent: (event: string, data?: any) => void;
      getState: () => Promise<any>;
      destroy: () => void;
      restart: () => void;
    };
    GenesysChat?: {
      configure: (config: any) => void;
      openChat: () => void;
      closeChat: () => void;
      onSessionStart: () => void;
      onSessionEnd: () => void;
      onError: (error: Error) => void;
      onAgentTyping: (isTyping: boolean) => void;
      onQueueUpdated: (position: number) => void;
      onMessageReceived: (message: any) => void;
      sendMessage: (message: string) => void;
      setLocale: (locale: string) => void;
    };
    analytics?: {
      track(event: string, properties?: Record<string, unknown>): void;
    };
  }
}
