/**
 * SSO configuration system
 *
 * This file centralizes configuration for SSO providers, making it easier
 * to manage and modify SSO settings.
 */

/**
 * Provider-specific configuration
 */
export interface ProviderConfig {
  // Display name of the provider
  name: string;

  // Whether this provider supports drop-off SSO
  supportsDropOff: boolean;

  // Required parameters for this provider
  requiredParameters: string[];

  // Default deep link targets
  deepLinks: Record<string, string>;
}

/**
 * Configuration for all SSO providers
 */
export const SSOConfig: Record<string, ProviderConfig> = {
  // Teladoc configuration
  [process.env.NEXT_PUBLIC_IDP_TELADOC || 'teladoc']: {
    name: 'Teladoc',
    supportsDropOff: true,
    requiredParameters: [
      'subscriberId',
      'firstName',
      'lastName',
      'dateOfBirth',
    ],
    deepLinks: {
      default: '/',
    },
  },

  // Eyemed configuration
  [process.env.NEXT_PUBLIC_IDP_EYEMED || 'eyemed']: {
    name: 'Eyemed',
    supportsDropOff: true,
    requiredParameters: [
      'subscriberId',
      'firstName',
      'lastName',
      'dateOfBirth',
      'clientId',
    ],
    deepLinks: {
      EYEMED_VISION: 'know-before-you-go',
      EYEMED_PROVIDER_DIRECTORY: 'provider-locator',
    },
  },

  // Provider Directory configuration
  [process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY || 'provider-directory']: {
    name: 'Find a Doctor',
    supportsDropOff: true,
    requiredParameters: [
      'subscriberId',
      'firstName',
      'lastName',
      'dateOfBirth',
      'network',
    ],
    deepLinks: {
      PROV_DIR_MEDICAL: '?guided_search=wayfinding_home_findCost_header',
      PROV_DIR_DENTAL: '?guided_search=wayfinding_home_DentalCare_header',
      PROV_DIR_VISION: '?guided_search=wayfinding_tile_cost_vision_health',
      PROV_DIR_MENTAL_HEALTH:
        '?guided_search=wayfinding_tile_cost_behavioral_health',
    },
  },

  // Blue365 configuration
  [process.env.NEXT_PUBLIC_IDP_BLUE_365 || 'blue365']: {
    name: 'Blue 365',
    supportsDropOff: true,
    requiredParameters: ['firstName', 'lastName', 'subject'],
    deepLinks: {
      BLUE_365_FOOTWEAR: 'offer-category-apparel-footwear',
      BLUE_365_FITNESS: 'offer-category-fitness',
      BLUE_365_HEARING_VISION: 'offer-category-hearing-vision',
      BLUE_365_HOME_FAMILY: 'offer-category-home-family',
      BLUE_365_NUTRITION: 'offer-category-nutrition',
      BLUE_365_PERSONAL_CARE: 'offer-category-personal-care',
      BLUE_365_TRAVEL: 'offer-category-travel',
    },
  },

  // Chip Rewards configuration
  [process.env.NEXT_PUBLIC_IDP_CHIP_REWARDS || 'chip-rewards']: {
    name: 'Chip Rewards',
    supportsDropOff: true,
    requiredParameters: ['subject'],
    deepLinks: {
      default: '/',
    },
  },

  // CVS Caremark configuration
  [process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK || 'cvs-caremark']: {
    name: 'CVS Caremark',
    supportsDropOff: true,
    requiredParameters: ['firstName', 'lastName', 'dateOfBirth', 'clientId'],
    deepLinks: {
      CVS_REFILL_RX: 'refillRx',
      CVS_DRUG_SEARCH_INIT: 'drugSearchInit.do',
      CVS_PHARMACY_SEARCH_FAST: 'pharmacySearchFast',
    },
  },

  // Electronic Payment BOA configuration
  [process.env.NEXT_PUBLIC_IDP_ELECTRONIC_PAYMENT_BOA ||
  'electronic-payment-boa']: {
    name: 'Electronic Payment BOA',
    supportsDropOff: true,
    requiredParameters: ['subject', 'partnerKey', 'partnerSignatureKey'],
    deepLinks: {
      default: '/',
    },
  },

  // Embold configuration
  [process.env.NEXT_PUBLIC_IDP_EMBOLD || 'embold']: {
    name: 'Embold',
    supportsDropOff: true,
    requiredParameters: ['subject', 'lastName', 'gender'],
    deepLinks: {
      default: '/',
    },
  },

  // Health Equity configuration
  [process.env.NEXT_PUBLIC_IDP_HEALTH_EQUITY || 'health-equity']: {
    name: 'Health Equity',
    supportsDropOff: true,
    requiredParameters: ['subject', 'personId', 'accountType'],
    deepLinks: {
      default: '/',
    },
  },

  // HSA Bank configuration
  [process.env.NEXT_PUBLIC_IDP_HSA_BANK || 'hsa-bank']: {
    name: 'HSA Bank',
    supportsDropOff: true,
    requiredParameters: ['subject', 'firstName', 'lastName'],
    deepLinks: {
      default: '/',
    },
  },

  // Instamed configuration
  [process.env.NEXT_PUBLIC_IDP_INSTAMED || 'instamed']: {
    name: 'Instamed',
    supportsDropOff: true,
    requiredParameters: ['subject'],
    deepLinks: {
      default: '/',
    },
  },

  // M3P configuration
  [process.env.NEXT_PUBLIC_IDP_M3P || 'm3p']: {
    name: 'M3P',
    supportsDropOff: true,
    requiredParameters: ['subject', 'clientId', 'programId'],
    deepLinks: {
      default: '/',
    },
  },

  // On Life configuration
  [process.env.NEXT_PUBLIC_IDP_ON_LIFE || 'on-life']: {
    name: 'On Life',
    supportsDropOff: true,
    requiredParameters: ['subject'],
    deepLinks: {
      default: '/',
      challenge: '/ChallengeDetails',
    },
  },

  // Pinnacle Bank configuration
  [process.env.NEXT_PUBLIC_IDP_PINNACLE_BANK || 'pinnacle-bank']: {
    name: 'Pinnacle Bank',
    supportsDropOff: true,
    requiredParameters: ['subject', 'accountType'],
    deepLinks: {
      default: '/',
    },
  },

  // Premise Health configuration
  [process.env.NEXT_PUBLIC_IDP_PREMISE_HEALTH || 'premise-health']: {
    name: 'Premise Health',
    supportsDropOff: true,
    requiredParameters: [
      'subject',
      'employerId',
      'employeeId',
      'birthYear',
      'zipCode',
    ],
    deepLinks: {
      default: '/',
    },
  },

  // Vitals PRP configuration
  [process.env.NEXT_PUBLIC_IDP_VITALSPRP || 'vitals-prp']: {
    name: 'Vitals PRP',
    supportsDropOff: true,
    requiredParameters: ['subject', 'firstName', 'lastName', 'dateOfBirth'],
    deepLinks: {
      default: '/',
    },
  },
};

/**
 * Common parameters required by all or most providers
 */
export const CommonParameters = [
  'subscriberId',
  'firstName',
  'lastName',
  'dateOfBirth',
  'memberId',
  'subject',
];

/**
 * Environment configuration settings for SSO
 */
export const SSOEnvironmentConfig = {
  // Whether drop-off SSO is enabled
  dropOffSSOEnabled:
    process.env.NEXT_PUBLIC_PINGONE_SSO_ENABLED?.toLocaleLowerCase() === 'true',

  // URL for the Ping REST API
  pingRestUrl: process.env.NEXT_PUBLIC_PING_REST_URL,

  // URL for the Ping Drop-Off API
  pingDropOffUrl: process.env.NEXT_PUBLIC_PING_DROP_OFF_URL,
};
