import { ChatSettings } from '../chat/types';

// Extend the Window interface to include Genesys chat-related properties
interface GenesysWidgets {
  webchat?: {
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
  main?: {
    debug: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

interface GenesysGlobal {
  widgets?: GenesysWidgets;
  [key: string]: any;
}

interface CXBus {
  command: (command: string, ...args: any[]) => any;
  subscribe: (event: string, callback: (...args: any[]) => void) => void;
  unsubscribe: (event: string) => void;
  registerPlugin?: (name: string, config: any) => any;
  [key: string]: any;
}

declare global {
  interface Window {
    _genesys?: GenesysGlobal;
    CXBus?: CXBus;
    chatSettings?: ChatSettings & Record<string, any>;
    GenesysWidget?: any;
  }
}
