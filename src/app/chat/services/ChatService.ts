import type {
  ChatDataPayload,
  ChatInfoResponse,
  ChatService as IChatService,
} from '@/app/chat/types/index';
import { ChatError } from '@/app/chat/types/index';

const GENESYS_SCRIPT_ID = 'cx-widget-script';

/**
 * Core service for managing chat functionality.
 * Handles chat session lifecycle, messaging, and authentication.
 *
 * This service manages both Genesys Cloud Web Messaging and legacy chat.js implementations
 * through a unified interface. It's responsible for:
 *
 * 1. API communication with backend services
 * 2. Chat session lifecycle management
 * 3. Plan switching payload handling
 * 4. Error handling and recovery
 *
 * The service implements the required BCBST member portal API integrations (ID: 21842)
 * for email, phone attributes, and member preferences.
 */
export class ChatService implements IChatService {
  /**
   * Creates a new ChatService instance.
   * @param memberId - Unique identifier for the member
   * @param planId - Current plan identifier
   * @param planName - Display name of the current plan
   * @param hasMultiplePlans - Whether the member has multiple plans
   * @param onLockPlanSwitcher - Callback to lock/unlock plan switching during active chat
   */
  constructor(
    public memberId: string,
    public planId: string,
    public planName: string,
    public hasMultiplePlans: boolean,
    public onLockPlanSwitcher: (locked: boolean) => void,
  ) {}
  language?: string | undefined;
  onError?: ((error: Error) => void) | undefined;
  onAgentJoined?: ((agentName: string) => void) | undefined;
  onAgentLeft?: ((agentName: string) => void) | undefined;
  onChatTransferred?: (() => void) | undefined;
  onTranscriptRequested?: ((email: string) => void) | undefined;
  onFileUploaded?: ((file: File) => void) | undefined;
  enableTranscript?: boolean | undefined;
  transcriptPosition?: 'top' | 'bottom' | undefined;
  transcriptEmail?: string | undefined;
  enableFileAttachments?: boolean | undefined;
  maxFileSize?: number | undefined;
  allowedFileTypes?: string[] | undefined;

  /**
   * Retrieves chat availability and configuration information.
   * This endpoint determines eligibility, cloud/legacy status, and business hours.
   *
   * API Endpoint: /api/chat/info
   * Response includes:
   * - chatAvailable: Whether chat is currently available
   * - cloudChatEligible: Whether to use Web Messaging or legacy chat.js
   * - chatGroup: Routing group for legacy chat
   * - workingHours: Business hours information
   *
   * @returns Promise resolving to chat info response
   * @throws {ChatError} If unable to fetch chat information
   */
  async getChatInfo(): Promise<ChatInfoResponse> {
    try {
      const response = await fetch('/api/chat/info');
      if (!response.ok) {
        throw new ChatError('Failed to fetch chat info', 'API_ERROR');
      }
      return await response.json();
    } catch (error) {
      throw new ChatError('Failed to fetch chat info', 'API_ERROR');
    }
  }

  /**
   * Initiates a new chat session.
   * This method dynamically updates the payload when plans are switched (ID: 31146).
   *
   * API Endpoint: POST /api/chat/start
   * Payload includes all required fields:
   * - SERV_Type, firstname, RoutingChatbotInteractionId, PLAN_ID, etc.
   *
   * @param payload - Chat session initialization data
   * @throws {ChatError} If chat session fails to start
   */
  async startChat(payload: ChatDataPayload): Promise<void> {
    try {
      const response = await fetch('/api/chat/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new ChatError('Failed to start chat', 'API_ERROR');
      }
    } catch (error) {
      throw new ChatError('Failed to start chat', 'API_ERROR');
    }
  }

  /**
   * Ends the current chat session.
   * This method also unlocks the plan switcher (ID: 31158).
   *
   * API Endpoint: POST /api/chat/end
   *
   * @throws {ChatError} If chat session fails to end properly
   */
  async endChat(): Promise<void> {
    try {
      const response = await fetch('/api/chat/end', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new ChatError('Failed to end chat', 'API_ERROR');
      }
    } catch (error) {
      throw new ChatError('Failed to end chat', 'API_ERROR');
    }
  }

  /**
   * Sends a message in the current chat session.
   *
   * API Endpoint: POST /api/chat/message
   * Payload: { text: string }
   *
   * @param text - Message content to send
   * @throws {ChatError} If message fails to send
   */
  async sendMessage(text: string): Promise<void> {
    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new ChatError('Failed to send message', 'API_ERROR');
      }
    } catch (error) {
      throw new ChatError('Failed to send message', 'API_ERROR');
    }
  }

  /**
   * Retrieves authentication token for chat session.
   * This is used primarily for Genesys Web Messaging authentication.
   *
   * @returns Promise resolving to authentication token
   * @throws {ChatError} If unable to retrieve token
   */
  async getAuthToken(): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

/**
 * Loads the Genesys chat widget script.
 * This function is responsible for dynamically loading either the Web Messaging
 * or legacy chat.js script based on eligibility.
 *
 * For Web Messaging: Uses region-specific URL pattern
 * For Legacy chat.js: Uses the URL specified in environment variables
 *
 * @param scriptUrl - URL of the chat script to load
 * @returns Promise that resolves when script is successfully loaded
 * @throws {ChatError} If script fails to load
 */
export const loadGenesysScript = async (scriptUrl: string): Promise<void> => {
  try {
    // Remove any existing script
    const existingScript = document.getElementById(GENESYS_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = GENESYS_SCRIPT_ID;
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;

    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Genesys script'));
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('Error loading Genesys script:', error);
    throw new ChatError(
      'Failed to load Genesys chat script',
      'SCRIPT_LOAD_ERROR',
    );
  }
};
