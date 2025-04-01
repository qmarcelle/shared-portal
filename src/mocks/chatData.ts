import { ChatConfig, ChatEligibility, Plan } from '../models/chat';

/**
 * Mock chat configuration for testing
 */
export const mockChatConfig: ChatConfig = {
  token: 'mock-jwt-token',
  endPoint: 'https://api.example.com/chat',
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
};

/**
 * Mock user eligibility data for testing
 */
export const mockUserEligibility: ChatEligibility = {
  isEligibleForChat: true,
  isActiveMember: true,
  memberClientID: 'MEMBER123',
  userID: 'USER456',
  coverage_eligibility: true,
  memberFirstName: 'John',
  memberLastName: 'Doe',
  policyID: 'POLICY789',
  memberSince: '2020-01-01',
  isIDCardEligible: true,
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
