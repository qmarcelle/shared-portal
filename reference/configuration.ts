// lib/config/serviceConfig.ts
import { env } from '@/lib/config/env';

export interface ServiceOperation {
  method?: string;
  path: string;
  queryParams?: string[];
  requestTransformer?: string;
  responseTransformer?: string;
}

export interface ServiceSecurity {
  type: 'wssecurity' | 'custom';
  username?: string;
  password?: string;
  hasTimeStamp?: boolean;
  header?: Record<string, any>;
}

export interface ServiceConfig {
  serviceName: string;
  interfaceName?: string;
  type: 'REST' | 'SOAP';
  environment: string;
  headers?: Record<string, string>;
  operations: Record<string, ServiceOperation>;
  security?: ServiceSecurity;
  soapOptions?: Record<string, any>;
  mockResponses?: Record<string, any>;
}

// Service configuration map
const serviceConfigs: Record<string, Record<string, ServiceConfig>> = {
  member: {
    profile: {
      serviceName: 'MemberService',
      interfaceName: 'MemberAddressService',
      type: 'SOAP',
      environment: env.DEPLOYMENT_ENV,
      operations: {
        getProfile: {
          path: '/GetMemberProfile',
          requestTransformer: 'transformGetProfileRequest',
          responseTransformer: 'transformGetProfileResponse'
        },
        updateProfile: {
          path: '/UpdateMemberProfile',
          requestTransformer: 'transformUpdateProfileRequest',
          responseTransformer: 'transformUpdateProfileResponse'
        }
      },
      security: {
        type: 'wssecurity',
        username: env.MEMBER_SERVICE_USERNAME,
        password: env.MEMBER_SERVICE_PASSWORD,
        hasTimeStamp: true
      }
    }
  },
  benefits: {
    plans: {
      serviceName: 'BenefitsService',
      type: 'REST',
      environment: env.DEPLOYMENT_ENV,
      operations: {
        getPlans: {
          method: 'GET',
          path: '/plans',
          queryParams: ['year', 'status']
        },
        getPlanDetails: {
          method: 'GET',
          path: '/plans/:planId',
        },
        enrollInPlan: {
          method: 'POST',
          path: '/enrollment'
        }
      },
      headers: {
        'x-api-key': env.BENEFITS_API_KEY
      }
    }
  },
  // Define other service configurations here
};

/**
 * Get service configuration for a specific domain and service
 */
export function getServiceConfig(domain: string, service: string): ServiceConfig {
  const config = serviceConfigs[domain]?.[service];
  
  if (!config) {
    throw new Error(`Service configuration not found for ${domain}.${service}`);
  }
  
  return config;
}

// lib/config/endpoints.ts
import { env } from '@/lib/config/env';

// Endpoint mapping by environment and service
const endpoints: Record<string, Record<string, string>> = {
  dev: {
    'MemberService': 'https://dvlp-js.bcbst.com/MemberServiceWeb',
    'BenefitsService': 'https://dvlp-js.bcbst.com/PortalServices/BenefitService',
    'IDCardService': 'https://dvlp-js.bcbst.com/PortalServices/IDCardService',
    // Other service endpoints for dev environment
  },
  test: {
    'MemberService': 'https://test-js.bcbst.com/MemberServiceWeb',
    'BenefitsService': 'https://test-js.bcbst.com/PortalServices/BenefitService',
    'IDCardService': 'https://test-js.bcbst.com/PortalServices/IDCardService',
    // Other service endpoints for test environment
  },
  prod: {
    'MemberService': 'https://js.bcbst.com/MemberServiceWeb',
    'BenefitsService': 'https://js.bcbst.com/PortalServices/BenefitService',
    'IDCardService': 'https://js.bcbst.com/PortalServices/IDCardService',
    // Other service endpoints for prod environment
  }
};

/**
 * Get endpoint URL for a service in the current environment
 */
export function getEnvironmentEndpoint(serviceName: string, environment = env.DEPLOYMENT_ENV): string {
  const serviceEndpoints = endpoints[environment];
  
  if (!serviceEndpoints) {
    throw new Error(`Endpoints not configured for environment: ${environment}`);
  }
  
  const endpoint = serviceEndpoints[serviceName];
  
  if (!endpoint) {
    throw new Error(`Endpoint not configured for service ${serviceName} in environment ${environment}`);
  }
  
  return endpoint;
}
