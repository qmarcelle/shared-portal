/**
 * Chat Service
 *
 * Main service for handling chat functionality.
 * Supports both legacy on-prem and Genesys cloud implementations.
 */

import {
  LegacyOnPremProvider,
  WebMessagingProvider,
} from '@/app/chat/providers';
import { chatAPI, configureChatAPI } from '@/app/chat/services/api';
import { useChatStore } from '@/app/chat/stores/chatStore';
import type { ChatErrorCode } from '@/app/chat/types/errors';
import { ChatError } from '@/app/chat/types/errors';
import {
  BusinessHours,
  ChatErrorCodes,
  ChatInitOptions,
  ChatMessage,
  ChatPayload,
  ChatPlan,
  ChatSession,
  ErrorSeverity,
  GenesysWebMessagingConfig,
  LegacyOnPremConfig,
  UnifiedChatConfig,
  UserEligibility,
} from '@/app/chat/types/types';

const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  isOpen24x7: false,
  days: [],
  timezone: 'America/New_York',
  isCurrentlyOpen: false,
  lastUpdated: Date.now(),
  source: 'default',
};

export class ChatService {
  private config: UnifiedChatConfig;
  private currentSession: ChatSession | null = null;
  private provider: WebMessagingProvider | LegacyOnPremProvider | null = null;

  constructor(config: UnifiedChatConfig) {
    this.config = config;
    this.initializeProvider();
  }

  private initializeProvider() {
    if (this.isLegacyConfig(this.config)) {
      this.provider = new LegacyOnPremProvider(this.config);
    } else {
      this.provider = new WebMessagingProvider();
    }
    configureChatAPI({
      token: this.config.token || '',
      baseUrl: this.config.endPoint || '',
    });
  }

  private isLegacyConfig(
    config: UnifiedChatConfig,
  ): config is LegacyOnPremConfig {
    return 'type' in config && config.type === 'legacy';
  }

  private throwError(
    message: string,
    code: ChatErrorCode,
    severity: ErrorSeverity = 'error',
    data?: Record<string, unknown>,
  ) {
    const error = new ChatError(message, code, severity);
    if (data) {
      Object.assign(error, { data });
    }
    throw error;
  }

