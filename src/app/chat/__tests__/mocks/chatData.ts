import { BusinessHours, ChatPlan, UserEligibility } from '../../models/types';

export const mockBusinessHours: BusinessHours = {
  isOpen24x7: true,
  days: [],
  timezone: 'America/New_York',
  isCurrentlyOpen: true,
  lastUpdated: Date.now(),
  source: 'default',
};

export const mockChatPlan: ChatPlan = {
  id: 'test-plan',
  name: 'Test Plan',
  isEligibleForChat: true,
  businessHours: mockBusinessHours,
  lineOfBusiness: 'Medical',
  termsAndConditions: 'Test terms',
  isActive: true,
  memberFirstname: 'Test',
  memberLastname: 'User',
  memberId: 'test-member',
  groupId: 'test-group',
  lobGroup: 'Medical',
  isMedicalEligible: true,
  isDentalEligible: false,
  isVisionEligible: false,
  memberDob: '1990-01-01',
};

export const mockUserEligibility: UserEligibility = {
  userID: 'test-user',
  memberClientID: 'test-client',
  isDemoMember: false,
  isAmplifyMem: false,
  getGroupType: 'standard',
  isBlueEliteGroup: false,
  isMedical: true,
  isDental: false,
  isVision: false,
  isWellnessOnly: false,
  isCobraEligible: false,
  isChatbotEligible: true,
  isChatEligibleMember: true,
  memberMedicalPlanID: 'test-plan',
  isIDCardEligible: true,
  memberDOB: '1990-01-01',
  subscriberID: 'test-subscriber',
  sfx: '01',
  routingchatbotEligible: true,
  idCardChatBotName: 'IDCardBot',
  coverage_eligibility: 'eligible',
  cloudChatEligible: false,
};
