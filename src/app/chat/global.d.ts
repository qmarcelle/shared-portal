/**
 * TypeScript declarations for global window objects used in chat
 */

interface CXBus {
  command: (command: string, ...args: any[]) => any;
  subscribe: (event: string, callback: (...args: any[]) => void) => void;
  unsubscribe: (event: string) => void;
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
    [key: string]: any;
  };
  [key: string]: any;
}

interface GenesysGlobal {
  widgets: GenesysWidgets;
  [key: string]: any;
}
//test
interface ChatSettings {
  widgetUrl: string;
  bootstrapUrl?: string;
  clickToChatJs: string;
  clickToChatEndpoint: string;
  chatTokenEndpoint: string;
  coBrowseEndpoint: string;
  opsPhone: string;
  opsPhoneHours: string;
  [key: string]: any;
}

interface Window {
  // Genesys Chat related globals
  CXBus?: CXBus;
  _genesys?: GenesysGlobal;
  Genesys?: (command: string, ...args: any[]) => any;
  openGenesysChat?: () => void;
  chatSettings?: ChatSettings;

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
