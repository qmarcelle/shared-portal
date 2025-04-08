/**
 * Type definitions for utility functions
 * This file provides compatibility with external types
 */

/**
 * LoggedInUserInfo interface - compatibility with external module
 */
export interface LoggedInUserInfo {
  subscriberID?: string;
  subscriberFirstName?: string;
  subscriberLastName?: string;
  subscriberDateOfBirth?: string | number;
  members?: Array<{
    planDetails: Array<{
      productCategory: string;
      planID?: string;
    }>;
    memberSuffix?: string;
  }>;
  groupData?: {
    groupID?: string;
    policyType?: string;
    groupName?: string;
  };
  coverageTypes?: Array<{
    productType: string;
  }>;
  authFunctions?: Array<{
    functionName: string;
    available: boolean;
  }>;
}
