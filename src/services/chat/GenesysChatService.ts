import {
  ChatConfig,
  ChatMessage,
  ChatSession,
  ChatType,
  ClientType,
} from '../../models/chat';
import { ChatService } from './ChatService';

/**
 * Implementation of ChatService for Genesys Chat API
 */
export class GenesysChatService extends ChatService {
  private sessionId: string | null = null;
  private messages: ChatMessage[] = [];
  private isDemoMember: boolean = false;

  constructor(config: ChatConfig) {
    super(config);
    this.isDemoMember = false; // This would be determined from config or other data
  }

  /**
   * Initializes a chat session with the Genesys API
   * @param userData User information to send to the API
   * @returns Session information
   */
  async initialize(userData: Record<string, string>): Promise<ChatSession> {
    try {
      const endpoint =
        this.isDemoMember && this.config.demoEndPoint
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
              displayName: `${userData.firstname} ${userData.lastname}`,
              customFields: {
                memberID: userData.MEMBER_ID || userData.memberID || '',
                groupID: userData.GROUP_ID || userData.groupID || '',
                planID: userData.PLAN_ID || userData.planID || '',
                SERV_TYPE: userData.SERV_TYPE || '',
                LOB: userData.LOB || userData.lob_group || '',
                INQ_TYPE: userData.INQ_TYPE || '',
                RoutingChatbotInteractionId:
                  userData.RoutingChatbotInteractionId || '',
                coverage_eligibility: userData.coverage_eligibility || '',
                Origin: userData.Origin || 'member-portal',
                Source: userData.Source || 'web',
              },
            },
            journeyContext: {
              customer: {
                id: userData.memberID || userData.MEMBER_ID || '',
                idType: 'memberID',
              },
              customerSession: {
                type: 'web',
                id: new Date().getTime().toString(),
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

      // Return session information
      return {
        id: data.id,
        active: true,
        messages: [],
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
  async sendMessage(message: string): Promise<void> {
    if (!this.sessionId) {
      throw new Error('Chat session not initialized');
    }

    try {
      const endpoint =
        this.isDemoMember && this.config.demoEndPoint
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

      // Add message to local history
      this.messages.push({
        id: `msg-${Date.now()}`,
        text: message,
        sender: 'user',
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get the chat history for the current session
   */
  async getMessages(): Promise<ChatMessage[]> {
    return this.messages;
  }

  /**
   * Get information about the current session
   */
  getSession(): ChatSession | null {
    if (!this.sessionId) {
      return null;
    }

    return {
      id: this.sessionId,
      active: true,
      messages: this.messages,
    };
  }

  /**
   * End the current chat session
   */
  async disconnect(): Promise<void> {
    if (!this.sessionId) {
      return;
    }

    try {
      const endpoint =
        this.isDemoMember && this.config.demoEndPoint
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
        throw new Error(`Failed to end chat: ${response.statusText}`);
      }

      this.sessionId = null;
    } catch (error) {
      console.error('Error ending chat session:', error);
      throw error;
    }
  }

  /**
   * Request a transcript of the chat session
   */
  async requestTranscript(email: string): Promise<boolean> {
    if (!this.sessionId) {
      throw new Error('Chat session not initialized');
    }

    try {
      const endpoint =
        this.isDemoMember && this.config.demoEndPoint
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
            format: 'html',
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
   * Determine which queue to route the chat to based on user data
   */
  private determineRoutingQueue(userData: Record<string, string>): string {
    // Enhanced routing logic to match the original Java implementation

    // Special case handling for routing chatbot
    if (userData.RoutingChatbotInteractionId) {
      if (
        userData.SERV_TYPE === 'OrderIDCard' ||
        userData.requestType === 'OrderIDCard'
      ) {
        return ChatType.DefaultChat + '_IDCard';
      }
      return this.determineQueueFromRoutingInteraction(userData);
    }

    // Line of business based routing
    const lob = userData.LOB || userData.lob_group || '';
    if (lob === ClientType.BlueCare) return ChatType.BlueCareChat;
    if (lob === ClientType.SeniorCare) return ChatType.SeniorCareChat;

    // Service type based routing
    if (
      userData.SERV_TYPE === 'OrderIDCard' ||
      userData.requestType === 'OrderIDCard'
    ) {
      return 'ChatBot_IDCard';
    }

    // Check if dental only
    if (
      userData.isDentalOnly === 'true' ||
      userData.coverage_eligibility === 'dental_only'
    ) {
      return 'DentalChat';
    }

    // Check if vision only
    if (
      userData.isVisionOnly === 'true' ||
      userData.coverage_eligibility === 'vision_only'
    ) {
      return 'VisionChat';
    }

    // Default queue
    return ChatType.DefaultChat;
  }

  /**
   * Determines the queue based on routing chatbot interaction
   * @param userData User data with routing information
   * @returns Appropriate queue name
   */
  private determineQueueFromRoutingInteraction(
    userData: Record<string, string>,
  ): string {
    // Use the routing chatbot interaction ID to determine specialized queues
    const interactionId = userData.RoutingChatbotInteractionId || '';

    // Handle special cases from the chatbot
    if (interactionId.includes('CLAIMS')) {
      return 'Claims_Chat';
    }
    if (interactionId.includes('BENEFITS')) {
      return 'Benefits_Chat';
    }
    if (interactionId.includes('PROVIDERS')) {
      return 'Provider_Chat';
    }
    if (interactionId.includes('BILLING')) {
      return 'Billing_Chat';
    }

    // Default to appropriate queue based on line of business
    const lob = userData.LOB || userData.lob_group || '';
    if (lob === ClientType.BlueCare) return ChatType.BlueCareChat;
    if (lob === ClientType.SeniorCare) return ChatType.SeniorCareChat;

    return ChatType.DefaultChat;
  }
}
