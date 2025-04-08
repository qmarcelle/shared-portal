import { ChatError } from '../models/errors';
import type { ChatProvider, LegacyOnPremConfig } from '../models/types';
import * as chatAPI from '../services/chatAPI';

export class LegacyOnPremProvider implements ChatProvider {
  private config: LegacyOnPremConfig;
  private isInitialized = false;
  private sessionId: string | null = null;

  constructor(config: LegacyOnPremConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      // Legacy provider just needs to validate config
      if (!this.config.endPoint || !this.config.token) {
        throw new ChatError(
          'Invalid legacy provider configuration',
          'INITIALIZATION_ERROR',
          'error',
        );
      }
      this.isInitialized = true;
    } catch (error) {
      throw ChatError.fromError(error, 'INITIALIZATION_ERROR');
    }
  }

  async startChat(): Promise<void> {
    if (!this.isInitialized) {
      throw new ChatError(
        'Provider not initialized',
        'NOT_INITIALIZED',
        'error',
      );
    }
    try {
      const session = await chatAPI.startChatSession(this.config.planId, {
        firstName: this.config.memberFirstname,
        lastName: this.config.memberLastname,
      });
      this.sessionId = session.id;
    } catch (error) {
      throw ChatError.fromError(error, 'CHAT_START_ERROR');
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isInitialized || !this.sessionId) {
      return;
    }
    try {
      await chatAPI.endChatSession(this.sessionId);
      this.sessionId = null;
      this.isInitialized = false;
    } catch (error) {
      throw ChatError.fromError(error, 'CHAT_END_ERROR');
    }
  }

  async sendMessage(text: string): Promise<void> {
    if (!this.isInitialized || !this.sessionId) {
      throw new ChatError(
        'Provider not initialized',
        'NOT_INITIALIZED',
        'error',
      );
    }
    try {
      await chatAPI.sendChatMessage(this.sessionId, text);
    } catch (error) {
      throw ChatError.fromError(error, 'MESSAGE_ERROR');
    }
  }

  async handlePlanSwitch(newPlanId: string): Promise<void> {
    if (!this.isInitialized || !this.sessionId) {
      throw new ChatError(
        'Provider not initialized',
        'NOT_INITIALIZED',
        'error',
      );
    }
    try {
      // End current session and start new one with new plan
      await this.disconnect();
      this.config.planId = newPlanId;
      await this.startChat();
    } catch (error) {
      throw ChatError.fromError(error, 'PLAN_SWITCH_ERROR');
    }
  }
}
