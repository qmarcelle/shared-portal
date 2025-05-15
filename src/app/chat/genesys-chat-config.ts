import { GenesysChatConfig } from '@/types/genesys-chat';

interface ConfigParams {
  apiConfig: any; // Response from your getChatInfo API
  user: any; // User session data
  staticConfig?: any; // Static values from env
}

// Helper function to convert booleans to string format for Genesys script
function boolToString(value: boolean | undefined | null): string {
  if (value === true) return 'true';
  return 'false';
}

export function buildGenesysChatConfig({
  apiConfig,
  user,
  staticConfig = {},
}: ConfigParams): GenesysChatConfig {
  return {
    // Values from API
    chatMode: apiConfig.cloudEligibility ? 'cloud' : 'legacy',
    // Values from env/static config
    deploymentId:
      process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID ||
      staticConfig.deploymentId ||
      '',
    orgId: process.env.NEXT_PUBLIC_GENESYS_ORG_ID || staticConfig.orgId || '',
    genesysWidgetUrl:
      process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL ||
      staticConfig.genesysWidgetUrl ||
      '/assets/genesys/widgets.min.js',
    // User info
    firstname: user?.firstName || '',
    lastname: user?.lastName || '',
    // Default values if not provided
    chatHours: apiConfig.workingHours || '8am - 8pm ET, Monday - Friday',
    rawChatHrs: apiConfig.rawChatHrs || '8.00_20.00',

    // Convert boolean properties to strings as required by click_to_chat.js
    isChatAvailable: boolToString(
      apiConfig.isChatAvailable ?? apiConfig.chatAvailable ?? true,
    ),
    isChatEligibleMember: boolToString(
      apiConfig.isChatEligibleMember ?? apiConfig.isEligible ?? true,
    ),
    isOOH: boolToString(!apiConfig.chatAvailable),
    isChatBotEligible: boolToString(
      apiConfig.chatBotEligibility ?? apiConfig.isEligible ?? true,
    ),
    isRoutingChatBotEligible: boolToString(
      apiConfig.routingChatBotEligibility ?? false,
    ),
    isCobrowseActive: boolToString(
      apiConfig.coBrowseLicence !== undefined &&
        apiConfig.coBrowseLicence !== '',
    ),

    isDemoMember: 'false',
    isAmplifyMem: 'false',
    selfServiceLinks: [],

    // Any other fields from API
    ...apiConfig,
  };
}

export function validateGenesysChatConfig(config: GenesysChatConfig): {
  isValid: boolean;
  missingFields: string[];
} {
  const requiredFields = [
    'isChatAvailable',
    'deploymentId',
    'orgId',
    'chatMode',
    'firstname',
    'lastname',
    'chatHours',
    'rawChatHrs',
    'isChatEligibleMember',
    'isDemoMember',
    'isAmplifyMem',
    'isCobrowseActive',
  ];
  // Add genesysWidgetUrl as a required field if in legacy mode
  if (config.chatMode === 'legacy') {
    requiredFields.push('genesysWidgetUrl');
  }
  const missingFields = requiredFields.filter(
    (field) =>
      !config[field] && config[field] !== '' && config[field] !== false,
  );
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}
