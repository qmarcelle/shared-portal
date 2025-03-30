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

export enum ChatType {
  BlueCareChat = 'BlueCare_Chat',
  SeniorCareChat = 'SCD_Chat',
  DefaultChat = 'MBAChat',
}

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
  idCardChatBotName?: string;

  // Added fields based on user stories
  RoutingChatbotInteractionId?: string;
  coverage_eligibility?: string;
  lob_group?: string;
  Origin?: string;
  Source?: string;
}

export interface ChatConfig {
  endPoint: string;
  demoEndPoint: string;
  token: string;
  coBrowseLicence: string;
  cobrowseSource: string;
  cobrowseURL: string;
  opsPhone: string;
  opsPhoneHours: string;
  userID: string;
  memberFirstname: string;
}

export type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
};

export type ChatOption = {
  text: string;
  value: string;
  disabled?: boolean;
  selected?: boolean;
};

export type CobrowseState = 'inactive' | 'pending' | 'active';

// Plan switching related types
export interface PlanInfo {
  planId: string;
  planName: string;
  lineOfBusiness: string; // Maps to ClientType
  isEligibleForChat: boolean;
  businessHours?: string;
}

export interface MemberPlans {
  activePlan: PlanInfo;
  availablePlans: PlanInfo[];
  hasMultiplePlans: boolean;
}

// Chat store state extension for plan switching
export interface PlanSwitcherState {
  isPlanSwitcherLocked: boolean;
  currentPlan: PlanInfo | null;
  lockPlanSwitcher: () => void;
  unlockPlanSwitcher: () => void;
  updateCurrentPlan: (plan: PlanInfo) => void;
}
