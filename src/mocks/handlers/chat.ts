import { http, HttpResponse } from 'msw';
import { ChatPayload } from '../../models/chat';
import {
  mockAvailablePlans,
  mockChatConfig,
  mockUserEligibility,
} from '../chatData';

/**
 * Chat-related API handlers for Mock Service Worker
 */
export const chatHandlers = [
  // Check user eligibility for chat
  http.get('/api/v1/chat/eligibility', () => {
    return HttpResponse.json(
      {
        status: 'success',
        data: mockUserEligibility,
      },
      { status: 200 },
    );
  }),

  // Check business hours
  http.get('/api/v1/chat/business-hours', () => {
    return HttpResponse.json(
      {
        status: 'success',
        data: mockChatConfig.businessHours,
      },
      { status: 200 },
    );
  }),

  // Initialize chat session
  http.post('/api/v1/chat/session', async ({ request }) => {
    const payload = (await request.json()) as ChatPayload;

    return HttpResponse.json(
      {
        status: 'success',
        data: {
          sessionId: `session-${Date.now()}`,
          startTime: new Date().toISOString(),
          isActive: true,
          planId: payload.planId,
        },
      },
      { status: 200 },
    );
  }),

  // Send/receive chat messages
  http.post('/api/v1/chat/message', async ({ request }) => {
    const data = await request.json();

    // Send automated response based on user message
    return HttpResponse.json(
      {
        status: 'success',
        data: {
          id: `bot-${Date.now()}`,
          text: `This is an automated response to: "${data.text}"`,
          sender: 'bot',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  }),

  // Get available plans
  http.get('/api/v1/chat/plans', () => {
    return HttpResponse.json(
      {
        status: 'success',
        data: mockAvailablePlans,
      },
      { status: 200 },
    );
  }),

  // Initialize cobrowse session
  http.post('/api/v1/chat/cobrowse', () => {
    return HttpResponse.json(
      {
        status: 'success',
        data: {
          sessionId: `cobrowse-${Date.now()}`,
          code: '123456',
          url: 'https://cobrowse.example.com/session/123456',
        },
      },
      { status: 200 },
    );
  }),

  // End chat session
  http.delete('/api/v1/chat/session/:sessionId', () => {
    return HttpResponse.json(
      {
        status: 'success',
        data: {
          sessionEnded: true,
          endTime: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  }),
];
