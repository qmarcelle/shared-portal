import { ChatSettings } from './app/chat/types';
import { OAuth } from './models/enterprise/oAuth';

// Chat-specific global types
interface CXBus {
  command: (command: string, ...args: any[]) => any;
  subscribe: (event: string, callback: (...args: any[]) => void) => void;
  unsubscribe: (event: string) => void;
  registerPlugin?: (name: string, config: any) => void;
}

interface GenesysWidgets {
  webchat: {
    chatButton?: {
      enabled: boolean;
      openDelay: number;
      effectDuration: number;
      hideDuringInvite: boolean;
      template: string;
    };
    position?: {
      bottom: { px: number };
      right: { px: number };
      width: { pct: number };
      height: { px: number };
    };
    open?: () => void;
    [key: string]: any;
  };
  [key: string]: any;
}

interface GenesysGlobal {
  widgets: GenesysWidgets;
  [key: string]: any;
}

declare global {
  // eslint-disable-next-line no-var
  var accessToken: OAuth;
  interface Window {
    Genesys?: (command: string, ...args: any[]) => any;
    _genesys?: GenesysGlobal;
    CXBus?: CXBus;
    MessengerWidget?: any;
    _pingOneSignals: PingOneSignals;
    _pingOneSignalsReady: boolean;
    dataLayer: Record<string, unknown>[];
    chatSettings?: ChatSettings;
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

    // Events
    addEventListener(
      type: 'genesys-ready',
      listener: (this: Window, ev: Event) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener(
      type: 'genesys-ready',
      listener: (this: Window, ev: Event) => any,
      options?: boolean | EventListenerOptions,
    ): void;
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
