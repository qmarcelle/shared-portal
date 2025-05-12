// lib/api/adapters/serviceRegistry.ts
import { RestAdapter } from './rest/restAdapter';
import { SoapAdapter } from './soap/soapAdapter';
import { ServiceAdapter } from './serviceAdapter';
import { getServiceConfig } from '@/lib/api/config/serviceConfig';

/**
 * Factory function that returns the appropriate service adapter
 * based on service configuration and tenant
 */
export function getServiceAdapter(
  domain: string, 
  service: string,
  tenant?: string
): ServiceAdapter {
  // Get service configuration, potentially tenant-specific
  const config = getServiceConfig(domain, service, tenant);
  
  // Create the appropriate adapter based on service type
  switch (config.type) {
    case 'REST':
      return new RestAdapter(config);
    case 'SOAP':
      return new SoapAdapter(config);
    default:
      throw new Error(`Unsupported service type: ${config.type}`);
  }
}
