import { GenesysGlobal } from './types';

declare global {
  interface Window {
    Genesys?: GenesysGlobal;
    _genesys?: {
      widgets: {
        main: {
          theme: string;
          debug: boolean;
          preload: string[];
        };
        webchat: {
          transport: {
            type: string;
            dataURL: string;
            deploymentKey: string;
            orgGuid: string;
            interactionData: {
              routing: {
                targetAddress: string;
                skills: string[];
              };
            };
          };
          emojis: boolean;
          cometD: {
            enabled: boolean;
          };
          autoInvite: {
            enabled: boolean;
            timeToInviteSeconds: number;
            inviteTimeoutSeconds: number;
          };
          chatButton: {
            enabled: boolean;
          };
        };
        [key: string]: any;
      };
    };
    analytics?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

export {};
