/**
 * Configuration type definitions
 * Centralized type definitions for application configuration
 */

export interface GenesysConfig {
  deploymentId: string;
  environment: string;
  orgId?: string;
  customAttributes?: {
    Firstname?: string;
    lastname?: string;
    MEMBER_ID?: string;
    MEMBER_DOB?: string;
    GROUP_ID?: string;
    PLAN_ID?: string;
    INQ_TYPE?: string;
    isMedicalEligible?: string;
    IsDentalEligible?: string;
    IsVisionEligible?: string;
    IDCardBotName?: string;
    LOB?: string;
  };
}

export interface PortalConfig {
  url: string;
}

export interface ClientConfig {
  genesys: GenesysConfig;
  portal: PortalConfig;
}

export interface ServerConfig {
  portalServices: {
    url: string;
    memberServiceRoot: string;
  };
  elasticSearch: {
    apiUrl: string;
    portalServicesApiUrl: string;
  };
}

export type PublicConfig = Record<string, never>;

export interface AppConfig {
  client: ClientConfig;
  server: ServerConfig;
  public: PublicConfig;
}
