import { http, HttpResponse } from 'msw';
import { BusinessHours, ChatMessage, UserPlan } from '../models/chat';

interface ChatPayload {
  planId: string;
  userInfo: {
    firstName: string;
    lastName: string;
    email?: string;
    reason?: string;
  };
}

export const handlers = [
  // Chat eligibility endpoint
  http.get('/api/v1/chat/eligibility', ({ request }) => {
    const url = new URL(request.url);
    const planId = url.searchParams.get('planId');

    if (planId === 'ineligible-plan') {
      return HttpResponse.json(
        {
          isEligible: false,
          reason: 'This plan does not support chat functionality',
        },
        { status: 200 },
      );
    }

    return HttpResponse.json({ isEligible: true }, { status: 200 });
  }),

  // Business hours endpoint
  http.get('/api/v1/chat/business-hours', () => {
    const businessHours: BusinessHours = {
      isOpen24x7: true,
      days: [
        { day: 'Monday', openTime: '08:00', closeTime: '20:00' },
        { day: 'Tuesday', openTime: '08:00', closeTime: '20:00' },
        { day: 'Wednesday', openTime: '08:00', closeTime: '20:00' },
        { day: 'Thursday', openTime: '08:00', closeTime: '20:00' },
        { day: 'Friday', openTime: '08:00', closeTime: '20:00' },
        { day: 'Saturday', openTime: '09:00', closeTime: '17:00' },
        { day: 'Sunday', openTime: '09:00', closeTime: '17:00' },
      ],
    };

    return HttpResponse.json(businessHours, { status: 200 });
  }),

  // Get available plans endpoint
  http.get('/api/v1/chat/plans', () => {
    const availablePlans: UserPlan[] = [
      {
        planId: 'plan-123',
        planName: 'Premium Health Plan',
        isEligibleForChat: true,
        membershipNumber: '12345678',
      },
      {
        planId: 'plan-456',
        planName: 'Basic Dental Plan',
        isEligibleForChat: true,
        membershipNumber: '87654321',
      },
    ];

    return HttpResponse.json(availablePlans, { status: 200 });
  }),

  // Start chat session endpoint
  http.post('/api/v1/chat/session', async ({ request }) => {
    const payload = (await request.json()) as ChatPayload;

    return HttpResponse.json(
      {
        id: 'chat-session-123',
        active: true,
        messages: [],
        agentName: 'Agent Smith',
      },
      { status: 200 },
    );
  }),

  // End chat session endpoint
  http.delete('/api/v1/chat/session/:sessionId', () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  // Send message endpoint
  http.post('/api/v1/chat/session/:sessionId/message', async ({ request }) => {
    const { text } = (await request.json()) as ChatMessage;

    // Simulate agent response after user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: Date.now(),
    };

    const agentMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      text: 'Thank you for your message. How can I assist you today?',
      sender: 'agent',
      timestamp: Date.now() + 1000,
    };

    return HttpResponse.json([userMessage, agentMessage], { status: 200 });
  }),

  // Start cobrowse session endpoint
  http.post('/api/v1/chat/session/:sessionId/cobrowse', () => {
    return HttpResponse.json(
      {
        id: 'cobrowse-123',
        active: true,
        url: 'https://cobrowse.example.com/session/123',
      },
      { status: 200 },
    );
  }),

  // End cobrowse session endpoint
  http.delete('/api/v1/chat/session/:sessionId/cobrowse/:cobrowseId', () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
