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

import type { ChatMessage, GenesysBus } from '../types/genesys.types';

/**
 * @deprecated Use Web Messaging instead. Legacy chat.js will be discontinued.
 * See: https://help.mypurecloud.com/articles/legacy-widgets-chat-js-deprecation/
 */
export class GenesysWidgetBus {
  private static instance: GenesysWidgetBus;
  private bus: GenesysBus;
  private initialized = false;
  private isCloud = false;
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
      const cloudMessenger = window.Genesys;

      if (!widgets?.bus && !cloudMessenger) {
        throw new Error('Genesys implementation not found');
      }

      GenesysWidgetBus.instance = new GenesysWidgetBus(
        (widgets?.bus as unknown as GenesysBus) || cloudMessenger,
      );
      GenesysWidgetBus.instance.isCloud = !!cloudMessenger;
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

    this.initialized = true;
  }

  public command(command: string, options?: unknown): void {
    const mappedCommand = this.isCloud
      ? this.mapToCloudCommand(command)
      : command;

    if (this.isCloud && window.Genesys) {
      window.Genesys('command', mappedCommand, options);
    } else {
      this.bus.runtime.command(mappedCommand, options);
    }
  }

  public subscribe<T = ChatMessage>(
    event: string,
    callback: (data: T) => void,
  ): void {
    const mappedEvent = this.isCloud ? this.mapToCloudEvent(event) : event;

    if (this.isCloud && window.Genesys) {
      window.Genesys(
        'subscribe',
        mappedEvent,
        callback as (data: unknown) => void,
      );
    } else {
      this.bus.runtime.subscribe(
        mappedEvent,
        callback as (data: unknown) => void,
      );
    }
  }

  public unsubscribe(event: string): void {
    const mappedEvent = this.isCloud ? this.mapToCloudEvent(event) : event;

    if (this.isCloud && window.Genesys) {
      window.Genesys('unsubscribe', mappedEvent);
    } else if (this.bus.runtime.unsubscribe) {
      this.bus.runtime.unsubscribe(mappedEvent);
    }
  }

  private mapToCloudCommand(legacyCommand: string): string {
    const commandMap: Record<string, string> = {
      'WebChat.open': 'Messenger.open',
      'WebChat.close': 'Messenger.close',
      'WebChat.minimize': 'Messenger.minimize',
      'WebChat.maximize': 'Messenger.maximize',
      'WebChat.startChat': 'Messenger.start',
      'WebChat.endChat': 'Messenger.end',
    };
    return commandMap[legacyCommand] || legacyCommand;
  }

  private mapToCloudEvent(legacyEvent: string): string {
    const eventMap: Record<string, string> = {
      ChatStarted: 'conversationStarted',
      ChatEnded: 'conversationEnded',
      MessageReceived: 'messageReceived',
      AgentJoined: 'agentJoined',
      AgentLeft: 'agentLeft',
      TypingStarted: 'typingStarted',
      TypingEnded: 'typingEnded',
    };
    return eventMap[legacyEvent] || legacyEvent;
  }

  public destroy(): void {
    this.subscriptions.clear();
    this.commandQueue = [];
    this.initialized = false;
  }
}
