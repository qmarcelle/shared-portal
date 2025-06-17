export enum ChatDataStatus {
  SUCCESS,
  CHAT_INELIGIBLE,
  ERROR,
}

export interface IChatData {
  clickToChatToken: string | null | undefined;
  routingChatbotEligible: boolean | undefined;
  clickToChatEndpoint: string | undefined;
  clickToChatDemoEndPoint: string | undefined;
  coBrowseLicence: string | undefined;
  coBrowseSource: string | undefined;
  coBrowseURL: string | undefined;
  opsPhone: string;
  opsPhoneHours: string;
  user_id: string;
  user_name: string;
  isDemoMember: boolean;
  isAmplifyMem: boolean;
  groupID: string;
  memberClientID: string;
  groupType: string;
  isDental: boolean;
  isChatAvailable: boolean | undefined;
  isCobraEligible: boolean | undefined;
  workingHrs: string | undefined;
  rawChatHrs: string | undefined;
  chatbotEligible: boolean | undefined;
  memberMedicalPlanId: string;
  isIDCardEligible: boolean | undefined;
  memberDOB: string;
  formattedFirstName: string;
  memberLastName: string;
  isMedical: boolean;
  isVision: boolean;
  idCardChatBotName: string | undefined;
  subscriberId: string;
  sfx: string | number;
  isBlueEliteGroup: boolean | undefined;
  isWellnessOnly: boolean;
  setActive?: (bool: boolean) => void;
}

export interface LegacyChatInfo {
  chatGroup: string;
  workingHours: string;
  chatIDChatBotName: string;
  chatBotEligibility: boolean;
  routingChatBotEligibility: boolean;
  chatAvailable: boolean;
  cloudChatEligible: boolean;
}

declare global {
  interface Window {
    // Removed the single quote here
    chatConfig?: IChatData;
    isMultiplePlan: boolean;
    selectedPlan: string;
    openPlanSelector: () => void;
    lockPlanSelector: (lock: boolean) => void;
  }
}
