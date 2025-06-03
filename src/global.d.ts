/**
 * CONSOLIDATED GLOBAL TYPE DECLARATIONS
 *
 * This file contains all global Window interface extensions for the application.
 * It serves as a single source of truth for Window extensions.
 */

import { GenesysWindow } from './app/chat/types/chat-types';

declare global {
  interface Window extends GenesysWindow {
    // Custom events for Genesys chat
    addEventListener(
      type:
        | 'genesys-ready'
        | 'genesys:webchat:opened'
        | 'genesys:message:received'
        | 'genesys:webchat:error'
        | 'genesys:webchat:submitted'
        | 'genesys:create-button',
      listener: (this: Window, ev: Event) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener(
      type:
        | 'genesys-ready'
        | 'genesys:webchat:opened'
        | 'genesys:message:received'
        | 'genesys:webchat:error'
        | 'genesys:webchat:submitted'
        | 'genesys:create-button',
      listener: (this: Window, ev: Event) => any,
      options?: boolean | EventListenerOptions,
    ): void;

    // Add any other global window properties here
  }
}
