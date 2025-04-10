/**
 * Genesys Chat Configuration
 * This file provides access to the Genesys configuration loaded from /public/genesys-config.js
 */

import { z } from 'zod';
import type { ChatConfig } from '../schemas/config';
import { chatConfigSchema } from '../schemas/config';
import {
  businessHoursSchema,
  chatDataPayloadSchema,
  ChatInfoResponse,
} from '../schemas/user';

// Base configuration type
interface BaseConfig {
  planId: string;
  chatGroup: string;
  chatBotName: string;
  userData: {
    SERV_Type: string;
    INQ_TYPE: string;
    RoutingChatbotInteractionId: string;
    Origin: string;
    Source: string;
    PLAN_ID: string;
    MEMBER_ID: string;
    firstname: string;
    lastname: string;
  };
}

// Cloud-specific configuration
interface CloudConfig extends BaseConfig {
  deploymentId: string;
  region: string;
  useNativeBusinessHours: boolean;
  termsAndConditionsType: string;
  headerExtensions: string[];
}

// On-prem specific configuration
interface OnPremConfig extends BaseConfig {
  displayName: string;
  legacyOptions: Record<string, unknown>;
}

// Configuration options
export interface GenesysConfigOptions {
  type: 'cloud' | 'onprem';
  eligibility: ChatInfoResponse;
  memberId: string;
  planId: string;
  planName: string;
  hasMultiplePlans: boolean;
}

// Reference the global variables
declare global {
  interface Window {
    Genesys?: {
      Chat?: {
        updateUserData: (data: Record<string, any>) => Promise<void>;
        createChatWidget: (config: CloudConfig | OnPremConfig) => any;
        setBusinessHours: (hours: string) => void;
        setTheme: (theme: NonNullable<ChatConfig['styling']>['theme']) => void;
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

// Default styling configuration
export const CHAT_STYLES = {
  theme: {
    primaryColor: '#0066CC',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
  },
} as const;

// Default business hours configuration
export const BUSINESS_HOURS_CONFIG = {
  format: 'DAY_DAY_HOUR_HOUR' as const,
  value: 'M_F_8_6',
  timezone: 'America/New_York',
  days: [
    { day: 'Monday', hours: '8:00 AM - 6:00 PM' },
    { day: 'Tuesday', hours: '8:00 AM - 6:00 PM' },
    { day: 'Wednesday', hours: '8:00 AM - 6:00 PM' },
    { day: 'Thursday', hours: '8:00 AM - 6:00 PM' },
    { day: 'Friday', hours: '8:00 AM - 6:00 PM' },
  ],
} as const;

// Get Genesys configuration based on type
export function getGenesysConfig(
  options: GenesysConfigOptions,
): CloudConfig | OnPremConfig {
  const { type, eligibility, memberId, planId, planName, hasMultiplePlans } =
    options;

  // Common configuration
  const baseConfig: BaseConfig = {
    planId,
    chatGroup: eligibility.chatGroup,
    chatBotName: 'BCBST Chat Bot', // Default name since it's not in the response
    userData: {
      SERV_Type: 'MemberPortal',
      INQ_TYPE: 'MEM',
      RoutingChatbotInteractionId: '',
      Origin: 'portal',
      Source: 'MemberPortal',
      PLAN_ID: planId,
      MEMBER_ID: memberId,
      firstname: '', // To be populated from user data
      lastname: '', // To be populated from user data
    },
  };

  // Cloud-specific configuration
  if (type === 'cloud') {
    return {
      ...baseConfig,
      deploymentId: process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || 'default',
      region: process.env.NEXT_PUBLIC_GENESYS_REGION || 'default',
      useNativeBusinessHours: true,
      termsAndConditionsType: eligibility.chatGroup || 'default',
      headerExtensions: hasMultiplePlans ? ['planInfoExtension'] : [],
    };
  }

  // On-prem specific configuration
  return {
    ...baseConfig,
    displayName: 'Chat with BCBST',
    legacyOptions: {
      customHeader: hasMultiplePlans
        ? `Chatting about: ${planName}`
        : undefined,
    },
  };
}

// Function to update user data
export async function updateUserData(
  userData: z.infer<typeof chatDataPayloadSchema>,
): Promise<void> {
  if (typeof window !== 'undefined' && window.Genesys?.Chat?.updateUserData) {
    try {
      const validatedData = chatDataPayloadSchema.parse(userData);
      await window.Genesys.Chat.updateUserData(validatedData);
    } catch (err) {
      console.error('Error updating Genesys user data:', err);
      throw err;
    }
  }
}

// Function to update business hours
export function updateBusinessHours(
  hours: z.infer<typeof businessHoursSchema>,
): void {
  if (typeof window !== 'undefined' && window.Genesys?.Chat?.setBusinessHours) {
    try {
      const validatedHours = businessHoursSchema.parse(hours);
      window.Genesys.Chat.setBusinessHours(validatedHours.value);
    } catch (err) {
      console.error('Error updating business hours:', err);
      throw err;
    }
  }
}

// Function to update theme
export function updateTheme(config: ChatConfig): void {
  if (
    typeof window !== 'undefined' &&
    window.Genesys?.Chat?.setTheme &&
    config.styling?.theme
  ) {
    try {
      const validatedConfig = chatConfigSchema.parse(config);
      if (validatedConfig.styling?.theme) {
        window.Genesys.Chat.setTheme(validatedConfig.styling.theme);
      }
    } catch (err) {
      console.error('Error updating theme:', err);
      throw err;
    }
  }
}

// Function to create chat widget
export function createChatWidget(
  config: Partial<CloudConfig | OnPremConfig>,
): void {
  if (typeof window !== 'undefined' && window.Genesys?.Chat?.createChatWidget) {
    // Ensure required fields are present
    if (
      !config.planId ||
      !config.chatGroup ||
      !config.chatBotName ||
      !config.userData
    ) {
      throw new Error('Missing required configuration fields');
    }
    window.Genesys.Chat.createChatWidget(config as CloudConfig | OnPremConfig);
  }
}
