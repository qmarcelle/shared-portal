import { ChatMessage, ChatSession, ChatState } from '../../types';

export const createMockChatStore = (initialState: Partial<ChatState> = {}) => {
  const defaultState: ChatState = {
    isOpen: false,
    isPlanSwitcherLocked: false,
    showPlanSwitcherMessage: false,
    showCobrowseConsent: false,
    cobrowseSessionCode: null,
    isLoading: false,
    isSending: false,
    error: null,
    messages: [],
    session: null,
    isInitializing: false,
    isWithinBusinessHours: true,
    currentPlan: {
      id: 'default-plan',
      name: 'Default Plan',
      isEligibleForChat: true,
      businessHours: {
        isOpen24x7: false,
        days: [],
        timezone: 'America/New_York',
        isCurrentlyOpen: false,
        lastUpdated: Date.now(),
        source: 'api',
      },
    },
    availablePlans: [],
    isPlanSwitcherOpen: false,
  };

  return {
    ...defaultState,
    ...initialState,
  };
};

export const mockChatMessage = (
  overrides: Partial<ChatMessage> = {},
): ChatMessage => ({
  id: 'test-message-id',
  content: 'Test message',
  sender: 'user',
  timestamp: Date.now(),
  ...overrides,
});

export const mockChatSession = (
  overrides: Partial<ChatSession> = {},
): ChatSession => ({
  id: 'test-session-id',
  active: true,
  messages: [],
  planId: 'test-plan-id',
  planName: 'Test Plan',
  isPlanSwitchingLocked: false,
  jwt: {
    userID: 'test-user',
    planId: 'test-plan-id',
    userRole: 'member',
    groupId: 'test-group',
    subscriberId: 'test-subscriber',
    currUsr: {
      umpi: 'test-umpi',
      role: 'member',
      plan: {
        memCk: 'test-plan-id',
        grpId: 'test-group',
        subId: 'test-subscriber',
      },
    },
  },
  lastUpdated: Date.now(),
  ...overrides,
});
