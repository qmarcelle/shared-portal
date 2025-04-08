/**
 * Mocks for external dependencies
 * These are temporary implementations until the real ones are available
 */

import type { LoggedInUserInfo } from '../utils/types';

// Mock for auth function
export const auth = async () => {
  return {
    user: {
      currUsr: {
        plan: {
          memCk: 'test-member-ck',
        },
      },
    },
  };
};

// Mock for getLoggedInUserInfo function
export const getLoggedInUserInfo = async (
  memCk: string,
): Promise<LoggedInUserInfo> => {
  return {
    subscriberID: 'test-subscriber',
    subscriberFirstName: 'John',
    subscriberLastName: 'Doe',
    subscriberDateOfBirth: '1980-01-01',
    members: [
      {
        planDetails: [
          {
            productCategory: 'M',
            planID: 'test-plan',
          },
        ],
        memberSuffix: '01',
      },
    ],
    groupData: {
      groupID: 'test-group',
      policyType: 'test-policy',
      groupName: 'Test Group',
    },
    coverageTypes: [
      { productType: 'M' },
      { productType: 'D' },
      { productType: 'V' },
    ],
    authFunctions: [
      { functionName: 'CHAT_ELIGIBLE', available: true },
      { functionName: 'COBRAELIGIBLE', available: true },
      { functionName: 'IDPROTECTELIGIBLE', available: true },
    ],
  };
};
