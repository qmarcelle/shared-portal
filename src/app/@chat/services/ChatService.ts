// import type { ChatDataPayload, ChatError } from '../../../global.d';
import '../../../global.d.ts';

// Define IChatService as a minimal interface if only used here
export interface IChatService {
  startChat(payload: ChatDataPayload): Promise<void>;
  endChat(): Promise<void>;
  sendMessage(text: string): Promise<void>;
  // Add other methods as needed
}

import { logger } from '@/utils/logger';
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

// --- Chat Types (local copy for ChatService) ---
type ChatDataPayload = {
  PLAN_ID: string;
  GROUP_ID: string;
  LOB: string;
  lob_group: string;
  IsMedicalEligibile: boolean;
  IsDentalEligible: boolean;
  IsVisionEligible: boolean;
  Origin: string;
  Source: string;
  [key: string]: any;
};

class ChatError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = 'ChatError';
    this.code = code;
  }
}

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
   * Initializes the chat service by:
   * 1. Using configuration from GenesysScripts component
   * 2. Loading appropriate Genesys script
   * 3. Setting up event listeners
   * 4. Configuring authentication
   *
   * @throws {ChatError} If initialization fails
   */
  public async initialize(cloudChatEligible: boolean): Promise<void> {
    try {
      // Initialize only once - central control point for Genesys initialization
      if (typeof window !== 'undefined' && window.__genesysInitialized) {
        logger.info('Genesys already initialized, skipping initialization', {
          cloudChatEligible,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (typeof window !== 'undefined') {
        window.__genesysInitialized = true;
      }

      logger.info('Initializing chat service', {
        cloudChatEligible,
        memberId: this.memberId,
        planId: this.planId,
        timestamp: new Date().toISOString(),
      });

      // Get a fresh auth token before initializing
      const res = await fetch('/api/chat/token');
      const data = await res.json();
      this.authToken = data.token || null;

      // Use the eligibility passed in
      this.cloudChatEligible = cloudChatEligible;

      // Check if GenesysScripts has already set up the config objects
      const isGenesysConfigured = this.cloudChatEligible
        ? !!window.Genesys?.c
        : !!window._genesys?.c;

      if (!isGenesysConfigured) {
        logger.warn(
          'GenesysScripts component has not set up configuration objects yet',
          {
            timestamp: new Date().toISOString(),
          },
        );
      }

      // Determine the script URL based on chat mode
      const scriptUrl = this.determineScriptUrl();

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
          window.Genesys('command', 'widgets.registerUI', {
            type: 'webmessenger',
            position: 'fixed',
            showChatButton: true,
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
          window.Genesys(
            'subscribe',
            'MessagingService.error',
            (error: any) => {
              logger.error('Web Messenger error:', {
                error,
                timestamp: new Date().toISOString(),
              });

              if (this.onError) {
                this.onError(
                  new Error(`Web Messenger error: ${JSON.stringify(error)}`),
                );
              }
            },
          );

          // Monitor connection events
          window.Genesys(
            'subscribe',
            'MessagingService.connectionStateChanged',
            (state: any) => {
              logger.info('Web Messenger connection state changed:', {
                state,
                timestamp: new Date().toISOString(),
              });
            },
          );
        } else {
          logger.error('Genesys object not available', {
            timestamp: new Date().toISOString(),
          });
          throw new ChatError(
            'Genesys Web Messenger failed to load',
            'INITIALIZATION_ERROR',
          );
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
        initialized: this.initialized,
        timestamp: new Date().toISOString(),
      });

      // Log chat button status after a short delay
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          console.log(
            '✅[Genesys] chat-button found?',
            document.querySelector('.cx-webchat-chat-button'),
          );
        }, 500);
      }
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
   * Determines the script URL based on the chat mode.
   * @returns The URL for the appropriate Genesys script
   */
  private determineScriptUrl(): string {
    if (this.cloudChatEligible) {
      // For cloud mode, use the Genesys Cloud Web Messenger script
      // Use a specific version for better stability
      return `https://apps.mypurecloud.com/widgets/9.0/webmessenger.js`;
    } else {
      // For legacy mode, use the configured legacy chat URL
      return '/assets/genesys/widgets.min.js';
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
        this.initialize(this.cloudChatEligible);
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
      this.initialize(this.cloudChatEligible);
    }
  }

  public destroy(): void {
    logger.info('Destroying chat service', {
      timestamp: new Date().toISOString(),
    });

    window.removeEventListener('offline', this.handleConnectionLoss.bind(this));
    window.removeEventListener(
      'online',
      this.handleConnectionRestore.bind(this),
    );

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

      // Reset the initialization flag
      if (typeof window !== 'undefined') {
        window.__genesysInitialized = false;
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
        throw new ChatError(
          'ChatService.initialize() requires cloudChatEligible argument',
          'INITIALIZATION_ERROR',
        );
      }

      // Ensure we have a valid token
      const res2 = await fetch('/api/chat/token');
      const data2 = await res2.json();
      const token = data2.token || null;
      if (token !== this.authToken) {
        logger.info('Updating auth token', {
          tokenChanged: true,
          timestamp: new Date().toISOString(),
        });
        this.authToken = token;
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
      'genesys-web-messenger-script',
    ];

    possibleScriptIds.forEach((id) => {
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
