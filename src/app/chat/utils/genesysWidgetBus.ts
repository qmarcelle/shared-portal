/**
 * @deprecated Genesys is deprecating ACD Web Chat v2. Please migrate to Web Messaging.
 * See: https://help.mypurecloud.com/articles/legacy-widgets-chat-js-deprecation/
 */

/**
 * Genesys Widget Event Bus Utilities
 *
 * This module provides a unified interface for interacting with both Genesys Cloud
 * Web Messaging and legacy chat.js event systems. It handles:
 *
 * 1. Event Subscription:
 *    - Unified event registration
 *    - Event normalization
 *    - Cleanup management
 *
 * 2. Command Execution:
 *    - Chat window controls
 *    - Message handling
 *    - State management
 *
 * Event Mapping:
 * Cloud Implementation -> Legacy Implementation
 * - 'conversationStarted' -> 'ChatStarted'
 * - 'conversationEnded' -> 'ChatEnded'
 * - 'messageReceived' -> 'MessageReceived'
 * - 'agentJoined' -> 'AgentJoined'
 * - 'agentLeft' -> 'AgentLeft'
 * - 'typingStarted' -> 'TypingStarted'
 * - 'typingEnded' -> 'TypingEnded'
 *
 * Command Mapping:
 * Cloud Implementation -> Legacy Implementation
 * - 'Messenger.open' -> 'WebChat.open'
 * - 'Messenger.close' -> 'WebChat.close'
 * - 'Messenger.minimize' -> 'WebChat.minimize'
 * - 'Messenger.maximize' -> 'WebChat.maximize'
 *
 * Integration Requirements:
 * 1. Event Handlers:
 *    - Must handle both implementation's event formats
 *    - Should normalize data to common format
 *    - Must clean up subscriptions
 *
 * 2. Error Handling:
 *    - Handle missing implementations
 *    - Manage subscription failures
 *    - Handle command failures
 *
 * 3. State Management:
 *    - Track active subscriptions
 *    - Manage cleanup on unmount
 *    - Handle reconnection scenarios
 *
 * Usage Examples:
 * ```typescript
 * // Subscribe to events
 * subscribeToGenesysEvent('WebChat.ready', () => {
 *   console.log('Chat is ready');
 * });
 *
 * // Execute commands
 * triggerGenesysCommand('WebChat.open');
 *
 * // Register enhancements
 * registerChatEnhancements();
 * ```
 */

import type { ChatMessage, GenesysBus } from '../types/genesys.d';

/**
 * @deprecated Use Web Messaging instead. Legacy chat.js will be discontinued.
 * See: https://help.mypurecloud.com/articles/legacy-widgets-chat-js-deprecation/
 */
export class GenesysWidgetBus {
  private static instance: GenesysWidgetBus;
  private bus: GenesysBus;
  private initialized = false;
  private subscriptions = new Map<string, (data: unknown) => void>();
  private commandQueue: Array<{
    command: string;
    options?: Record<string, unknown>;
  }> = [];

  private constructor(bus: GenesysBus) {
    this.bus = bus;
  }

  static getInstance(): GenesysWidgetBus {
    if (!GenesysWidgetBus.instance) {
      const widgets = window._genesys?.widgets;
      if (!widgets?.bus) {
        throw new Error('Genesys widgets bus not found');
      }
      GenesysWidgetBus.instance = new GenesysWidgetBus(
        widgets.bus as GenesysBus,
      );
    }
    return GenesysWidgetBus.instance;
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    // Process any queued commands
    while (this.commandQueue.length > 0) {
      const cmd = this.commandQueue.shift();
      if (cmd) {
        await this.command(cmd.command, cmd.options);
      }
    }
  }

  public command(command: string, options?: unknown): void {
    this.bus.runtime.command(command, options);
  }

  public subscribe(event: string, callback: (data: ChatMessage) => void): void {
    this.bus.runtime.subscribe(event, callback as (data: unknown) => void);
  }

  public unsubscribe(event: string): void {
    if (this.bus.runtime.unsubscribe) {
      this.bus.runtime.unsubscribe(event);
    }
  }

  async startChat(message?: ChatMessage): Promise<void> {
    await this.command('WebChat.startChat', {
      data: {
        customData: message?.customData,
        customFields: message?.customFields,
      },
    });
  }

  async endChat(): Promise<void> {
    await this.command('WebChat.endChat');
  }

  public destroy(): void {
    this.subscriptions.clear();
    this.commandQueue = [];
    this.initialized = false;
  }
}
