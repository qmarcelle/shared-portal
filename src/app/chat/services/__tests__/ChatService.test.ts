import { ChatConfig, ChatMessage, ChatSession } from '../../models/types';
import { ChatService } from '../ChatService';

// Mock implementation of ChatService for testing
class MockChatService extends ChatService {
  private session: ChatSession | null = null;
  private messages: ChatMessage[] = [];

  constructor(config: ChatConfig) {
    super(config);
  }

  async initialize(userData: Record<string, string>): Promise<ChatSession> {
    this.session = {
      id: 'test-session-id',
      active: true,
      messages: [],
      planId: userData.planId || this.config.planId,
      planName: userData.planName || this.config.planName,
      isPlanSwitchingLocked: false,
      jwt: {
        userID: userData.userId || '',
        planId: userData.planId || this.config.planId,
        userRole: userData.userRole || 'member',
        groupId: userData.groupId || '',
        subscriberId: userData.subscriberId || '',
        currUsr: {
          umpi: userData.umpi || '',
          role: userData.userRole || 'member',
          plan: {
            memCk: userData.planId || this.config.planId,
            grpId: userData.groupId || '',
            subId: userData.subscriberId || '',
          },
        },
      },
      lastUpdated: Date.now(),
    };
    return this.session;
  }

  async sendMessage(message: string): Promise<ChatMessage> {
    if (!this.session) {
      throw new Error('No active session');
    }
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: message,
      sender: 'user' as const,
      timestamp: Date.now(),
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  async getMessages(): Promise<ChatMessage[]> {
    return this.messages;
  }

  getSession(): ChatSession | null {
    return this.session;
  }

  async disconnect(): Promise<void> {}

  async requestTranscript(email: string): Promise<boolean> {
    return email.includes('@') && this.session !== null;
  }
}

describe('ChatService', () => {
  let mockConfig: ChatConfig;
  let chatService: MockChatService;

  beforeEach(() => {
    mockConfig = {
      token: 'test-token',
      endPoint: 'https://test-endpoint.com',
      demoEndPoint: 'https://demo-endpoint.com',
      opsPhone: '123-456-7890',
      opsPhoneHours: '9am-5pm EST',
      memberFirstname: 'John',
      memberLastname: 'Doe',
      memberId: 'test-member-id',
      groupId: 'test-group-id',
      planId: 'test-plan-id',
      planName: 'Test Plan',
      userID: 'test-user-id',
      coBrowseLicence: 'test-license',
      cobrowseSource: 'test-source',
      cobrowseURL: 'https://cobrowse.example.com',
      businessHours: {
        isOpen24x7: true,
        days: [],
        timezone: 'America/New_York',
        isCurrentlyOpen: true,
        lastUpdated: Date.now(),
        source: 'api',
      },
      SERV_Type: 'MemberPortal',
      RoutingChatbotInteractionId: 'test-interaction-id',
      PLAN_ID: 'test-plan-id',
      GROUP_ID: 'test-group-id',
      IDCardBotName: 'test-bot',
      IsVisionEligible: true,
      MEMBER_ID: 'test-member-id',
      coverage_eligibility: 'medical',
      INQ_TYPE: 'MEM',
      IsDentalEligible: true,
      MEMBER_DOB: '1990-01-01',
      LOB: 'Medical',
      lob_group: 'Medical',
      IsMedicalEligibile: true,
      Origin: 'Web',
      Source: 'MemberPortal',
    };

    chatService = new MockChatService(mockConfig);
  });

  describe('initialization', () => {
    it('should initialize with correct config', () => {
      expect(chatService).toBeInstanceOf(MockChatService);
    });

    it('should throw error if required config is missing', () => {
      const invalidConfig = { ...mockConfig, token: '' };
      expect(() => new MockChatService(invalidConfig as ChatConfig)).toThrow();
    });
  });

  describe('session management', () => {
    it('should initialize a chat session', async () => {
      const userData = { firstName: 'John', lastName: 'Doe' };
      const session = await chatService.initialize(userData);

      expect(session).toBeDefined();
      expect(session.id).toBe('test-session-id');
      expect(session.active).toBe(true);
      expect(session.planId).toBe(mockConfig.planId);
    });

    it('should get current session', async () => {
      const userData = { firstName: 'John', lastName: 'Doe' };
      await chatService.initialize(userData);

      const session = chatService.getSession();
      expect(session).toBeDefined();
      expect(session?.id).toBe('test-session-id');
    });

    it('should end chat session', async () => {
      const userData = { firstName: 'John', lastName: 'Doe' };
      await chatService.initialize(userData);

      await chatService.disconnect();
      const session = chatService.getSession();
      expect(session).toBeNull();
    });
  });

  describe('message handling', () => {
    it('should send and receive messages', async () => {
      const userData = { firstName: 'John', lastName: 'Doe' };
      await chatService.initialize(userData);

      const message = 'Hello, this is a test message';
      await chatService.sendMessage(message);

      const messages = await chatService.getMessages();
      expect(messages).toHaveLength(1);
      expect(messages[0].content).toBe(message);
      expect(messages[0].sender).toBe('user');
    });

    it('should throw error when sending message without active session', async () => {
      const message = 'Hello, this is a test message';
      await expect(chatService.sendMessage(message)).rejects.toThrow(
        'No active session',
      );
    });
  });

  describe('transcript handling', () => {
    it('should request transcript', async () => {
      const userData = { firstName: 'John', lastName: 'Doe' };
      await chatService.initialize(userData);

      const email = 'test@example.com';
      const result = await chatService.requestTranscript(email);
      expect(result).toBe(true);
    });
  });
});
