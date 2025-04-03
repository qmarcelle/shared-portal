/**
 * Client type enum
 */
export enum ClientType {
  BlueCare = 'BC',
  BlueCarePlus = 'DS',
  CoverTN = 'CT',
  CoverKids = 'CK',
  SeniorCare = 'BA',
  Individual = 'INDV',
  BlueElite = 'INDVMX',
  Default = 'Default',
}

/**
 * Chat type enum
 */
export enum ChatType {
  BlueCareChat = 'BlueCare_Chat',
  SeniorCareChat = 'SCD_Chat',
  DefaultChat = 'MBAChat',
}

/**
 * Plan information
 */
export interface PlanInfo {
  planId: string;
  planName: string;
  lineOfBusiness: string; // Maps to ClientType
  isEligibleForChat: boolean;
  businessHours?: string;
}

/**
 * Member plans
 */
export interface MemberPlans {
  activePlan: PlanInfo;
  availablePlans: PlanInfo[];
  hasMultiplePlans: boolean;
}

/**
 * Basic plan
 */
export interface Plan {
  planId: string;
  planName: string;
  isEligibleForChat: boolean;
  isCurrentPlan: boolean;
}

/**
 * User plan
 */
export interface UserPlan {
  planId: string;
  planName: string;
  isEligibleForChat: boolean;
  membershipNumber?: string;
}
