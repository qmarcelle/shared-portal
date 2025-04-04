import {
  BusinessHours,
  ChatConfig,
  ChatEligibility,
  ChatMessage,
  ChatSession,
  ChatSessionJWT,
  CobrowseSession,
  CobrowseSessionResponse,
} from '../types';

/**
 * Consolidated Chat Service
 *
 * This service handles all chat-related functionality including:
 * - Session management
 * - Message handling
 * - Business hours
 * - Co-browsing
 * - Chat eligibility
 */
export class ChatService {
  protected config: ChatConfig;
  private sessionId: string | null = null;
  private isDemoMember: boolean = false;
  private apiBase = '/api/v1/chat';

  constructor(config: ChatConfig) {
    this.config = config;
    this.isDemoMember =
      config.memberFirstname?.toLowerCase().includes('demo') || false;
  }

  /**
   * Initialize a chat session with the Genesys API
   * @param userData User information to send to the API
   * @returns Session object with ID and other information
   */
  async initialize(userData: Record<string, string>): Promise<ChatSession> {
    try {
      const endpoint = this.isDemoMember
        ? this.config.demoEndPoint
        : this.config.endPoint;

      const response = await fetch(
        `${endpoint}/api/v2/webchat/guest/conversations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.token}`,
          },
          body: JSON.stringify({
            organizationId: 'BCBST',
            deploymentId: 'web-chat',
            routingTarget: {
              targetType: 'queue',
              targetAddress: this.determineRoutingQueue(userData),
            },
            memberInfo: {
              displayName: `${userData.firstname || this.config.memberFirstname} ${userData.lastname || this.config.memberLastname}`,
              customFields: {
                memberID: userData.MEMBER_ID || this.config.memberId,
                groupID: userData.GROUP_ID || this.config.groupId,
                planID: userData.PLAN_ID || this.config.planId,
                SERV_TYPE: userData.SERV_TYPE || this.config.SERV_Type || '',
                LOB: userData.LOB || this.config.LOB || '',
                INQ_TYPE: userData.INQ_TYPE || this.config.INQ_TYPE || '',
              },
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to initialize chat: ${response.statusText}`);
      }

      const data = await response.json();
      this.sessionId = data.id;

      return {
        id: data.id,
        active: true,
        agentName: data.agentName || 'Agent',
        messages: [],
        planId: this.config.planId,
        planName: this.config.planName,
        startTime: new Date().toISOString(),
        status: 'active',
      };
    } catch (error) {
      console.error('Error initializing chat:', error);
      throw error;
    }
  }

  /**
   * Sends a message to the active chat session
   * @param message Message text to send
   */
  async sendMessage(message: string): Promise<ChatMessage> {
    if (!this.sessionId) {
      throw new Error('Chat session not initialized');
    }

    try {
      const endpoint = this.isDemoMember
        ? this.config.demoEndPoint
        : this.config.endPoint;

      const response = await fetch(
        `${endpoint}/api/v2/webchat/guest/conversations/${this.sessionId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.token}`,
          },
          body: JSON.stringify({
            body: message,
            bodyType: 'standard',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const responseData = await response.json();

      return {
        id: responseData.id || crypto.randomUUID(),
        content: message,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get the chat history for the current session
   */
  async getMessages(): Promise<ChatMessage[]> {
    if (!this.sessionId) {
      return [];
    }

    try {
      const endpoint = this.isDemoMember
        ? this.config.demoEndPoint
        : this.config.endPoint;

      const response = await fetch(
        `${endpoint}/api/v2/webchat/guest/conversations/${this.sessionId}/messages`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.config.token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to get messages: ${response.statusText}`);
      }

      const data = await response.json();

      return data.entities.map(
        (msg: {
          id: string;
          body: string;
          direction: string;
          timestamp: string;
        }) => ({
          id: msg.id,
          content: msg.body,
          sender: msg.direction === 'inbound' ? 'user' : 'agent',
          timestamp: msg.timestamp,
        }),
      );
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  /**
   * Get information about the current session
   */
  getSession(): ChatSession | null {
    if (!this.sessionId) {
      return null;
    }

    // We would typically fetch the latest session data from the API here,
    // but for simplicity we're just returning what we know locally
    return {
      id: this.sessionId,
      active: true,
      planId: this.config.planId,
      planName: this.config.planName,
      status: 'active',
    };
  }

  /**
   * Disconnects the active chat session
   */
  async disconnect(): Promise<void> {
    if (!this.sessionId) {
      return;
    }

    try {
      const endpoint = this.isDemoMember
        ? this.config.demoEndPoint
        : this.config.endPoint;

      const response = await fetch(
        `${endpoint}/api/v2/webchat/guest/conversations/${this.sessionId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.config.token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to disconnect: ${response.statusText}`);
      }

      this.sessionId = null;
    } catch (error) {
      console.error('Error disconnecting chat:', error);
      throw error;
    }
  }

  /**
   * Request a transcript of the chat session
   */
  async requestTranscript(email: string): Promise<boolean> {
    if (!this.sessionId) {
      return false;
    }

    try {
      const endpoint = this.isDemoMember
        ? this.config.demoEndPoint
        : this.config.endPoint;

      const response = await fetch(
        `${endpoint}/api/v2/webchat/guest/conversations/${this.sessionId}/transcript`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.token}`,
          },
          body: JSON.stringify({
            email,
            fileName: `chat-transcript-${this.sessionId}.txt`,
          }),
        },
      );

      return response.ok;
    } catch (error) {
      console.error('Error requesting transcript:', error);
      return false;
    }
  }

  /**
   * Check if the user is eligible for chat based on their plan
   */
  async checkChatEligibility(planId: string): Promise<ChatEligibility> {
    try {
      const response = await fetch(
        `${this.apiBase}/eligibility?planId=${planId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Eligibility check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking chat eligibility:', error);
      return {
        isEligible: false,
        reason: 'Unable to verify eligibility at this time.',
      };
    }
  }

  /**
   * Check the business hours for chat availability
   */
  async getBusinessHours(): Promise<BusinessHours> {
    try {
      const response = await fetch(`${this.apiBase}/business-hours`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Business hours check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking business hours:', error);
      // Default to closed if we can't get the hours
      return {
        isOpen24x7: false,
        days: [],
        timezone: 'America/New_York',
        isCurrentlyOpen: false,
        lastUpdated: Date.now(),
        source: 'api',
      };
    }
  }

  /**
   * Start a new chat session with more detailed information
   */
  async startChatSession(
    planId: string,
    userInfo: {
      firstName: string;
      lastName: string;
      email?: string;
      reason?: string;
    },
    jwt?: ChatSessionJWT,
  ): Promise<ChatSession> {
    try {
      const response = await fetch(`${this.apiBase}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userInfo,
          jwt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Starting chat session failed: ${response.status}`);
      }

      const session = await response.json();
      this.sessionId = session.id;

      return session;
    } catch (error) {
      console.error('Error starting chat session:', error);
      throw new Error('Failed to start chat session. Please try again later.');
    }
  }

  /**
   * Start a cobrowse session
   */
  async startCobrowseSession(): Promise<CobrowseSession> {
    if (!this.sessionId) {
      throw new Error('Chat session not initialized');
    }

    try {
      const response = await fetch(
        `${this.apiBase}/session/${this.sessionId}/cobrowse`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Starting cobrowse session failed: ${response.status}`);
      }

      const sessionData: CobrowseSessionResponse = await response.json();

      return {
        id: sessionData.sessionId,
        active: true,
        url: sessionData.url || window.location.href,
        code: sessionData.code,
      };
    } catch (error) {
      console.error('Error starting cobrowse session:', error);
      throw new Error(
        'Failed to start cobrowse session. Please try again later.',
      );
    }
  }

  /**
   * End the current cobrowse session
   */
  async endCobrowseSession(cobrowseId: string): Promise<void> {
    if (!this.sessionId) {
      return;
    }

    try {
      const response = await fetch(
        `${this.apiBase}/session/${this.sessionId}/cobrowse/${cobrowseId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Ending cobrowse session failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error ending cobrowse session:', error);
      throw new Error(
        'Failed to end cobrowse session. Please try again later.',
      );
    }
  }

  /**
   * Determines which queue to route to based on user data
   * @param userData User information
   * @returns Queue name for routing
   */
  private determineRoutingQueue(userData: Record<string, string>): string {
    // Logic to determine which queue to route to based on user data
    // This implements the routing logic from the original JSP

    if (userData.LOB === 'BC' || this.config.LOB === 'BC')
      return 'BlueCare_Chat';
    if (userData.LOB === 'BA' || this.config.LOB === 'BA') return 'SCD_Chat';
    if (
      userData.SERV_TYPE === 'OrderIDCard' ||
      this.config.SERV_Type === 'OrderIDCard'
    )
      return 'ChatBot_IDCard';

    return 'MBAChat'; // Default queue
  }
}
