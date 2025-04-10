import { create } from 'zustand';
import type {
  ChatDataPayload,
  ChatInfoResponse,
  ChatServiceConfig,
  ChatState,
  IChatService,
} from '../types';
import { ChatError } from '../types';

const defaultConfig: ChatServiceConfig = {
  deploymentId: '',
  region: '',
  planId: '',
  businessHours: {
    format: 'DAY_DAY_HOUR_HOUR',
    value: '09:00-17:00',
    timezone: 'America/New_York',
  },
};

const initialState: ChatState = {
  isOpen: false,
  isInChat: false,
  messages: [],
  currentPlan: null,
  error: null,
  isPlanSwitcherLocked: false,
  session: null,
};

class ChatServiceImpl implements IChatService {
  private config: ChatServiceConfig;
  private store;

  constructor(config: ChatServiceConfig = defaultConfig) {
    this.config = config;
    this.store = create<ChatState>(() => initialState);
  }

  async startChat(_payload: ChatDataPayload): Promise<void> {
    try {
      // Implementation details would go here
      throw new ChatError('Not implemented', 'CHAT_START_ERROR');
    } catch (error) {
      if (error instanceof ChatError) {
        throw error;
      }
      throw new ChatError('Failed to start chat', 'CHAT_START_ERROR');
    }
  }

  async endChat(): Promise<void> {
    try {
      // Implementation details would go here
      throw new ChatError('Not implemented', 'CHAT_END_ERROR');
    } catch (error) {
      if (error instanceof ChatError) {
        throw error;
      }
      throw new ChatError('Failed to end chat', 'CHAT_END_ERROR');
    }
  }

  async sendMessage(_text: string): Promise<void> {
    try {
      // Implementation details would go here
      throw new ChatError('Not implemented', 'MESSAGE_ERROR');
    } catch (error) {
      if (error instanceof ChatError) {
        throw error;
      }
      throw new ChatError('Failed to send message', 'MESSAGE_ERROR');
    }
  }

  async getChatInfo(): Promise<ChatInfoResponse> {
    try {
      // Implementation details would go here
      throw new ChatError('Not implemented', 'INITIALIZATION_ERROR');
    } catch (error) {
      if (error instanceof ChatError) {
        throw error;
      }
      throw new ChatError('Failed to get chat info', 'INITIALIZATION_ERROR');
    }
  }
}

export const ChatService = new ChatServiceImpl();

// Load Genesys script
export function loadGenesysScript(scriptUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) {
      resolve();
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error(`Failed to load script: ${scriptUrl}`));

    document.head.appendChild(script);
  });
}
