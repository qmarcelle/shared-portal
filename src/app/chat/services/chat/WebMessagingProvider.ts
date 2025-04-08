import { createWebMessagingConfig } from '../config/web-messaging';
import { ChatError, ChatErrorCodes } from '../models/errors';
import {
  GenesysGlobal,
  GenesysUserData,
  GenesysWidgetConfig,
} from '../models/types';

export class WebMessagingProvider {
  private config: GenesysWidgetConfig | null = null;
  private container: HTMLDivElement | null = null;
  private genesys: GenesysGlobal | null = null;

  constructor() {
    // Initialize container
    this.container = document.createElement('div');
    this.container.id = 'genesys-chat-container';
    document.body.appendChild(this.container);
  }

  async initialize(userData: Partial<GenesysUserData>): Promise<void> {
    try {
      if (!this.container) {
        throw new ChatError(
          'Chat container not found',
          ChatErrorCodes.INITIALIZATION_ERROR,
          'error',
        );
      }

      // Create configuration
      this.config = createWebMessagingConfig(this.container, userData);

      // Initialize Genesys Web Messenger
      const win = window as unknown as Window & { Genesys?: GenesysGlobal };
      this.genesys = win.Genesys || null;

      if (!this.genesys) {
        throw new ChatError(
          'Genesys Web Messenger not loaded',
          ChatErrorCodes.INITIALIZATION_ERROR,
          'error',
        );
      }

      // Initialize the widget
      await this.genesys.Chat.createChatWidget(this.config);

      // Subscribe to events
      this.subscribeToEvents();
    } catch (error) {
      throw new ChatError(
        'Failed to initialize Web Messaging',
        ChatErrorCodes.INITIALIZATION_ERROR,
        'error',
        error as Error,
      );
    }
  }

  private subscribeToEvents(): void {
    if (!this.genesys) return;

    this.genesys.Chat.on('ready', () => {
      console.log('Web Messenger ready');
    });

    this.genesys.Chat.on('error', (error: unknown) => {
      console.error('Web Messenger error:', error);
    });

    this.genesys.Chat.on('disconnect', () => {
      console.log('Web Messenger disconnected');
    });
  }

  async disconnect(): Promise<void> {
    try {
      if (this.genesys?.Chat) {
        await this.genesys.Chat.endSession();
      }

      // Clean up container
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
        this.container = null;
      }

      this.config = null;
      this.genesys = null;
    } catch (error) {
      throw new ChatError(
        'Failed to disconnect Web Messaging',
        ChatErrorCodes.CHAT_END_ERROR,
        'error',
        error as Error,
      );
    }
  }

  async sendMessage(message: string): Promise<void> {
    try {
      if (!this.genesys?.Chat) {
        throw new ChatError(
          'Chat not initialized',
          ChatErrorCodes.MESSAGE_ERROR,
          'error',
        );
      }

      await this.genesys.Chat.sendMessage(message);
    } catch (error) {
      throw new ChatError(
        'Failed to send message',
        ChatErrorCodes.MESSAGE_ERROR,
        'error',
        error as Error,
      );
    }
  }

  async updateUserData(userData: Partial<GenesysUserData>): Promise<void> {
    try {
      if (!this.genesys?.Chat || !this.config) {
        throw new ChatError(
          'Chat not initialized',
          ChatErrorCodes.INITIALIZATION_ERROR,
          'error',
        );
      }

      // Update configuration
      this.config.userData = {
        ...this.config.userData,
        ...userData,
      };

      // Convert GenesysUserData to Record<string, string | number | boolean>
      const userDataRecord: Record<string, string | number | boolean> =
        Object.entries(this.config.userData).reduce(
          (acc, [key, value]) => {
            if (
              typeof value === 'string' ||
              typeof value === 'number' ||
              typeof value === 'boolean'
            ) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, string | number | boolean>,
        );

      // Update user data in the widget
      await this.genesys.Chat.updateUserData(userDataRecord);
    } catch (error) {
      throw new ChatError(
        'Failed to update user data',
        ChatErrorCodes.INITIALIZATION_ERROR,
        'error',
        error as Error,
      );
    }
  }
}
