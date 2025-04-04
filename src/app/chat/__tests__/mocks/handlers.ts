import { http, HttpResponse } from 'msw';
import {
  createMockChatMessage,
  createMockChatSession,
  createMockPlanInfo,
  createMockUserEligibility,
} from '../utils/factories';

// Chat API handlers
export const chatHandlers = [
  // Start chat session
  http.post('/api/v1/chat/session', async () => {
    const session = createMockChatSession();
    return HttpResponse.json(session);
  }),

  // Send chat message
  http.post('/api/v1/chat/session/:sessionId/message', async () => {
    const message = createMockChatMessage();
    return HttpResponse.json(message);
  }),

  // End chat session
  http.delete('/api/v1/chat/session/:sessionId', async () => {
    return HttpResponse.json({ success: true });
  }),

  // Get user eligibility
  http.get('/api/v1/chat/eligibility', async () => {
    const eligibility = createMockUserEligibility();
    return HttpResponse.json(eligibility);
  }),

  // Get plan info
  http.get('/api/v1/chat/plan/:planId', async () => {
    const plan = createMockPlanInfo();
    return HttpResponse.json(plan);
  }),

  // Get business hours
  http.get('/api/v1/chat/business-hours', async () => {
    return HttpResponse.json({
      isOpen24x7: false,
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'America/Chicago',
    });
  }),

  // Get cobrowse session
  http.post('/api/v1/chat/cobrowse/session', async () => {
    return HttpResponse.json({
      id: 'test-cobrowse-id',
      code: 'TEST123',
      active: true,
    });
  }),

  // End cobrowse session
  http.delete('/api/v1/chat/cobrowse/session/:sessionId', async () => {
    return HttpResponse.json({ success: true });
  }),
];
