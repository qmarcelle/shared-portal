import { ChatError, ChatErrorCodes } from '../models/errors';
import { ChatPlan, ChatSession, GenesysWindow } from '../models/types';
import { ChatService } from './ChatService';

export class LegacyPlanSwitchService {
  private chatService: ChatService;
  private currentSession: ChatSession | null = null;
  private retryAttempts = 0;
  private readonly MAX_RETRY_ATTEMPTS = 3;

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  /**
   * Handles plan switching with state persistence and error recovery
   */
  async handlePlanSwitch(newPlan: ChatPlan): Promise<void> {
    try {
      // Store current session state before switching
      this.currentSession = await this.chatService.getCurrentSession();

      // End current chat session gracefully
      await this.endCurrentSession();

      // Update JWT with new plan
      await this.updateJWTWithNewPlan(newPlan);

      // Initialize new session with stored state
      await this.initializeNewSession(newPlan);

      // Reset retry attempts on success
      this.retryAttempts = 0;
    } catch (error) {
      await this.handleSwitchError(error, newPlan);
    }
  }

  private async endCurrentSession(): Promise<void> {
    try {
      // Check if there's an active chat
      const win = window as unknown as GenesysWindow;
      if (win.Genesys?.Chat) {
        await new Promise<void>((resolve) => {
          win.Genesys.Chat?.endSession();
          resolve();
        });
      }

      await this.chatService.disconnect();
    } catch (error) {
      throw new ChatError(
        'Failed to end current chat session',
        ChatErrorCodes.CHAT_END_ERROR,
        'error',
      );
    }
  }

  private async updateJWTWithNewPlan(newPlan: ChatPlan): Promise<void> {
    try {
      await this.chatService.refreshToken({
        planId: newPlan.id,
        groupId: newPlan.groupId,
        memberId: newPlan.memberId,
      });
    } catch (error) {
      throw new ChatError(
        'Failed to update authentication for new plan',
        ChatErrorCodes.AUTH_ERROR,
        'error',
      );
    }
  }

  private async initializeNewSession(newPlan: ChatPlan): Promise<void> {
    try {
      // Initialize with new plan data
      await this.chatService.initialize({
        config: {
          type: 'legacy',
          planId: newPlan.id,
          groupId: newPlan.groupId,
          memberId: newPlan.memberId,
          planName: newPlan.name,
          businessHours: newPlan.businessHours,
          endPoint: this.currentSession?.config?.endPoint || '',
          token: this.currentSession?.config?.token || '',
          opsPhone: this.currentSession?.config?.opsPhone || '',
          memberFirstname: newPlan.memberFirstname || '',
          memberLastname: newPlan.memberLastname || '',
          environment: 'production',
        },
        jwt: this.currentSession?.jwt || {
          token: '',
          userID: '',
          planId: '',
          userRole: '',
          groupId: '',
          subscriberId: '',
          currUsr: {
            umpi: '',
            role: '',
            firstName: '',
            lastName: '',
            plan: undefined,
          },
        },
        userInfo: {
          firstName: newPlan.memberFirstname || '',
          lastName: newPlan.memberLastname || '',
        },
      });

      // Restore relevant session state
      if (this.currentSession?.preferences) {
        await this.chatService.updatePreferences(
          this.currentSession.preferences,
        );
      }
    } catch (error) {
      throw new ChatError(
        'Failed to initialize new chat session',
        ChatErrorCodes.INITIALIZATION_ERROR,
        'error',
      );
    }
  }

  private async handleSwitchError(
    error: unknown,
    newPlan: ChatPlan,
  ): Promise<void> {
    this.retryAttempts++;

    // Log the error for monitoring
    console.error('Plan switch error:', error);

    if (this.retryAttempts < this.MAX_RETRY_ATTEMPTS) {
      // Retry the switch with exponential backoff
      const backoffMs = Math.pow(2, this.retryAttempts) * 1000;
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
      await this.handlePlanSwitch(newPlan);
    } else {
      // If max retries reached, try to restore previous session
      try {
        if (this.currentSession) {
          await this.initializeNewSession(this.currentSession.plan);
        }
        throw new ChatError(
          'Failed to switch plans after multiple attempts. Previous session restored.',
          ChatErrorCodes.PLAN_SWITCH_ERROR,
          'warning',
        );
      } catch (restoreError) {
        throw new ChatError(
          'Failed to switch plans and restore previous session. Please refresh the page.',
          ChatErrorCodes.INITIALIZATION_ERROR,
          'error',
        );
      }
    }
  }
}
