import type {
  ChatDataPayload,
  ChatInfoResponse,
  ChatService as IChatService,
} from '@/app/@chat/types/index';
import { ChatError } from '@/app/@chat/types/index';
import { getAuthToken } from '@/utils/api/getToken';
import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import axios from 'axios';
import {
  executeGenesysOverrides,
  registerGenesysOverride,
} from '../utils/chatDomUtils';

/**
 * Constants for chat service configuration
 */
const GENESYS_SCRIPT_ID = 'genesys-web-messenger-script'; // Changed ID to avoid conflicts
const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 2000; // 2 seconds

/**
 * API Endpoints base URLs from environment variables - Log for debugging
 */
logger.info('Chat Service Environment Variables:', {
  PORTAL_SERVICES_URL: process.env.PORTAL_SERVICES_URL || 'undefined',
  MEMBERSERVICE_CONTEXT_ROOT: process.env.MEMBERSERVICE_CONTEXT_ROOT || 'undefined',
  IDCARDSERVICE_CONTEXT_ROOT: process.env.IDCARDSERVICE_CONTEXT_ROOT || 'undefined',
  MEMBER_PORTAL_SOA_ENDPOINT: process.env.NEXT_PUBLIC_MEMBER_PORTAL_SOA_ENDPOINT || 'undefined',
});

