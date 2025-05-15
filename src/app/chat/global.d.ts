/**
 * TypeScript declarations for global window objects used in chat
 * Imports types from the centralized genesys.types.ts file
 */

import { ChatSettings, CXBus, GenesysGlobal, GenesysWindow } from './types';

// Removed duplicate GenesysWidgets interface - now imported from genesys.types.ts

// Extend the global Window interface with Genesys-specific properties
declare global {
  interface Window extends GenesysWindow {
    // Add any additional window properties here that aren't in GenesysWindow

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
}