  async initialize(options: ChatInitOptions): Promise<ChatSession> {
    try {
      if (!this.provider) {
        this.throwError(
          'Provider not initialized',
          ChatErrorCodes.NOT_INITIALIZED,
        );
      }

      // Initialize provider with appropriate configuration
      if (this.isLegacyConfig(this.config)) {
        await (this.provider as LegacyOnPremProvider).initialize(options);
      } else {
        await (this.provider as WebMessagingProvider).initialize({
          config: this.config as GenesysWebMessagingConfig,
          userInfo: options.userInfo,
        });
      }

      // Create session using provider's session management
      const sessionId = this.isLegacyConfig(this.config)
        ? await (this.provider as LegacyOnPremProvider).getSessionId()
        : await (this.provider as WebMessagingProvider).getSessionId();

      const newSession: ChatSession = {
        id: sessionId,
        active: true,
        planId: this.config.planId || '',
        planName: this.isLegacyConfig(this.config) ? this.config.planName : '',
        messages: [],
        isPlanSwitchingLocked: false,
        jwt: options.jwt,
        lastUpdated: Date.now(),
        plan: {
          id: this.config.planId || '',
          name: this.isLegacyConfig(this.config) ? this.config.planName : '',
          groupId: '',
          memberId: '',
          businessHours: DEFAULT_BUSINESS_HOURS,
          isEligibleForChat: true,
          lineOfBusiness: 'Medical',
          isActive: true,
        },
      };

      this.currentSession = newSession;
      return newSession;
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.INITIALIZATION_ERROR);
    }
  }

  async startChat(): Promise<void> {
    if (!this.provider || !this.currentSession) {
      this.throwError('Chat not initialized', ChatErrorCodes.NOT_INITIALIZED);
    }

    try {
      if (this.isLegacyConfig(this.config)) {
        await (this.provider as LegacyOnPremProvider).connect();
      } else {
        await (this.provider as WebMessagingProvider).connect();
      }
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.CHAT_START_ERROR);
    }
  }

  async disconnect(): Promise<void> {
    if (!this.provider) {
      return;
    }

    try {
      await this.provider.disconnect();
      this.currentSession = null;
    } catch (error) {
      throw new ChatError(
        'Failed to disconnect chat service',
        ChatErrorCodes.CONNECTION_ERROR,
        'error',
      );
    }
  }

  async sendMessage(text: string): Promise<string> {
    if (!this.provider || !this.currentSession) {
      this.throwError('Chat not initialized', ChatErrorCodes.NOT_INITIALIZED);
    }

    try {
      const messageId = this.isLegacyConfig(this.config)
        ? await (this.provider as LegacyOnPremProvider).sendMessage(text)
        : await (this.provider as WebMessagingProvider).sendMessage(text);

      const message: ChatMessage = {
        id: messageId,
        content: text,
        sender: 'user',
        timestamp: Date.now(),
      };

      if (!this.currentSession) {
        throw new ChatError('No active session', ChatErrorCodes.INVALID_STATE);
      }
      this.currentSession.messages.push(message);
      return messageId;
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.MESSAGE_ERROR);
    }
  }

  async handlePlanSwitch(newPlanId: string): Promise<void> {
    if (!this.provider || !this.currentSession) {
      this.throwError('Chat not initialized', ChatErrorCodes.NOT_INITIALIZED);
    }

    try {
      if (this.isLegacyConfig(this.config)) {
        await this.disconnect();
        this.config.planId = newPlanId;
        await this.initialize({
          config: this.config,
          jwt: this.currentSession?.jwt || { planId: newPlanId },
          userInfo: {
            firstName: this.config.memberFirstname,
            lastName: this.config.memberLastname,
          },
        });
      } else {
        await (this.provider as WebMessagingProvider).updateConfiguration({
          planId: newPlanId,
        });
      }
      this.config.planId = newPlanId;
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.PLAN_SWITCH_ERROR);
    }
  }

  getCurrentSession(): ChatSession | null {
    return this.currentSession;
  }

  getConfig(): UnifiedChatConfig {
    return this.config;
  }

  async refreshToken(params: {
    planId: string;
    groupId?: string;
    memberId?: string;
  }): Promise<void> {
    try {
      // Implementation for token refresh
      const response = await fetch('/api/chat/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const newToken = await response.json();
      if (this.currentSession) {
        this.currentSession.jwt = newToken;
      }
    } catch (error) {
      throw new ChatError(
        'Failed to refresh authentication token',
        ChatErrorCodes.AUTH_ERROR,
        'error',
      );
    }
  }

  async updatePreferences(
    preferences: ChatSession['preferences'],
  ): Promise<void> {
    if (!this.currentSession) {
      throw new ChatError(
        'No active session',
        ChatErrorCodes.NOT_INITIALIZED,
        'error',
      );
    }
    this.currentSession.preferences = preferences;
  }

  /**
   * Initialize a new chat session
   * @userStory ID: 31146 - Chat Data Payload Refresh for Switched Plans
   */
  async initializeSession(
    planId: string,
    userInfo: {
      firstName: string;
      lastName: string;
      email?: string;
    },
  ): Promise<void> {
    try {
      // Check eligibility first
      const eligibility = await this.checkEligibility(planId);
      if (!eligibility.isChatEligibleMember) {
        throw new ChatError(
          'User is not eligible for chat',
          ChatErrorCodes.NOT_ELIGIBLE,
          'error',
          { planId },
        );
      }

      // Check business hours
      const hours = await this.getBusinessHours(planId);
      if (!hours.isCurrentlyOpen && !hours.isOpen24x7) {
        throw new ChatError(
          'Chat is currently outside business hours',
          ChatErrorCodes.OUTSIDE_BUSINESS_HOURS,
          'warning',
          { hours },
        );
      }

      // Enhanced chat payload with all required fields
      const chatPayload: ChatPayload = {
        SERV_Type: 'MemberPortal',
        firstname: userInfo.firstName,
        RoutingChatbotInteractionId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        PLAN_ID: planId,
        lastname: userInfo.lastName,
        GROUP_ID: eligibility.groupId,
        IDCardBotName: eligibility.isIDCardEligible ? 'IDCardBot' : undefined,
        IsVisionEligible: eligibility.isVision,
        MEMBER_ID: eligibility.subscriberID,
        coverage_eligibility: eligibility.isMedical
          ? 'medical'
          : eligibility.isDental
            ? 'dental'
            : 'vision',
        INQ_TYPE: 'MEM',
        IsDentalEligible: eligibility.isDental,
        MEMBER_DOB: eligibility.memberDOB,
        LOB: eligibility.isMedical
          ? 'Medical'
          : eligibility.isDental
            ? 'Dental'
            : 'Vision',
        lob_group: eligibility.getGroupType,
        IsMedicalEligibile: eligibility.isMedical,
        Origin: 'Web',
        Source: 'MemberPortal',
      };

      // Start the session with enhanced payload
      const session = await chatAPI.startSession(planId, {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
      });

      // Update the store
      const store = useChatStore.getState();
      store.setSession(session);
      store.lockPlanSwitcher(); // Lock plan switcher during active chat
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.CHAT_START_ERROR);
    }
  }

  /**
   * End the current chat session
   */
  async disconnectSession(): Promise<void> {
    try {
      if (!this.currentSession) {
        return;
      }

      await chatAPI.endSession(this.currentSession.id);

      // Update the store
      const store = useChatStore.getState();
      store.clearSession();
      store.unlockPlanSwitcher(); // Unlock plan switcher when chat ends

      this.currentSession = null;
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.CHAT_END_ERROR);
    }
  }

  /**
   * Get messages for the current session
   */
  async getMessages(): Promise<ChatMessage[]> {
    try {
      if (!this.currentSession) {
        return [];
      }

      return await chatAPI.getMessages(this.currentSession.id);
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.MESSAGE_ERROR);
    }
  }

  /**
   * @userStory ID: 31156 - Chat Operational Business Hours Refreshed for Switched Plans
   */
  async getBusinessHours(planId: string): Promise<BusinessHours> {
    try {
      return await chatAPI.getBusinessHours(planId);
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.HOURS_CHECK_FAILED);
    }
  }

  /**
   * @userStory ID: 31154 - Chat Eligibility Refreshed for Switched Plans
   */
  async checkEligibility(planId: string): Promise<UserEligibility> {
    try {
      return await chatAPI.checkEligibility(planId);
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.ELIGIBILITY_CHECK_FAILED);
    }
  }

  /**
   * Get plan details
   */
  async getPlanDetails(planId: string): Promise<ChatPlan> {
    try {
      return await chatAPI.getPlanDetails(planId);
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.PLAN_NOT_FOUND);
    }
  }

  /**
   * Start a cobrowse session
   */
  async startCobrowse(): Promise<string> {
    try {
      if (!this.currentSession) {
        throw new ChatError(
          'No active chat session',
          ChatErrorCodes.INVALID_STATE,
          'error',
        );
      }

      const { token } = await chatAPI.startCobrowse(this.currentSession.id);
      return token;
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.COBROWSE_INIT_ERROR);
    }
  }

  /**
   * End the current cobrowse session
   */
  async endCobrowse(): Promise<void> {
    try {
      if (!this.currentSession) {
        return;
      }

      await chatAPI.endCobrowse(this.currentSession.id);
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.COBROWSE_END_ERROR);
    }
  }

  /**
   * Get Terms & Conditions for a specific Line of Business
   * @userStory ID: 31157 - Correct Chat Widget and Terms & Conditions Displayed for Switched Plans
   */
  async getTermsAndConditions(planId: string): Promise<string> {
    try {
      const plan = await this.getPlanDetails(planId);
      const lob = plan.lineOfBusiness.toLowerCase();

      // Terms are specific to Line of Business
      const termsMap: Record<string, string> = {
        medical:
          'By using this chat service, you agree to discuss your medical plan benefits and coverage...',
        dental:
          'By using this chat service, you agree to discuss your dental plan benefits and coverage...',
        vision:
          'By using this chat service, you agree to discuss your vision plan benefits and coverage...',
      };

      return termsMap[lob] || termsMap.medical; // Default to medical terms
    } catch (error) {
      throw ChatError.fromError(error, ChatErrorCodes.TERMS_FETCH_ERROR);
    }
  }
}