// Store these values without undefined-checking to avoid redundant "||" code everywhere
const PORTAL_SERVICES_URL = process.env.PORTAL_SERVICES_URL || '';
const MEMBERSERVICE_CONTEXT_ROOT = process.env.MEMBERSERVICE_CONTEXT_ROOT || '';
const IDCARDSERVICE_CONTEXT_ROOT = process.env.IDCARDSERVICE_CONTEXT_ROOT || '';
const MEMBER_PORTAL_SOA_ENDPOINT = process.env.NEXT_PUBLIC_MEMBER_PORTAL_SOA_ENDPOINT || '';

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
   * Get member portal REST endpoint URL for the current member
   */
  private getMemberPortalRestEndpoint(): string {
    // Use memberService instead of manually constructing URLs when possible
    return `/api/member/v1/members/byMemberCk/${this.memberId}`;
  }

  /**
   * Get ID card member SOA endpoint
   */
  private getIdCardMemberSoaEndpoint(): string {
    // Return just the path part, memberService will add the base URL
    return `OperationHours`;
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
      // Make sure to include the params for the chat info endpoint
      const response = await memberService.get('/chat/info', {
        params: { memberId: this.memberId, planId: this.planId }
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch chat info', { error });
      throw new ChatError('Failed to fetch chat info', 'API_ERROR');
    }
  }

  /**
   * Initializes the chat service by:
   * 1. Using configuration from GenesysScripts component
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

      // Get a fresh auth token before initializing
      this.authToken = await getAuthToken() ?? null;
      
      // Get eligibility information
      const eligibility = await this.getChatInfo();
      this.cloudChatEligible = eligibility.cloudChatEligible;

      // Check if GenesysScripts has already set up the config objects
      const isGenesysConfigured = this.cloudChatEligible 
        ? !!window.Genesys?.c 
        : !!window._genesys?.c;

      if (!isGenesysConfigured) {
        logger.warn('GenesysScripts component has not set up configuration objects yet', {
          timestamp: new Date().toISOString(),
        });
      }
      
      // Web Messenger script URL - use specific version for better stability
      const scriptUrl = this.cloudChatEligible
        ? `https://apps.mypurecloud.com/widgets/9.0/webmessenger.js`
        : '/assets/genesys/widgets.min.js';

      logger.info('Loading Genesys script', {
        scriptUrl,
        implementation: this.cloudChatEligible ? 'cloud' : 'legacy',
        authTokenPresent: !!this.authToken,
        timestamp: new Date().toISOString(),
      });

      // Load the appropriate script
      await loadGenesysScript(scriptUrl);

      if (!this.cloudChatEligible) {
        // Legacy chat implementation
        logger.info('Initializing legacy chat', {
          timestamp: new Date().toISOString(),
        });
        
        registerGenesysOverride(() => {
          if (window._genesys?.widgets?.bus) {
            window._genesys.widgets.bus.command('WebChat.open');
          }
        });
        executeGenesysOverrides();
      } else {
        // Cloud chat implementation
        logger.info('Initializing cloud chat with Web Messenger', {
          timestamp: new Date().toISOString(),
        });

        // Configure the Web Messenger before subscribing to events
        if (window.Genesys) {
          // Register UI widgets - use configuration from GenesysScripts if available
          window.Genesys("command", "widgets.registerUI", {
            type: "webmessenger",
            position: "fixed",
            showChatButton: true
          });

          // Subscribe to all relevant events for better debugging
          window.Genesys('subscribe', 'MessagingService.ready', () => {
            logger.info('Web Messenger ready', {
              timestamp: new Date().toISOString(),
            });
            
            // Update auth token once the service is ready
            if (this.authToken) {
              logger.info('Updating auth token on messenger ready', {
                timestamp: new Date().toISOString(),
              });
              
              window.Genesys?.('command', 'Messenger.updateAuthToken', {
                token: this.authToken,
              });
            } else {
              logger.warn('No auth token available', {
                timestamp: new Date().toISOString(),
              });
            }
            
            this.initialized = true;
          });
          
          // Add error handlers for better debugging
          window.Genesys('subscribe', 'MessagingService.error', (error) => {
            logger.error('Web Messenger error:', {
              error,
              timestamp: new Date().toISOString(),
            });
            
            if (this.onError) {
              this.onError(new Error(`Web Messenger error: ${JSON.stringify(error)}`));
            }
          });
          
          // Monitor connection events
          window.Genesys('subscribe', 'MessagingService.connectionStateChanged', (state) => {
            logger.info('Web Messenger connection state changed:', {
              state,
              timestamp: new Date().toISOString(),
            });
          });
        } else {
          logger.error('Genesys object not available', {
            timestamp: new Date().toISOString(),
          });
          throw new ChatError('Genesys Web Messenger failed to load', 'INITIALIZATION_ERROR');
        }
      }

      // Add connection status listener
      window.addEventListener('offline', this.handleConnectionLoss.bind(this));
      window.addEventListener('online', this.handleConnectionRestore.bind(this));

      logger.info('Chat service initialized successfully', {
        cloudChatEligible: this.cloudChatEligible,
        initialized: this.initialized,
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
    logger.info('Destroying chat service', {
      timestamp: new Date().toISOString(),
    });
    
    window.removeEventListener('offline', this.handleConnectionLoss.bind(this));
    window.removeEventListener('online', this.handleConnectionRestore.bind(this));

    try {
      if (this.cloudChatEligible) {
        // Clean up Web Messenger
        if (window.Genesys?.WebMessenger) {
          window.Genesys('command', 'Messenger.close');
          window.Genesys.WebMessenger.destroy();
          logger.info('Web Messenger destroyed', {
            timestamp: new Date().toISOString(),
          });
        }
      } else {
        // Clean up legacy chat
        if (window._genesys?.widgets?.bus) {
          window._genesys.widgets.bus.command('WebChat.endChat');
          logger.info('Legacy chat ended', {
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      logger.error('Error during chat service cleanup', {
        error,
        timestamp: new Date().toISOString(),
      });
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
        cloudChatEligible: this.cloudChatEligible,
        initialized: this.initialized,
        timestamp: new Date().toISOString(),
      });

      if (!this.initialized) {
        await this.initialize();
      }

      // Ensure we have a valid token
      const token = await getAuthToken();
      if (token !== this.authToken) {
        logger.info('Updating auth token', {
          tokenChanged: true,
          timestamp: new Date().toISOString(),
        });
        this.authToken = token ?? null;
      }

      if (this.cloudChatEligible && window.Genesys) {
        logger.info('Opening cloud chat messenger', {
          timestamp: new Date().toISOString(),
        });
        
        // First update the auth token
        if (this.authToken) {
          window.Genesys('command', 'Messenger.updateAuthToken', {
            token: this.authToken,
          });
        }
        
        // Register member and plan data before opening messenger
        window.Genesys('registerDataSource', {
          memberId: this.memberId,
          planId: this.planId,
          planName: this.planName,
        });
        
        // Then open the messenger with the payload
        window.Genesys('command', 'Messenger.open', {
          data: {
            ...payload,
            // Add member and plan information for better identification
            memberId: this.memberId,
            planId: this.planId,
            planName: this.planName,
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
    // Remove any existing scripts to avoid conflicts
    const existingScript = document.getElementById(GENESYS_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }
    
    // Also check for other Genesys scripts that might cause conflicts
    const possibleScriptIds = [
      'cx-widget-script', 
      'genesys-bootstrap-script', 
      'genesys-web-messenger-script'
    ];
    
    possibleScriptIds.forEach(id => {
      if (id !== GENESYS_SCRIPT_ID) {
        const script = document.getElementById(id);
        if (script) {
          logger.warn(`Removing potentially conflicting script: ${id}`, {
            timestamp: new Date().toISOString(),
          });
          script.remove();
        }
      }
    });

    const script = document.createElement('script');
    script.id = GENESYS_SCRIPT_ID;
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    
    logger.info(`Loading Genesys script from ${scriptUrl}`, {
      scriptId: GENESYS_SCRIPT_ID,
      timestamp: new Date().toISOString(),
    });

    await new Promise<void>((resolve, reject) => {
      script.onload = () => {
        logger.info(`Genesys script loaded successfully: ${scriptUrl}`, {
          timestamp: new Date().toISOString(),
        });
        resolve();
      };
      script.onerror = (error) => {
        logger.error(`Failed to load Genesys script: ${scriptUrl}`, {
          error,
          timestamp: new Date().toISOString(),
        });
        reject(new Error(`Failed to load Genesys script: ${error}`));
      };
      document.head.appendChild(script);
    });
  } catch (error) {
    logger.error('Error loading Genesys script:', {
      error,
      scriptUrl,
      timestamp: new Date().toISOString(),
    });
    throw new ChatError(
      'Failed to load Genesys chat script',
      'SCRIPT_LOAD_ERROR',
    );
  }
};

/**
 * Sends an email through the member portal service
 * @param memberId The member ID
 * @param emailData Email data to send
 */
async function sendEmail(memberId: string, emailData: {
  subject: string;
  body: string;
  to: string;
}): Promise<void> {
  try {
    // Use memberService directly instead of constructing URLs
    const response = await memberService.post(
      `/api/member/v1/members/byMemberCk/${memberId}/memberservice/api/v1/contactusemail`,
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
    // Use memberService with the correct path - no need to manually construct URL
    const response = await memberService.get(
      `OperationHours`,
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
    // If this is a completely different endpoint URL, use axios directly
    const baseUrl = process.env.NEXT_PUBLIC_MEMBER_PORTAL_SOA_ENDPOINT || '';
    const response = await axios.get(
      `${baseUrl}/memberContactPreference`,
      { params },
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to get email preferences:', error);
    throw new ChatError('Failed to get email preferences', 'API_ERROR');
  }
}
