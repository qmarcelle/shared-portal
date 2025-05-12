// lib/config/endpoints.ts
/**
 * Service endpoint configuration
 * 
 * This goes beyond simple env variables by:
 * 1. Supporting tenant-specific endpoints
 * 2. Providing environment-specific defaults
 * 3. Handling path construction
 */

// Environment is determined at build time
const ENV = process.env.NODE_ENV || 'development';

// Base URLs from environment variables
const BASE_URLS = {
  development: {
    member: process.env.MEMBER_SERVICE_URL_DEV || 'https://dev-api.bcbst.com/member',
    benefits: process.env.BENEFITS_SERVICE_URL_DEV || 'https://dev-api.bcbst.com/benefits',
    claims: process.env.CLAIMS_SERVICE_URL_DEV || 'https://dev-api.bcbst.com/claims',
    auth: process.env.AUTH_SERVICE_URL_DEV || 'https://dev-api.bcbst.com/auth',
    providers: process.env.PROVIDERS_SERVICE_URL_DEV || 'https://dev-api.bcbst.com/providers'
  },
  test: {
    member: process.env.MEMBER_SERVICE_URL_TEST || 'https://test-api.bcbst.com/member',
    benefits: process.env.BENEFITS_SERVICE_URL_TEST || 'https://test-api.bcbst.com/benefits',
    claims: process.env.CLAIMS_SERVICE_URL_TEST || 'https://test-api.bcbst.com/claims',
    auth: process.env.AUTH_SERVICE_URL_TEST || 'https://test-api.bcbst.com/auth',
    providers: process.env.PROVIDERS_SERVICE_URL_TEST || 'https://test-api.bcbst.com/providers'
  },
  production: {
    member: process.env.MEMBER_SERVICE_URL_PROD || 'https://api.bcbst.com/member',
    benefits: process.env.BENEFITS_SERVICE_URL_PROD || 'https://api.bcbst.com/benefits',
    claims: process.env.CLAIMS_SERVICE_URL_PROD || 'https://api.bcbst.com/claims',
    auth: process.env.AUTH_SERVICE_URL_PROD || 'https://api.bcbst.com/auth',
    providers: process.env.PROVIDERS_SERVICE_URL_PROD || 'https://api.bcbst.com/providers'
  }
};

// Tenant-specific overrides
const TENANT_OVERRIDES = {
  bluecare: {
    member: {
      development: process.env.BLUECARE_MEMBER_URL_DEV,
      test: process.env.BLUECARE_MEMBER_URL_TEST,
      production: process.env.BLUECARE_MEMBER_URL_PROD
    }
  },
  amplify: {
    member: {
      development: process.env.AMPLIFY_MEMBER_URL_DEV,
      test: process.env.AMPLIFY_MEMBER_URL_TEST,
      production: process.env.AMPLIFY_MEMBER_URL_PROD
    }
  },
  quantum: {
    member: {
      development: process.env.QUANTUM_MEMBER_URL_DEV,
      test: process.env.QUANTUM_MEMBER_URL_TEST,
      production: process.env.QUANTUM_MEMBER_URL_PROD
    }
  }
};

// Service version configuration
const API_VERSIONS = {
  member: 'v1',
  benefits: 'v2',
  claims: 'v1',
  auth: 'v1',
  providers: 'v1'
};

/**
 * Get the appropriate service URL for the given service and tenant
 */
export function getServiceUrl(serviceName: string, tenant?: string): string {
  // Get base URL for current environment
  const baseUrl = BASE_URLS[ENV as keyof typeof BASE_URLS]?.[serviceName as keyof typeof BASE_URLS['development']];
  
  if (!baseUrl) {
    throw new Error(`No base URL configured for service: ${serviceName} in environment: ${ENV}`);
  }
  
  // Check for tenant override
  if (tenant && TENANT_OVERRIDES[tenant as keyof typeof TENANT_OVERRIDES]) {
    const tenantUrl = TENANT_OVERRIDES[tenant as keyof typeof TENANT_OVERRIDES]?.[serviceName as keyof typeof TENANT_OVERRIDES['bluecare']]?.[ENV as keyof typeof TENANT_OVERRIDES['bluecare']['member']];
    
    if (tenantUrl) {
      return tenantUrl;
    }
  }
  
  // Get API version
  const version = API_VERSIONS[serviceName as keyof typeof API_VERSIONS] || 'v1';
  
  // Construct final URL
  return `${baseUrl}/${version}`;
}

// lib/config/tenantConfig.ts
export interface TenantConfig {
  name: string;
  displayName: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
  };
  features: {
    findCare: boolean;
    telemedicine: boolean;
    wellness: boolean;
  };
}

// Tenant configuration
const tenantConfigs: Record<string, TenantConfig> = {
  default: {
    name: 'default',
    displayName: 'BlueCross BlueShield of Tennessee',
    theme: {
      primaryColor: '#00a0d2',
      secondaryColor: '#0056a4',
      logo: '/images/bcbst-logo.svg'
    },
    features: {
      findCare: true,
      telemedicine: true,
      wellness: true
    }
  },
  bluecare: {
    name: 'bluecare',
    displayName: 'BlueCare Tennessee',
    theme: {
      primaryColor: '#0056a4',
      secondaryColor: '#00a0d2',
      logo: '/images/bluecare-logo.svg'
    },
    features: {
      findCare: true,
      telemedicine: true,
      wellness: true
    }
  },
  amplify: {
    name: 'amplify',
    displayName: 'Amplify Health',
    theme: {
      primaryColor: '#6a2c91',
      secondaryColor: '#f58220',
      logo: '/images/amplify-logo.svg'
    },
    features: {
      findCare: true,
      telemedicine: false,
      wellness: true
    }
  },
  quantum: {
    name: 'quantum',
    displayName: 'Quantum Health',
    theme: {
      primaryColor: '#8dc63f',
      secondaryColor: '#003c71',
      logo: '/images/quantum-logo.svg'
    },
    features: {
      findCare: true,
      telemedicine: true,
      wellness: false
    }
  }
};

/**
 * Get tenant configuration
 */
export function getTenantConfig(tenant?: string): TenantConfig {
  if (!tenant || !tenantConfigs[tenant]) {
    return tenantConfigs.default;
  }
  
  return tenantConfigs[tenant];
}
