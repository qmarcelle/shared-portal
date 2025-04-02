import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  checkChatEligibility,
  endChatSession,
  endCobrowseSession,
  getBusinessHours,
  sendChatMessage,
  startChatSession,
  startCobrowseSession,
} from '../../utils/chatAPI';

// Mock server setup
const server = setupServer(
  // Eligibility check endpoint
  rest.get('/api/v1/chat/eligibility', (req, res, ctx) => {
    const planId = req.url.searchParams.get('planId');

    if (planId === 'eligible-plan') {
      return res(
        ctx.json({
          isEligible: true,
        }),
      );
    } else {
      return res(
        ctx.json({
          isEligible: false,
          reason: 'Plan not eligible for chat',
        }),
      );
    }
  }),

  // Business hours endpoint
  rest.get('/api/v1/chat/business-hours', (req, res, ctx) => {
    return res(
      ctx.json({
        isOpen24x7: false,
        days: [
          { day: 'Monday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Tuesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Wednesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Thursday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Friday', openTime: '08:00', closeTime: '17:00' },
        ],
      }),
    );
  }),

  // Start chat session endpoint
  rest.post('/api/v1/chat/session', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'test-session-id',
        messages: [],
        active: true,
        agentName: 'Agent Smith',
      }),
    );
  }),

  // End chat session endpoint
  rest.delete('/api/v1/chat/session/:sessionId', (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  // Send message endpoint
  rest.post('/api/v1/chat/session/:sessionId/message', (req, res, ctx) => {
    const { text } = req.body as { text: string };

    return res(
      ctx.json({
        id: 'msg-123',
        text,
        sender: 'user',
        timestamp: Date.now(),
      }),
    );
  }),

  // Start cobrowse session endpoint
  rest.post('/api/v1/chat/session/:sessionId/cobrowse', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'cobrowse-123',
        active: true,
        url: 'https://cobrowse.example.com/session/123',
      }),
    );
  }),

  // End cobrowse session endpoint
  rest.delete(
    '/api/v1/chat/session/:sessionId/cobrowse/:cobrowseId',
    (req, res, ctx) => {
      return res(ctx.status(200));
    },
  ),
);

// Setup before tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Clean up after all tests
afterAll(() => server.close());

describe('Chat API', () => {
  describe('checkChatEligibility', () => {
    it('should return eligible status for eligible plan', async () => {
      const result = await checkChatEligibility('eligible-plan');
      expect(result.isEligible).toBe(true);
    });

    it('should return ineligible status with reason for ineligible plan', async () => {
      const result = await checkChatEligibility('ineligible-plan');
      expect(result.isEligible).toBe(false);
      expect(result.reason).toBe('Plan not eligible for chat');
    });

    it('should handle network errors gracefully', async () => {
      // Override handler for this test to simulate an error
      server.use(
        rest.get('/api/v1/chat/eligibility', (req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const result = await checkChatEligibility('any-plan');
      expect(result.isEligible).toBe(false);
      expect(result.reason).toBe('Unable to verify eligibility at this time.');
    });
  });

  describe('getBusinessHours', () => {
    it('should return business hours', async () => {
      const result = await getBusinessHours();
      expect(result.isOpen24x7).toBe(false);
      expect(result.days).toHaveLength(5);
      expect(result.days[0].day).toBe('Monday');
    });

    it('should handle network errors gracefully', async () => {
      // Override handler for this test to simulate an error
      server.use(
        rest.get('/api/v1/chat/business-hours', (req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const result = await getBusinessHours();
      expect(result.isOpen24x7).toBe(false);
      expect(result.days).toHaveLength(0);
    });
  });

  describe('startChatSession', () => {
    it('should start a new chat session', async () => {
      const result = await startChatSession('plan-123', {
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result.id).toBe('test-session-id');
      expect(result.active).toBe(true);
      expect(result.agentName).toBe('Agent Smith');
    });

    it('should throw an error on failure', async () => {
      // Override handler for this test to simulate an error
      server.use(
        rest.post('/api/v1/chat/session', (req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      await expect(
        startChatSession('plan-123', { firstName: 'John', lastName: 'Doe' }),
      ).rejects.toThrow('Failed to start chat session');
    });
  });

  describe('endChatSession', () => {
    it('should end a chat session', async () => {
      // This should not throw an error
      await expect(endChatSession('test-session-id')).resolves.not.toThrow();
    });

    it('should throw an error on failure', async () => {
      // Override handler for this test to simulate an error
      server.use(
        rest.delete('/api/v1/chat/session/:sessionId', (req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      await expect(endChatSession('test-session-id')).rejects.toThrow(
        'Failed to end chat session',
      );
    });
  });

  describe('sendChatMessage', () => {
    it('should send a message and return it', async () => {
      const message = 'Hello, how can I help you?';
      const result = await sendChatMessage('test-session-id', message);

      expect(result.text).toBe(message);
      expect(result.sender).toBe('user');
      expect(result.id).toBeDefined();
    });

    it('should throw an error on failure', async () => {
      // Override handler for this test to simulate an error
      server.use(
        rest.post(
          '/api/v1/chat/session/:sessionId/message',
          (req, res, ctx) => {
            return res(ctx.status(500));
          },
        ),
      );

      await expect(sendChatMessage('test-session-id', 'test')).rejects.toThrow(
        'Failed to send message',
      );
    });
  });

  describe('cobrowse sessions', () => {
    it('should start a cobrowse session', async () => {
      const result = await startCobrowseSession('test-session-id');

      expect(result.id).toBe('cobrowse-123');
      expect(result.active).toBe(true);
      expect(result.url).toBe('https://cobrowse.example.com/session/123');
    });

    it('should end a cobrowse session', async () => {
      // This should not throw an error
      await expect(
        endCobrowseSession('test-session-id', 'cobrowse-123'),
      ).resolves.not.toThrow();
    });
  });
});
