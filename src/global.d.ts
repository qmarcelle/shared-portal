import { OAuth } from './models/enterprise/oAuth';

declare global {
  // eslint-disable-next-line no-var
  var accessToken: OAuth;
  interface Window {
    Genesys?: any;
    _genesys?: any;
    CXBus?: any;
    MessengerWidget?: any;
    _pingOneSignals: PingOneSignals;
    _pingOneSignalsReady: boolean;
    dataLayer: Record<string, unknown>[];
    chatSettings?: {
      clickToChatToken?: string;
      clickToChatEndpoint?: string;
      clickToChatDemoEndPoint?: string;
      coBrowseLicence?: string;
      opsPhone?: string;
      opsPhoneHours?: string;
      isChatEligibleMember?: string;
      isDemoMember?: string;
      isAmplifyMem?: string;
      formattedFirstName?: string;
      memberLastName?: string;
      groupId?: string;
      subscriberID?: string;
      sfx?: string;
      memberDOB?: string;
      memberMedicalPlanID?: string;
      groupType?: string;
      isMedical?: string;
      isDental?: string;
      isVision?: string;
      isWellnessOnly?: string;
      isCobraEligible?: string;
      isIDCardEligible?: string;
      isChatbotEligible?: string;
      chatHours?: string;
      rawChatHours?: string;
      isChatAvailable?: string;
      routingchatbotEligible?: boolean;
      memberClientID?: string;
      isBlueEliteGroup?: string;
      selfServiceLinks?: Array<{key: string, value: string}>;
      idCardChatBotName?: string;
    };
    startChat?: () => void;
    endChat?: () => void;
    startCoBrowseCall?: () => void;
    endCoBrowseCall?: () => void;
    OpenChatDisclaimer?: () => void;
    CloseChatDisclaimer?: () => void;
    CloseChatConnectionError?: () => void;
    openGenesysChat?: () => void;
    GenesysWidget?: any;
    ChatWidget?: any;
  }
}

export type { };

