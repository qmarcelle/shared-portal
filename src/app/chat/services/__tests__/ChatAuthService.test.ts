import { auth } from '@/auth';
import { ChatAuthService } from '../ChatAuthService';

// Mock the auth function
jest.mock('@/auth', () => ({
  auth: jest.fn(),
  unstable_update: jest.fn(),
}));

describe('ChatAuthService', () => {
  let chatAuthService: ChatAuthService;
  const mockSession = {
    user: {
      email: 'test@example.com',
      currUsr: {
        umpi: 'test-umpi',
        role: 'member',
        plan: {
          memCk: 'test-plan-id',
          grpId: 'test-group-id',
          subId: 'test-sub-id',
        },
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    chatAuthService = ChatAuthService.getInstance();
  });

  describe('getInstance', () => {
    it('returns the same instance on multiple calls', () => {
      const instance1 = ChatAuthService.getInstance();
      const instance2 = ChatAuthService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('initializeSession', () => {
    it('initializes session successfully', async () => {
      // Mock auth to return a valid session
      (auth as jest.Mock).mockResolvedValue(mockSession);

      const session = await chatAuthService.initializeSession();

      expect(session).toBeDefined();
      expect(session.id).toBe('test-session-id');
      expect(session.planId).toBe('test-plan-id');
      expect(session.active).toBe(true);
    });

    it('handles missing session', async () => {
      // Mock auth to return null session
      (auth as jest.Mock).mockResolvedValue(null);

      await expect(chatAuthService.initializeSession()).rejects.toThrow(
        'No active session found',
      );
    });

    it('handles missing user data', async () => {
      // Mock auth to return session with missing user data
      (auth as jest.Mock).mockResolvedValue({
        user: null,
      });

      await expect(chatAuthService.initializeSession()).rejects.toThrow(
        'No active session found',
      );
    });
  });

  describe('getSessionJWT', () => {
    it('generates valid JWT', async () => {
      // Mock auth to return a valid session
      (auth as jest.Mock).mockResolvedValue(mockSession);

      const jwt = await chatAuthService.getSessionJWT();

      expect(jwt).toBeDefined();
      expect(jwt.userID).toBe('test-umpi');
      expect(jwt.planId).toBe('test-plan-id');
      expect(jwt.groupId).toBe('test-group-id');
      expect(jwt.subscriberId).toBe('test-sub-id');
    });

    it('handles missing session data', async () => {
      // Mock auth to return session with missing data
      (auth as jest.Mock).mockResolvedValue({
        user: {
          email: 'test@example.com',
          currUsr: null,
        },
      });

      await expect(chatAuthService.getSessionJWT()).rejects.toThrow(
        'Missing required session data',
      );
    });
  });
});
