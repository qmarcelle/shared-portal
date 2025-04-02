import {
  ChatConfig,
  ChatMessage,
  ChatSession,
  PlanInfo,
  UserEligibility,
} from '../../models/chat';
import { TestChatWidgetProps } from '../../types/test';

export const createMockPlanInfo = (
  overrides: Partial<PlanInfo> = {},
): PlanInfo => ({
  planId: 'test-plan-id',
  planName: 'Test Plan',
  lineOfBusiness: 'Default',
  isEligibleForChat: true,
  businessHours: 'S_S_24',
  ...overrides,
});

export const createMockUserEligibility = (
  overrides: Partial<UserEligibility> = {},
): UserEligibility => ({
  isChatEligibleMember: true,
  isDemoMember: false,
  isAmplifyMem: false,
  groupId: 'GROUP456',
  memberClientID: 'MEMBER123',
  getGroupType: 'Standard',
  isBlueEliteGroup: false,
  isMedical: true,
  isDental: false,
  isVision: false,
  isWellnessOnly: false,
  isCobraEligible: false,
  chatHours: 'Monday-Friday: 8:00 AM - 6:00 PM',
  rawChatHours: 'M_F_8_6',
  isChatbotEligible: true,
  memberMedicalPlanID: 'PLAN789',
  isIDCardEligible: true,
  memberDOB: '1990-01-01',
  subscriberID: 'SUB123',
  sfx: '123',
  memberFirstname: 'John',
  memberLastName: 'Doe',
  userID: 'USER123',
  isChatAvailable: true,
  routingchatbotEligible: true,
  ...overrides,
});

export const createMockChatMessage = (
  overrides: Partial<ChatMessage> = {},
): ChatMessage => ({
  id: 'test-message-id',
  text: 'Test message content',
  sender: 'user',
  timestamp: Date.now(),
  ...overrides,
});

export const createMockChatSession = (
  overrides: Partial<ChatSession> = {},
): ChatSession => ({
  id: 'test-session-id',
  active: true,
  agentName: 'Test Agent',
  messages: [createMockChatMessage()],
  ...overrides,
});

export const createMockChatConfig = (
  overrides: Partial<ChatConfig> = {},
): ChatConfig => ({
  token: 'test-token',
  endPoint: 'https://api.example.com/chat',
  opsPhone: '1-800-123-4567',
  memberFirstname: 'John',
  memberLastname: 'Doe',
  memberId: 'MEMBER123',
  groupId: 'GROUP456',
  planId: 'PLAN789',
  planName: 'Premium Health Plan',
  businessHours: {
    isOpen24x7: true,
    days: [],
  },
  ...overrides,
});

export const createMockTestChatWidgetProps = (
  overrides: Partial<TestChatWidgetProps> = {},
): TestChatWidgetProps => ({
  isOpen: false,
  isEligible: true,
  isWithinBusinessHours: true,
  userEligibility: createMockUserEligibility(),
  config: createMockChatConfig(),
  currentPlan: createMockPlanInfo(),
  availablePlans: [createMockPlanInfo()],
  ...overrides,
});
