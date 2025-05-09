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
      bootstrapUrl: string;
      widgetUrl: string;
      clickToChatJs: string;
      clickToChatEndpoint: string;
      chatTokenEndpoint: string;
      coBrowseEndpoint: string;
      opsPhone: string;
      opsPhoneHours: string;
      [key: string]: any;
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
    __genesysInitialized?: boolean;
  }
}

// --- Chat Types (inferred from usage) ---
export type ChatDataPayload = {
  PLAN_ID: string;
  GROUP_ID: string;
  LOB: string;
  lob_group: string;
  IsMedicalEligibile: boolean;
  IsDentalEligible: boolean;
  IsVisionEligible: boolean;
  Origin: string;
  Source: string;
  [key: string]: any; // Allow for additional dynamic fields
};

export class ChatError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = 'ChatError';
    this.code = code;
  }
}

export type {};
