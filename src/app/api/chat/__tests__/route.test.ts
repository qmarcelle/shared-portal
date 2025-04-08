import { auth } from '@/auth';
import { GET, POST } from '../route';

describe('Chat API Route', () => {
  const mockSession = {
    user: {
      id: 'test-user-id',
      currUsr: {
        role: 'member',
        plan: {
          memCk: 'test-plan-id',
          grpId: 'test-group-id',
          subId: 'test-subscriber-id',
        },
      },
    },
    token: 'test-token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/chat', () => {
    it('should return chat session data for authenticated user', async () => {
      (auth as jest.Mock).mockResolvedValue(mockSession);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        token: 'test-token',
        planId: 'test-plan-id',
        userId: 'test-user-id',
        userRole: 'member',
        groupId: 'test-group-id',
        subscriberId: 'test-subscriber-id',
        currUsr: mockSession.user.currUsr,
      });
    });

    it('should return 401 for unauthenticated user', async () => {
      (auth as jest.Mock).mockResolvedValue(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should handle errors gracefully', async () => {
      (auth as jest.Mock).mockRejectedValue(new Error('Auth error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to get chat session');
    });
  });

  describe('POST /api/chat', () => {
    it('should process chat request for authenticated user', async () => {
      (auth as jest.Mock).mockResolvedValue(mockSession);

      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.session).toEqual({
        token: 'test-token',
        planId: 'test-plan-id',
        userId: 'test-user-id',
        userRole: 'member',
        groupId: 'test-group-id',
        subscriberId: 'test-subscriber-id',
        currUsr: mockSession.user.currUsr,
      });
    });

    it('should return 401 for unauthenticated user', async () => {
      (auth as jest.Mock).mockResolvedValue(null);

      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should handle errors gracefully', async () => {
      (auth as jest.Mock).mockRejectedValue(new Error('Auth error'));

      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to process chat request');
    });
  });
});
