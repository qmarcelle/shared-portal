import { ChatSettings } from './app/chat/types';
import { OAuth } from './models/enterprise/oAuth';

// PingOne integration types
interface PingOneSignals {
  ready?: boolean;
  [key: string]: any;
}

// Chat-specific global types - moved into Window interface for better type inference

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
    Genesys?: {
      (command: string, ...args: any[]): any;
      WebMessenger?: {
        destroy: () => void;
        [key: string]: any;
      };
      c?: any;
    };
    _genesys?: GenesysGlobal;
    CXBus?: {
      command: (command: string, ...args: any[]) => any;
      subscribe: (event: string, callback: (...args: any[]) => void) => void;
      unsubscribe: (event: string) => void;
      registerPlugin?: (name: string, config: any) => void;
      on: (event: string, callback: (...args: any[]) => void) => void;
      runtime: {
        unsubscribe: (event: string) => void;
        command: (command: string, ...args: any[]) => any;
      };
    };
    MessengerWidget?: {
      on?: (event: string, callback: (...args: any[]) => void) => void;
      off?: (event: string, callback: (...args: any[]) => void) => void;
      [key: string]: any;
    };
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

// Define the shape rather than implementation
export interface ChatErrorShape extends Error {
  code: string;
  name: 'ChatError';
}

export type {};
