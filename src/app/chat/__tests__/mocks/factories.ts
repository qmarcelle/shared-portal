import {
  BusinessHours,
  ChatConfig,
  ChatMessage,
  ChatPlan,
  ChatSession,
  UserEligibility,
} from '../../models/types';

const mockBusinessHours: BusinessHours = {
  isOpen24x7: false,
  days: [
    {
      day: 'Monday',
      openTime: '08:00',
      closeTime: '18:00',
      isOpen: true,
    },
  ],
  timezone: 'America/New_York',
  isCurrentlyOpen: true,
  lastUpdated: Date.now(),
  source: 'default',
};

export const createMockChatConfig = (
  overrides?: Partial<ChatConfig>,
): ChatConfig => ({
  token: 'test-token',
  endPoint: 'https://api.test/chat',
  demoEndPoint: 'https://demo.test/chat',
  opsPhone: '1-800-TEST',
  memberFirstname: 'John',
  memberLastname: 'Doe',
  memberId: 'MEM123',
  groupId: 'GROUP123',
  planId: 'TEST123',
  planName: 'Test Plan',
  businessHours: mockBusinessHours,
  SERV_Type: 'GENERAL',
  RoutingChatbotInteractionId: 'TEST123',
  PLAN_ID: 'TEST123',
  GROUP_ID: 'GROUP123',
  IDCardBotName: 'idcard-bot',
  IsVisionEligible: false,
  MEMBER_ID: 'MEM123',
  coverage_eligibility: 'medical',
  INQ_TYPE: 'MEM',
  IsDentalEligible: false,
  MEMBER_DOB: '1990-01-01',
  LOB: 'MEDICAL',
  lob_group: 'STANDARD',
  IsMedicalEligibile: true,
  Origin: 'MemberPortal',
  Source: 'Web',
  ...overrides,
});

export const createMockPlanInfo = (
  overrides?: Partial<ChatPlan>,
): ChatPlan => ({
  id: 'TEST123',
  name: 'Test Plan',
  isChatEligible: true,
  businessHours: mockBusinessHours,
  lineOfBusiness: 'MEDICAL',
  termsAndConditions: 'Test terms',
  isActive: true,
  memberFirstname: 'John',
  memberLastname: 'Doe',
  memberId: 'MEM123',
  groupId: 'GROUP123',
  lobGroup: 'STANDARD',
  isMedicalEligible: true,
  isDentalEligible: false,
  isVisionEligible: false,
  memberDob: '1990-01-01',
  ...overrides,
});

export const createMockUserEligibility = (
  overrides?: Partial<UserEligibility>,
): UserEligibility => ({
  isChatEligibleMember: true,
  isDemoMember: false,
  isAmplifyMem: false,
  groupId: 'GROUP123',
  memberClientID: 'CLIENT123',
  getGroupType: 'STANDARD',
  isBlueEliteGroup: false,
  isMedical: true,
  isDental: false,
  isVision: false,
  isWellnessOnly: false,
  isCobraEligible: false,
  chatHours: 'M_F_8_6',
  rawChatHours: 'M_F_8_6',
  isChatbotEligible: true,
  memberMedicalPlanID: 'MED123',
  isIDCardEligible: true,
  memberDOB: '1990-01-01',
  subscriberID: 'SUB123',
  sfx: '01',
  memberFirstname: 'John',
  memberLastName: 'Doe',
  userID: 'USER123',
  isChatAvailable: true,
  routingchatbotEligible: true,
  ...overrides,
});

export const createMockChatSession = (
  overrides?: Partial<ChatSession>,
): ChatSession => ({
  id: 'SESSION123',
  active: true,
  planId: 'TEST123',
  planName: 'Test Plan',
  isPlanSwitchingLocked: false,
  messages: [],
  jwt: {
    userID: 'USER123',
    planId: 'TEST123',
    userRole: 'MEMBER',
    groupId: 'GROUP123',
    subscriberId: 'SUB123',
    currUsr: {
      umpi: 'UMPI123',
      role: 'MEMBER',
      plan: {
        memCk: 'TEST123',
        grpId: 'GROUP123',
        subId: 'SUB123',
      },
    },
  },
  lastUpdated: Date.now(),
  ...overrides,
});

export const createMockChatMessage = (
  overrides?: Partial<ChatMessage>,
): ChatMessage => ({
  id: `msg-${Date.now()}`,
  content: 'Test message',
  sender: 'user',
  timestamp: Date.now(),
  ...overrides,
});
