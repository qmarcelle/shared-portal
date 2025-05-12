// lib/adapters/serviceRegistry.ts
import { RestAdapter } from './rest/restAdapter';
import { SoapAdapter } from './soap/soapAdapter';
import { ServiceConfig, getServiceConfig } from '@/lib/config/serviceConfig';
import { ServiceAdapter } from './serviceAdapter';

/**
 * Factory function that returns the appropriate service adapter
 * based on service configuration
 */
export function getServiceAdapter(domain: string, service: string): ServiceAdapter {
  const config = getServiceConfig(domain, service);
  
  switch (config.type) {
    case 'REST':
      return new RestAdapter(config);
    case 'SOAP':
      return new SoapAdapter(config);
    default:
      throw new Error(`Unsupported service type: ${config.type}`);
  }
}

// lib/adapters/serviceAdapter.ts
import { ServiceResult } from '@/lib/utils/serviceResult';
import { ServiceConfig } from '@/lib/config/serviceConfig';

export interface ServiceAdapter {
  readonly config: ServiceConfig;
  
  /**
   * Execute an operation on the service
   * @param operation The operation name to execute
   * @param params The parameters to pass to the operation
   * @returns A ServiceResult containing the result
   */
  execute(operation: string, params: Record<string, any>): Promise<ServiceResult<any>>;
}

// lib/adapters/rest/restAdapter.ts
import { ServiceAdapter } from '../serviceAdapter';
import { ServiceConfig } from '@/lib/config/serviceConfig';
import { ServiceResult } from '@/lib/utils/serviceResult';
import { RestClient } from '@/lib/clients/rest/restClient';
import { transformRequest, transformResponse } from './restTransformers';
import { logger } from '@/lib/utils/logging';

export class RestAdapter implements ServiceAdapter {
  constructor(readonly config: ServiceConfig) {}
  
  async execute(operation: string, params: Record<string, any>): Promise<ServiceResult<any>> {
    try {
      const client = new RestClient(this.config);
      
      // Transform request params based on service expectations
      const transformedParams = transformRequest(operation, params, this.config);
      
      // Execute the operation
      const response = await client.request(
        operation,
        transformedParams
      );
      
      // Transform response based on domain model expectations
      const transformedResult = transformResponse(operation, response, this.config);
      
      return ServiceResult.success(transformedResult);
    } catch (error) {
      logger.error('REST adapter execution error', { operation, error });
      return ServiceResult.failure(`Failed to execute ${operation}`, error);
    }
  }
}

// lib/adapters/soap/soapAdapter.ts
import { ServiceAdapter } from '../serviceAdapter';
import { ServiceConfig } from '@/lib/config/serviceConfig';
import { ServiceResult } from '@/lib/utils/serviceResult';
import { SoapClient } from '@/lib/clients/soap/soapClient';
import { transformRequest, transformResponse } from './soapTransformers';
import { logger } from '@/lib/utils/logging';

export class SoapAdapter implements ServiceAdapter {
  constructor(readonly config: ServiceConfig) {}
  
  async execute(operation: string, params: Record<string, any>): Promise<ServiceResult<any>> {
    try {
      const client = new SoapClient(this.config);
      
      // Transform request params based on SOAP service expectations
      const transformedParams = transformRequest(operation, params, this.config);
      
      // Execute the SOAP operation
      const response = await client.execute(
        operation,
        transformedParams
      );
      
      // Transform XML response to domain model
      const transformedResult = transformResponse(operation, response, this.config);
      
      return ServiceResult.success(transformedResult);
    } catch (error) {
      logger.error('SOAP adapter execution error', { operation, error });
      return ServiceResult.failure(`Failed to execute ${operation}`, error);
    }
  }
}
