import { ChatConfig, ChatPlan as Plan, UserEligibility } from '../models/types';

// Define ClientType enum since it's not in types.ts
export enum ClientType {
  Default = 'default',
  BlueCare = 'bluecare',
}

/**
 * Mock chat configuration for testing
 */
export const mockChatConfig: ChatConfig = {
  token: 'mock-jwt-token',
  endPoint: 'https://api.example.com/chat',
  demoEndPoint: 'https://demo-api.example.com/chat',
  opsPhone: '800-123-4567',
  opsPhoneHours: '9am-5pm EST',
  userID: 'USER456',
  memberFirstname: 'John',
  memberLastname: 'Doe',
  memberId: 'MEMBER123',
  groupId: 'GROUP456',
  planId: 'PLAN789',
  planName: 'Premium Health Plan',
  businessHours: {
    isOpen24x7: true,
    days: [
      { day: 'Monday', openTime: '08:00', closeTime: '20:00', isOpen: true },
      { day: 'Tuesday', openTime: '08:00', closeTime: '20:00', isOpen: true },
      { day: 'Wednesday', openTime: '08:00', closeTime: '20:00', isOpen: true },
      { day: 'Thursday', openTime: '08:00', closeTime: '20:00', isOpen: true },
      { day: 'Friday', openTime: '08:00', closeTime: '20:00', isOpen: true },
      { day: 'Saturday', openTime: '09:00', closeTime: '17:00', isOpen: true },
      { day: 'Sunday', openTime: '09:00', closeTime: '17:00', isOpen: true },
    ],
    timezone: 'America/New_York',
    isCurrentlyOpen: true,
    lastUpdated: Date.now(),
    source: 'api',
  },
  cobrowseSource: 'https://cobrowse.example.com',
  cobrowseURL: 'https://js.cobrowse.io/CobrowseIO.js',
  coBrowseLicence: 'mock-cobrowse-license-key',
  SERV_Type: 'MemberPortal',
  RoutingChatbotInteractionId: 'test-interaction-id',
  PLAN_ID: 'PLAN789',
  GROUP_ID: 'GROUP456',
  IDCardBotName: 'test-bot',
  IsVisionEligible: true,
  MEMBER_ID: 'MEMBER123',
  coverage_eligibility: 'medical',
  INQ_TYPE: 'MEM',
  IsDentalEligible: true,
  MEMBER_DOB: '1990-01-01',
  LOB: 'Medical',
  lob_group: 'Medical',
  IsMedicalEligibile: true,
  Origin: 'Web',
  Source: 'MemberPortal',
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
};

/**
 * Mock BlueCare user eligibility for testing specialized routing
 */
export const mockBlueCareUserEligibility: UserEligibility = {
  ...mockUserEligibility,
  memberClientID: ClientType.BlueCare,
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
};

/**
 * Mock ID Card request user eligibility for testing specialized routing
 */
export const mockIdCardUserEligibility: UserEligibility = {
  ...mockUserEligibility,
  isIDCardEligible: true,
};

/**
 * Mock current plan for testing
 */
export const mockCurrentPlan: Plan = {
  id: 'PLAN789',
  name: 'Premium Health Plan',
  isEligibleForChat: true,
  isActive: true,
  lineOfBusiness: 'Medical',
  termsAndConditions: '',
  businessHours: mockChatConfig.businessHours,
  memberFirstname: 'John',
  memberLastname: 'Doe',
  memberId: 'MEMBER123',
  groupId: 'GROUP456',
  isMedicalEligible: true,
  isDentalEligible: false,
  isVisionEligible: false,
  lobGroup: 'Medical',
};

/**
 * Mock available plans for testing multi-plan scenarios
 */
export const mockAvailablePlans: Plan[] = [
  mockCurrentPlan,
  {
    id: 'PLAN456',
    name: 'Basic Dental Plan',
    isEligibleForChat: true,
    isActive: true,
    lineOfBusiness: 'Dental',
    termsAndConditions: '',
    businessHours: mockChatConfig.businessHours,
    memberFirstname: 'John',
    memberLastname: 'Doe',
    memberId: 'MEMBER123',
    groupId: 'GROUP456',
    isMedicalEligible: false,
    isDentalEligible: true,
    isVisionEligible: false,
    lobGroup: 'Dental',
  },
];
