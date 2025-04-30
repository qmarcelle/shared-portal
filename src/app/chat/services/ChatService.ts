import type {
  ChatDataPayload,
  ChatInfoResponse,
  ChatService as IChatService,
} from '@/app/chat/types/index';
import { ChatError } from '@/app/chat/types/index';
import { getAuthToken } from '@/utils/api/getToken';
import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import {
  executeGenesysOverrides,
  registerGenesysOverride,
} from '../utils/chatDomUtils';

/**
 * Constants for chat service configuration
 */
const GENESYS_SCRIPT_ID = 'cx-widget-script';
const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 2000; // 2 seconds

/**
 * API Endpoints from environment variables
 */
const MEMBER_PORTAL_REST_ENDPOINT =
  process.env.NEXT_PUBLIC_MEMBER_PORTAL_REST_ENDPOINT;
const IDCARD_MEMBER_SOA_ENDPOINT =
  process.env.NEXT_PUBLIC_IDCARD_MEMBER_SOA_ENDPOINT;
const MEMBER_PORTAL_SOA_ENDPOINT =
  process.env.NEXT_PUBLIC_MEMBER_PORTAL_SOA_ENDPOINT;

/**
 * ChatService class implements the core chat functionality.
 * Handles both Genesys Cloud Web Messaging and legacy chat.js implementations.
 *
 * Key responsibilities:
 * 1. Chat initialization and script loading
 * 2. Session management and authentication
 * 3. Message handling and state management
 * 4. Error handling and recovery
 * 5. Plan switching support
 */
export class ChatService implements IChatService {
  private cloudChatEligible: boolean = false;
  private initialized: boolean = false;
  private isReconnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private authToken: string | null = null;

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

