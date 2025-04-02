import { http, HttpResponse } from 'msw';
import { ChatPayload, ClientType } from '../../models/chat';
import {
  mockAvailablePlans,
  mockChatConfig,
  mockUserEligibility,
} from '../chatData';

// Extended payload type for the chat handler
interface ExtendedChatPayload extends ChatPayload {
  lob_group?: string;
  RoutingChatbotInteractionId?: string;
  coverage_eligibility?: string;
}

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
    const payload = (await request.json()) as ExtendedChatPayload;

    // Determine the routing queue based on the payload information
    let routingQueue = 'MBAChat'; // Default queue

    // Handle special routing scenarios
    if (
      payload.memberClientID === ClientType.BlueCare ||
      payload.lob_group === ClientType.BlueCare
    ) {
      routingQueue = 'BlueCare_Chat';
    } else if (
      payload.memberClientID === ClientType.SeniorCare ||
      payload.lob_group === ClientType.SeniorCare
    ) {
      routingQueue = 'SCD_Chat';
    } else if (payload.RoutingChatbotInteractionId) {
      // Handle routing chatbot interaction IDs
      if (payload.RoutingChatbotInteractionId.includes('ID_CARD')) {
        routingQueue = 'ChatBot_IDCard';
      } else if (payload.RoutingChatbotInteractionId.includes('CLAIMS')) {
        routingQueue = 'Claims_Chat';
      } else if (payload.RoutingChatbotInteractionId.includes('BENEFITS')) {
        routingQueue = 'Benefits_Chat';
      }
    } else if (payload.coverage_eligibility === 'dental_only') {
      routingQueue = 'DentalChat';
    } else if (payload.coverage_eligibility === 'vision_only') {
      routingQueue = 'VisionChat';
    }

    return HttpResponse.json(
      {
        status: 'success',
        data: {
          sessionId: `session-${Date.now()}`,
          startTime: new Date().toISOString(),
          isActive: true,
          planId: payload.planId,
          routingQueue,
          agentInfo: {
            name: 'Virtual Agent',
            id: `agent-${Math.floor(Math.random() * 1000)}`,
            department: routingQueue,
          },
        },
      },
      { status: 200 },
    );
  }),

  // Send/receive chat messages
  http.post('/api/v1/chat/message', async ({ request }) => {
    try {
      const data = (await request.json()) as { text: string };

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
    } catch (error) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'Invalid message format',
        },
        { status: 400 },
      );
    }
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
