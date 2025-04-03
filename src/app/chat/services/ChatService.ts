import { ChatConfig, ChatMessage, ChatSession } from '../../models/chat';

/**
 * Abstract base service for chat functionality
 */
export abstract class ChatService {
  protected config: ChatConfig;

  constructor(config: ChatConfig) {
    this.config = config;
  }

  /**
   * Initialize a chat session
   */
  abstract initialize(userData: Record<string, string>): Promise<ChatSession>;

  /**
   * Send a message in the active chat session
   */
  abstract sendMessage(message: string): Promise<void>;

  /**
   * Get the chat history for the current session
   */
  abstract getMessages(): Promise<ChatMessage[]>;

  /**
   * Get information about the current session
   */
  abstract getSession(): ChatSession | null;

  /**
   * End the current chat session
   */
  abstract disconnect(): Promise<void>;

  /**
   * Request a transcript of the chat session
   */
  abstract requestTranscript(email: string): Promise<boolean>;
}