  constructor(
    public readonly memberId: string,
    public readonly planId: string,
    public readonly planName: string,
    public readonly hasMultiplePlans: boolean,
    public readonly onLockPlanSwitcher: (locked: boolean) => void,
  ) {
    logger.info('ChatService instantiated', {
      memberId,
      planId,
      planName,
      hasMultiplePlans,
      timestamp: new Date().toISOString(),
    });
  }

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
      const response = await memberService.get('/api/chat/info');
      return response.data;
    } catch (error) {
      throw new ChatError('Failed to fetch chat info', 'API_ERROR');
    }
  }

  /**
   * Initializes the chat service by:
   * 1. Checking eligibility
   * 2. Loading appropriate Genesys script
   * 3. Setting up event listeners
   * 4. Configuring authentication
   *
   * @throws {ChatError} If initialization fails
   */
  public async initialize(): Promise<void> {
    try {
      logger.info('Initializing chat service', {
        cloudChatEligible: this.cloudChatEligible,
        memberId: this.memberId,
        planId: this.planId,
        timestamp: new Date().toISOString(),
      });

      const eligibility = await this.getChatInfo();
      this.cloudChatEligible = eligibility.cloudChatEligible;

      const scriptUrl = this.cloudChatEligible
        ? `https://apps.mypurecloud.com/widgets/web-messenger.js`
        : '/assets/genesys/widgets.min.js';

      logger.info('Loading Genesys script', {
        scriptUrl,
        implementation: this.cloudChatEligible ? 'cloud' : 'legacy',
        timestamp: new Date().toISOString(),
      });

      await loadGenesysScript(scriptUrl);

      if (!this.cloudChatEligible) {
        logger.info('Initializing legacy chat', {
          timestamp: new Date().toISOString(),
        });
        // Legacy chat initialization
        registerGenesysOverride(() => {
          if (window._genesys?.widgets?.bus) {
            window._genesys.widgets.bus.command('WebChat.open');
          }
        });
        executeGenesysOverrides();
      } else {
        logger.info('Initializing cloud chat', {
          timestamp: new Date().toISOString(),
        });
        // Cloud chat initialization with JWT
        if (window.Genesys) {
          window.Genesys('subscribe', 'MessagingService.ready', () => {
            logger.info('Messaging service ready', {
              timestamp: new Date().toISOString(),
            });
            if (window.Genesys) {
              window.Genesys('command', 'Messenger.updateAuthToken', {
                token: this.authToken,
              });
            }
            this.initialized = true;
          });
        }
      }

      // Add connection status listener
      window.addEventListener('offline', this.handleConnectionLoss.bind(this));
      window.addEventListener(
        'online',
        this.handleConnectionRestore.bind(this),
      );

      logger.info('Chat service initialized successfully', {
        cloudChatEligible: this.cloudChatEligible,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Failed to initialize chat:', {
        error,
        memberId: this.memberId,
        planId: this.planId,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  /**
   * Handles connection loss events.
   * Implements exponential backoff for reconnection attempts.
   */
  private handleConnectionLoss(): void {
    logger.warn('Connection lost', {
      reconnectAttempts: this.reconnectAttempts,
      timestamp: new Date().toISOString(),
    });

    if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      this.isReconnecting = true;
      const delay = RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts);

      logger.info('Attempting reconnection', {
        attempt: this.reconnectAttempts + 1,
        delay,
        timestamp: new Date().toISOString(),
      });

      setTimeout(() => {
        this.reconnectAttempts++;
        this.initialize();
      }, delay);
    } else {
      logger.error('Max reconnection attempts reached', {
        maxAttempts: MAX_RECONNECT_ATTEMPTS,
        timestamp: new Date().toISOString(),
      });
      this.isReconnecting = false;
    }
  }

  /**
   * Handles connection restoration.
   * Attempts to reinitialize the chat service.
   */
  private handleConnectionRestore(): void {
    logger.info('Connection restored, reinitializing chat...', {
      timestamp: new Date().toISOString(),
    });
    if (this.isReconnecting) {
      this.initialize();
    }
  }

  public destroy(): void {
    window.removeEventListener('offline', this.handleConnectionLoss.bind(this));
    window.removeEventListener(
      'online',
      this.handleConnectionRestore.bind(this),
    );

    if (window.Genesys?.WebMessenger) {
      window.Genesys.WebMessenger.destroy();
    } else if (window.Genesys?.Chat) {
      window.Genesys.Chat.destroy();
    }
  }

  /**
   * Initiates a new chat session.
   * This method dynamically updates the payload when plans are switched.
   *
   * @param payload - Chat session initialization data
   * @throws {ChatError} If chat session fails to start
   */
  async startChat(payload: ChatDataPayload): Promise<void> {
    try {
      logger.info('Starting chat session', {
        payload,
        timestamp: new Date().toISOString(),
      });

      if (!this.initialized) {
        await this.initialize();
      }

      // Ensure we have a valid token
      const token = await getAuthToken();
      if (token !== this.authToken) {
        logger.info('Updating auth token', {
          timestamp: new Date().toISOString(),
        });
        this.authToken = token ?? null;
        if (this.cloudChatEligible && window.Genesys) {
          window.Genesys('command', 'Messenger.updateAuthToken', {
            token: this.authToken,
          });
        }
      }

      if (this.cloudChatEligible && window.Genesys) {
        logger.info('Opening cloud chat messenger', {
          timestamp: new Date().toISOString(),
        });
        window.Genesys('command', 'Messenger.open', {
          data: {
            ...payload,
            jwt: this.authToken,
          },
        });
      } else if (window._genesys?.widgets?.bus) {
        logger.info('Opening legacy chat widget', {
          timestamp: new Date().toISOString(),
        });
        window._genesys.widgets.bus.command('WebChat.startChat', {
          data: {
            ...payload,
            authorization: `Bearer ${this.authToken}`,
          },
        });
      }

      this.onLockPlanSwitcher(true);
      logger.info('Chat session started successfully', {
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Failed to start chat:', {
        error,
        payload,
        timestamp: new Date().toISOString(),
      });
      throw new ChatError('Failed to start chat', 'CHAT_START_ERROR');
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
      if (this.cloudChatEligible && window.Genesys) {
        window.Genesys('command', 'Messenger.close');
      } else if (window._genesys?.widgets?.bus) {
        window._genesys.widgets.bus.command('WebChat.endChat');
      }

      this.onLockPlanSwitcher(false);
    } catch (error) {
      throw new ChatError('Failed to end chat', 'CHAT_END_ERROR');
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

/**
 * Sends an email through the member portal service
 * @param emailData Email data to send
 */
async function sendEmail(emailData: {
  subject: string;
  body: string;
  to: string;
}): Promise<void> {
  try {
    const response = await memberService.post(
      `${MEMBER_PORTAL_REST_ENDPOINT}/memberservice/api/v1/contactusemail`,
      emailData,
    );
    if (response.status !== 200) {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw new ChatError('Failed to send email', 'API_ERROR');
  }
}

/**
 * Gets phone attributes from the ID card service
 */
async function getPhoneAttributes(params: {
  groupId: string;
  subscriberCk: string;
  effectiveDetails: string;
}): Promise<any> {
  try {
    const response = await memberService.get(
      `${IDCARD_MEMBER_SOA_ENDPOINT}OperationHours`,
      { params },
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to get phone attributes:', error);
    throw new ChatError('Failed to get phone attributes', 'API_ERROR');
  }
}

/**
 * Gets member email preferences
 */
async function getEmail(params: {
  memberKey: string;
  subscriberKey: string;
  getMemberPreferenceBy: string;
  memberUserId: string;
  extendedOptions: string;
}): Promise<any> {
  try {
    const response = await memberService.get(
      `${MEMBER_PORTAL_SOA_ENDPOINT}/memberContactPreference`,
      { params },
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to get email preferences:', error);
    throw new ChatError('Failed to get email preferences', 'API_ERROR');
  }
}
