/**
 * SSO module exports
 *
 * This file serves as the main entry point for the SSO functionality.
 * Import from this file to access the SSO services.
 */

// Export server action wrappers for services
export {
  checkSSODropOffSupport,
  generateSSOParameters,
  getProviderDisplayName,
  performDropOffSSO,
} from './actions/ssoServiceActions';

export {
  buildDirectSSOUrl,
  generateDropOffSSOUrl,
  generateSSOUrl,
} from './actions/urlServiceActions';

// Export provider actions
export {
  checkProviderDropOffSupport,
  generateProviderParameters,
  getProviderNameById,
} from './actions/providerActions';

// Export service classes (for use in server components only, not client components)
export { SSOService } from './services/SSOService';
export { URLService } from './services/URLService';

// Export configuration
export { SSOConfig, SSOEnvironmentConfig } from './config';

// Export provider factory (for server components only)
export { ProviderFactory } from './providers/ProviderFactory';

// Export types
export * from './models/types';

// Export original server actions
export { default as buildSSOPing } from './actions/buildSSOPing';
export { default as ssoDropOffToPing } from './actions/dropOffToPing';
export { getSDKToken } from './actions/getSDKToken';
export {
  challengeDropOffToPing,
  default as dropOffToPing,
} from './actions/pingDropOff';
export { default as postToPing } from './actions/postToPing';
