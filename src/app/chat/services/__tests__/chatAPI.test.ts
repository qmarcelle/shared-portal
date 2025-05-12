// @ts-nocheck
import {
  checkChatEligibility,
  endChatSession,
  endCobrowseSession,
  getBusinessHours,
  sendChatMessage,
  startChatSession,
  startCobrowseSession,
} from '../services/chatAPI';
import type {
  BusinessHours,
  ChatEligibility,
  ChatMessage,
  ChatSession,
  CobrowseSession,
} from './global';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('chatAPI', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('checkChatEligibility', () => {
    it('should return eligibility status for valid plan', async () => {
      const mockEligibility: ChatEligibility = {
        isEligible: true,
        reason: 'Eligible for chat services',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEligibility),
      });

      const result = await checkChatEligibility('test-plan-id');
      expect(result).toEqual(mockEligibility);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/chat/eligibility?planId=test-plan-id',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await checkChatEligibility('test-plan-id');
      expect(result).toEqual({
        isEligible: false,
        reason: 'Unable to verify eligibility at this time.',
      });
    });
  });

  describe('getBusinessHours', () => {
    it('should return business hours when available', async () => {
      const mockHours: BusinessHours = {
        isOpen24x7: false,
        days: [
          {
            day: 'Monday',
            openTime: '09:00',
            closeTime: '17:00',
            isOpen: true,
          },
        ],
        timezone: 'America/New_York',
        isCurrentlyOpen: true,
        lastUpdated: Date.now(),
        source: 'api',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHours),
      });

      const result = await getBusinessHours();
      expect(result).toEqual(mockHours);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/chat/business-hours',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
    });

    it('should return default hours on error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await getBusinessHours();
      expect(result).toEqual({
        isOpen24x7: false,
        days: [],
        timezone: 'America/New_York',
        isCurrentlyOpen: false,
      });
    });
  });

  describe('startChatSession', () => {
    it('should start a new chat session', async () => {
      const mockSession: ChatSession = {
        id: 'test-session-id',
        active: true,
        planId: 'test-plan-id',
        planName: 'Test Plan',
        isPlanSwitchingLocked: false,
        messages: [],
        jwt: {
          planId: 'test-plan-id',
          userID: 'test-user-id',
          userRole: 'member',
          groupId: 'test-group-id',
          subscriberId: 'test-sub-id',
          currUsr: {
            umpi: 'test-umpi',
            role: 'member',
            firstName: 'John',
            lastName: 'Doe',
            plan: {
              memCk: 'test-plan-id',
              grpId: 'test-group-id',
              subId: 'test-sub-id',
            },
          },
        },
        lastUpdated: Date.now(),
        plan: {
          id: 'test-plan-id',
          name: 'Test Plan',
          groupId: 'test-group-id',
          memberId: 'test-sub-id',
          isEligibleForChat: true,
          businessHours: {
            isOpen24x7: false,
            days: [],
            timezone: 'America/New_York',
            isCurrentlyOpen: true,
            lastUpdated: Date.now(),
            source: 'api',
          },
          lineOfBusiness: 'Medical',
          isActive: true,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSession),
      });

      const result = await startChatSession('test-plan-id', {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        reason: 'Test chat',
      });

      expect(result).toEqual(mockSession);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/chat/session',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId: 'test-plan-id',
            userInfo: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              reason: 'Test chat',
            },
          }),
        }),
      );
    });

    it('should throw error on failed session start', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(
        startChatSession('test-plan-id', {
          firstName: 'John',
          lastName: 'Doe',
        }),
      ).rejects.toThrow(
        'Failed to start chat session. Please try again later.',
      );
    });
  });

  describe('endChatSession', () => {
    it('should end an existing chat session', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await endChatSession('test-session-id');
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/chat/session/test-session-id',
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
    });

    it('should throw error on failed session end', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(endChatSession('test-session-id')).rejects.toThrow(
        'Failed to end chat session. Please try again later.',
      );
    });
  });

  describe('sendChatMessage', () => {
    it('should send a message in the chat session', async () => {
      const mockMessage: ChatMessage = {
        id: 'test-message-id',
        content: 'Hello, world!',
        sender: 'user',
        timestamp: Date.now(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMessage),
      });

      const result = await sendChatMessage('test-session-id', 'Hello, world!');
      expect(result).toEqual(mockMessage);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/chat/session/test-session-id/message',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: 'Hello, world!',
          }),
        }),
      );
    });

    it('should throw error on failed message send', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(
        sendChatMessage('test-session-id', 'Hello, world!'),
      ).rejects.toThrow('Failed to send message. Please try again later.');
    });
  });

  describe('startCobrowseSession', () => {
    it('should start a new cobrowse session', async () => {
      const mockSession: CobrowseSession = {
        id: 'test-cobrowse-id',
        active: true,
        url: 'https://cobrowse.example.com/test-cobrowse-id',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSession),
      });

      const result = await startCobrowseSession('test-session-id');
      expect(result).toEqual(mockSession);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/chat/session/test-session-id/cobrowse',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
    });

    it('should throw error on failed cobrowse session start', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(startCobrowseSession('test-session-id')).rejects.toThrow(
        'Failed to start cobrowse session. Please try again later.',
      );
    });
  });

  describe('endCobrowseSession', () => {
    it('should end an existing cobrowse session', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await endCobrowseSession('test-session-id', 'test-cobrowse-id');
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/chat/session/test-session-id/cobrowse/test-cobrowse-id',
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
    });

    it('should throw error on failed cobrowse session end', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(
        endCobrowseSession('test-session-id', 'test-cobrowse-id'),
      ).rejects.toThrow(
        'Failed to end cobrowse session. Please try again later.',
      );
    });
  });
});
