/**
 * Genesys Chat Configuration
 * This file provides access to the Genesys configuration loaded from /public/genesys-config.js
 */

// Define the configuration type
export interface GenesysConfig {
  deploymentId: string;
  region: string;
  orgId?: string;
  customAttributes?: Record<string, string>;
}

// Reference the global variables loaded by public/genesys-config.js script
declare global {
  interface Window {
    Genesys?: {
      Chat?: {
        updateUserData: (data: Record<string, any>) => Promise<void>;
        createChatWidget: (config: any) => any;
      };
      WebMessenger?: {
        destroy: () => void;
      };
    };
    GenesysJS?: {
      environment?: string;
      deploymentId?: string;
    };
  }
}

// Export a wrapper to access the config loaded from public/genesys-config.js
export const genesysConfig: GenesysConfig = {
  get deploymentId() {
    if (typeof window !== 'undefined') {
      return (
        window?.GenesysJS?.deploymentId ||
        process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID ||
        ''
      );
    }
    return process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || '';
  },
  get region() {
    if (typeof window !== 'undefined') {
      return (
        window?.GenesysJS?.environment ||
        process.env.NEXT_PUBLIC_GENESYS_REGION ||
        ''
      );
    }
    return process.env.NEXT_PUBLIC_GENESYS_REGION || '';
  },
  get orgId() {
    return process.env.NEXT_PUBLIC_GENESYS_ORG_ID || '';
  },
};

// Function to update user data in Genesys
export function updateUserData(userData: Record<string, any>): void {
  if (typeof window !== 'undefined' && window.Genesys?.Chat?.updateUserData) {
    window.Genesys.Chat.updateUserData(userData).catch((err) =>
      console.error('Error updating Genesys user data:', err),
    );
  } else {
    console.log('Genesys updateUserData not available', userData);
  }
}
