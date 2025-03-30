import { ChatConfig } from '../models/chat';

export class GenesysChatService {
  private config: ChatConfig;
  sessionId: string | null = null;
  isDemoMember: boolean = false;
  
  constructor(config: ChatConfig) {
    this.config = config;
  }
  
  /**
   * Initializes a chat session with the Genesys API
   * @param userData User information to send to the API
   * @returns Session ID for the chat
   */
  async initialize(userData: Record<string, string>): Promise<{ sessionId: string }> {
    try {
      const endpoint = this.isDemoMember ? this.config.demoEndPoint : this.config.endPoint;
      
      const response = await fetch(`${endpoint}/api/v2/webchat/guest/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.token}`
        },
        body: JSON.stringify({
          organizationId: 'BCBST',
          deploymentId: 'web-chat',
          routingTarget: {
            targetType: 'queue',
            targetAddress: this.determineRoutingQueue(userData)
          },
          memberInfo: {
            displayName: `${userData.firstname} ${userData.lastname}`,
            customFields: {
              memberID: userData.MEMBER_ID,
              groupID: userData.GROUP_ID,
              planID: userData.PLAN_ID || '',
              SERV_TYPE: userData.SERV_TYPE || '',
              LOB: userData.LOB || '',
              INQ_TYPE: userData.INQ_TYPE || ''
            }
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to initialize chat: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.sessionId = data.id;
      
      return { sessionId: data.id };
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
      const endpoint = this.isDemoMember ? this.config.demoEndPoint : this.config.endPoint;
      
      const response = await fetch(`${endpoint}/api/v2/webchat/guest/conversations/${this.sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.token}`
        },
        body: JSON.stringify({
          body: message,
          bodyType: 'standard'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
  
  /**
   * Disconnects the active chat session
   */
  async disconnect(): Promise<void> {
    if (!this.sessionId) {
      return;
    }
    
    try {
      const endpoint = this.isDemoMember ? this.config.demoEndPoint : this.config.endPoint;
      
      const response = await fetch(`${endpoint}/api/v2/webchat/guest/conversations/${this.sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.config.token}`
        }
      });
      
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
   * Determines which queue to route to based on user data
   * @param userData User information
   * @returns Queue name for routing
   */
  private determineRoutingQueue(userData: Record<string, string>): string {
    // Logic to determine which queue to route to based on user data
    // This implements the routing logic from the original JSP
    
    if (userData.LOB === 'BC') return 'BlueCare_Chat';
    if (userData.LOB === 'BA') return 'SCD_Chat';
    if (userData.SERV_TYPE === 'OrderIDCard') return 'ChatBot_IDCard';
    
    return 'MBAChat'; // Default queue
  }
} 