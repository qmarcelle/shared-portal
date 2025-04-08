/**
 * Unified Chat Provider
 * Handles both legacy and web messaging implementations through a single interface
 */

import { ChatError, ChatErrorCodes } from '../models/errors';
import type {
  ChatMessage,
  ChatPlan,
  ChatSession,
  GenesysGlobal,
  GenesysUserData,
  GenesysWidgetConfig,
  ProviderConfig,
} from '../models/types';

export class ChatProvider {
  private config: ProviderConfig;
  private container: HTMLDivElement | null = null;
  private genesys: GenesysGlobal | null = null;
  private currentSession: ChatSession | null = null;

  constructor(config: ProviderConfig) {
    this.config = config;
    if (typeof window !== 'undefined') {
      this.container = document.createElement('div');
      this.container.id = 'genesys-chat-container';
      document.body.appendChild(this.container);
    }
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

      const widgetConfig = this.createWidgetConfig(userData);
      await this.initializeProvider(widgetConfig);
      this.subscribeToEvents();
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.INITIALIZATION_ERROR);
    }
  }

  private createWidgetConfig(
    userData: Partial<GenesysUserData>,
  ): GenesysWidgetConfig {
    return {
      dataURL: this.config.endPoint,
      userData: {
        ...userData,
        memberId: userData.memberId,
        planId: userData.planId,
        groupId: userData.groupId,
      },
      containerEl: this.container!,
      headerConfig: {
        title: 'Chat with us',
        closeButton: true,
        minimizeButton: true,
      },
      styling: {
        primaryColor: '#0066CC',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
      },
      features: {
        typing: true,
      },
    };
  }

  private async initializeProvider(config: GenesysWidgetConfig): Promise<void> {
    const win = window as unknown as Window & { Genesys?: GenesysGlobal };
    this.genesys = win.Genesys || null;

    if (!this.genesys?.Chat) {
      throw new ChatError(
        'Genesys API not available',
        ChatErrorCodes.INITIALIZATION_ERROR,
        'error',
      );
    }

    await this.genesys.Chat.createChatWidget(config);
  }

  private subscribeToEvents(): void {
    if (!this.genesys?.Chat) return;

    this.genesys.Chat.on('ready', this.handleReady.bind(this));
    this.genesys.Chat.on('error', this.handleError.bind(this));
    this.genesys.Chat.on('disconnect', this.handleDisconnect.bind(this));
    this.genesys.Chat.on('message', (data: unknown) => {
      if (this.isValidChatMessage(data)) {
        this.handleMessage(data);
      }
    });
  }

  private isValidChatMessage(data: unknown): data is ChatMessage {
    return (
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      'content' in data &&
      'sender' in data &&
      'timestamp' in data
    );
  }

  private handleReady(): void {
    console.log('Chat widget ready');
  }

  private handleError(error: unknown): void {
    console.error('Chat error:', error);
  }

  private handleDisconnect(): void {
    console.log('Chat disconnected');
    this.currentSession = null;
  }

  private handleMessage(message: ChatMessage): void {
    if (this.currentSession) {
      this.currentSession.messages.push(message);
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.genesys?.Chat) {
        await this.genesys.Chat.endSession();
      }

      if (this.container?.parentNode) {
        this.container.parentNode.removeChild(this.container);
        this.container = null;
      }

      this.currentSession = null;
      this.genesys = null;
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.CHAT_END_ERROR);
    }
  }

  async sendMessage(message: string): Promise<string> {
    try {
      if (!this.genesys?.Chat) {
        throw new ChatError(
          'Chat not initialized',
          ChatErrorCodes.MESSAGE_ERROR,
          'error',
        );
      }

      const response = await this.genesys.Chat.sendMessage(message);
      return typeof response === 'string' ? response : crypto.randomUUID();
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.MESSAGE_ERROR);
    }
  }

  async updateUserData(userData: Partial<GenesysUserData>): Promise<void> {
    try {
      if (!this.genesys?.Chat) {
        throw new ChatError(
          'Chat not initialized',
          ChatErrorCodes.INITIALIZATION_ERROR,
          'error',
        );
      }

      await this.genesys.Chat.updateUserData(userData);
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.INITIALIZATION_ERROR);
    }
  }

  async handlePlanSwitch(newPlan: ChatPlan): Promise<void> {
    try {
      // Store current session
      const previousSession = this.currentSession;

      // End current session
      await this.disconnect();

      // Initialize new session with new plan
      await this.initialize({
        memberId: newPlan.memberId,
        planId: newPlan.id,
        groupId: newPlan.groupId,
        firstName: newPlan.memberFirstname,
        lastName: newPlan.memberLastname,
      });

      // Restore relevant session state
      if (previousSession?.preferences) {
        await this.updateUserData({
          preferences: previousSession.preferences,
        });
      }
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.PLAN_SWITCH_ERROR);
    }
  }

  getCurrentSession(): ChatSession | null {
    return this.currentSession;
  }
}
