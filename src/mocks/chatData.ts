import { ChatConfig, ClientType, Plan, UserEligibility } from '../models/chat';

/**
 * Mock chat configuration for testing
 */
export const mockChatConfig: ChatConfig = {
  token: 'mock-jwt-token',
  endPoint: 'https://api.example.com/chat',
  demoEndPoint: 'https://demo-api.example.com/chat',
  opsPhone: '800-123-4567',
  memberFirstname: 'John',
  memberLastname: 'Doe',
  memberId: 'MEMBER123',
  groupId: 'GROUP456',
  planId: 'PLAN789',
  planName: 'Premium Health Plan',
  businessHours: {
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
  },
  cobrowseSource: 'https://cobrowse.example.com',
  cobrowseURL: 'https://js.cobrowse.io/CobrowseIO.js',
  coBrowseLicence: 'mock-cobrowse-license-key',
};

/**
 * Mock user eligibility data for testing
 */
export const mockUserEligibility: UserEligibility = {
  isChatEligibleMember: true,
  isDemoMember: false,
  isAmplifyMem: false,
  groupId: 'GROUP456',
  memberClientID: ClientType.Default,
  getGroupType: 'Commercial',
  isBlueEliteGroup: false,
  isMedical: true,
  isDental: true,
  isVision: true,
  isWellnessOnly: false,
  isCobraEligible: false,
  chatHours: 'Monday-Friday: 8:00 AM - 6:00 PM',
  rawChatHours: 'M_F_8_6',
  isChatbotEligible: true,
  memberMedicalPlanID: 'PLAN789',
  isIDCardEligible: true,
  memberDOB: '1980-01-01',
  subscriberID: 'SUB123',
  sfx: '01',
  memberFirstname: 'John',
  memberLastName: 'Doe',
  userID: 'USER456',
  isChatAvailable: true,
  routingchatbotEligible: true,
  idCardChatBotName: 'speechstorm-chatbot',
  // Added fields for enhanced routing
  RoutingChatbotInteractionId: '',
  coverage_eligibility: '',
  lob_group: 'Commercial',
  Origin: 'member-portal',
  Source: 'web',
};

/**
 * Mock BlueCare user eligibility for testing specialized routing
 */
export const mockBlueCareUserEligibility: UserEligibility = {
  ...mockUserEligibility,
  memberClientID: ClientType.BlueCare,
  lob_group: ClientType.BlueCare,
  getGroupType: 'BlueCare',
};

/**
 * Mock Dental-only user eligibility for testing specialized routing
 */
export const mockDentalOnlyUserEligibility: UserEligibility = {
  ...mockUserEligibility,
  isMedical: false,
  isDental: true,
  isVision: false,
  isWellnessOnly: false,
  coverage_eligibility: 'dental_only',
};

/**
 * Mock ID Card request user eligibility for testing specialized routing
 */
export const mockIdCardUserEligibility: UserEligibility = {
  ...mockUserEligibility,
  isIDCardEligible: true,
  RoutingChatbotInteractionId: 'ID_CARD_REQ',
};

/**
 * Mock current plan for testing
 */
export const mockCurrentPlan: Plan = {
  planId: 'PLAN789',
  planName: 'Premium Health Plan',
  isEligibleForChat: true,
  isCurrentPlan: true,
};

/**
 * Mock available plans for testing multi-plan scenarios
 */
export const mockAvailablePlans: Plan[] = [
  {
    planId: 'PLAN789',
    planName: 'Premium Health Plan',
    isEligibleForChat: true,
    isCurrentPlan: true,
  },
  {
    planId: 'PLAN456',
    planName: 'Basic Dental Plan',
    isEligibleForChat: true,
    isCurrentPlan: false,
  },
];
