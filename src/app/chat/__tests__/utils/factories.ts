import { ChatMessage, ChatSession, PlanInfo } from '../../types';

export interface UserEligibility {
  isChatEligibleMember: boolean;
  isDemoMember: boolean;
  isAmplifyMem: boolean;
  groupId: string;
  memberClientID: string;
  getGroupType: string;
  isBlueEliteGroup: boolean;
  isMedical: boolean;
  isDental: boolean;
  isVision: boolean;
  isWellnessOnly: boolean;
  isCobraEligible: boolean;
  chatHours: string;
  rawChatHours: string;
  isChatbotEligible: boolean;
  memberMedicalPlanID: string;
  isIDCardEligible: boolean;
  memberDOB: string;
  subscriberID: string;
  sfx: string;
  memberFirstname: string;
  memberLastName: string;
  userID: string;
  isChatAvailable: boolean;
  routingchatbotEligible: boolean;
}

export interface ChatConfig {
  token: string;
  endPoint: string;
  opsPhone: string;
  memberFirstname: string;
  memberLastname: string;
  memberId: string;
  groupId: string;
  planId: string;
  planName: string;
  businessHours: {
    isOpen24x7: boolean;
    days: string[];
  };
}

export interface TestChatWidgetProps {
  isOpen: boolean;
  isEligible: boolean;
  isWithinBusinessHours: boolean;
  userEligibility: UserEligibility;
  config: ChatConfig;
  currentPlan: PlanInfo;
  availablePlans: PlanInfo[];
}

export const createMockPlanInfo = (
  overrides: Partial<PlanInfo> = {},
): PlanInfo => ({
  id: 'test-plan-id',
  name: 'Test Plan',
  isEligibleForChat: true,
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
  content: 'Test message content',
  sender: 'user',
  timestamp: new Date().toISOString(),
  ...overrides,
});

export const createMockChatSession = (
  overrides: Partial<ChatSession> = {},
): ChatSession => ({
  id: 'test-session-id',
  agentId: 'test-agent-id',
  agentName: 'Test Agent',
  startTime: new Date().toISOString(),
  endTime: null,
  status: 'active',
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
