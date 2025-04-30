import type {
  ChatDataPayload,
  ChatInfoResponse,
  ChatSession,
  ChatState,
} from '@/app/chat/types/index';

// Business Hours Mock
export const mockBusinessHours = '9:00-17:00';

// Chat Info Mock
export const mockChatInfo: ChatInfoResponse = {
  chatAvailable: true,
  cloudChatEligible: true,
  chatGroup: 'test-group',
  workingHours: mockBusinessHours,
};

// Chat State Mock
export const mockChatState: ChatState = {
  isOpen: false,
  isInChat: false,
  messages: [],
  currentPlan: null,
  error: null,
  isPlanSwitcherLocked: false,
  session: null,
};

// Chat Session Mock
export const mockChatSession: ChatSession = {
  id: 'test-session-id',
  agentName: 'Test Agent',
  startTime: Date.now(),
  endTime: undefined,
  status: 'active',
};

// Chat Data Payload Mock
export const mockChatDataPayload: ChatDataPayload = {
  PLAN_ID: 'test-plan',
  GROUP_ID: 'test-group',
  LOB: 'Medical',
  lob_group: 'group1',
  IsMedicalEligibile: true,
  IsDentalEligible: false,
  IsVisionEligible: false,
  Origin: 'MemberPortal',
  Source: 'Web',
};

// Mock API Responses
export const mockApiResponses = {
  startChatSession: {
    sessionId: 'test-session-id',
    startTime: new Date().toISOString(),
    isActive: true,
  },
  sendChatMessage: {
    id: 'test-message-id',
    text: 'Test response',
    sender: 'agent',
    timestamp: Date.now(),
  },
  endChatSession: {
    success: true,
  },
};

// Mock Genesys Configuration
export const mockGenesysConfig = {
  deploymentId: 'test-deployment',
  region: 'test-region',
  userData: {
    memberId: 'test-member',
    planId: 'test-plan',
    planName: 'Test Plan',
  },
  styling: {
    primaryColor: '#0066CC',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
  },
};
