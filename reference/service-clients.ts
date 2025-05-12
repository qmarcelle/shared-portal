// lib/clients/rest/restClient.ts
import { ServiceConfig } from '@/lib/config/serviceConfig';
import { logger } from '@/lib/utils/logging';
import { getEnvironmentEndpoint } from '@/lib/config/endpoints';

export class RestClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  
  constructor(private config: ServiceConfig) {
    this.baseUrl = getEnvironmentEndpoint(config.serviceName, config.environment);
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.headers
    };
  }
  
  /**
   * Execute a REST request
   */
  async request(
    operation: string,
    params: Record<string, any>
  ): Promise<any> {
    const operationConfig = this.config.operations[operation];
    
    if (!operationConfig) {
      throw new Error(`Operation ${operation} not configured for service ${this.config.serviceName}`);
    }
    
    const { method = 'GET', path, queryParams = [] } = operationConfig;
    
    // Build URL with path parameters
    let url = `${this.baseUrl}${path}`;
    
    // Replace path parameters
    Object.entries(params).forEach(([key, value]) => {
      if (path.includes(`:${key}`)) {
        url = url.replace(`:${key}`, encodeURIComponent(String(value)));
        delete params[key]; // Remove used path params
      }
    });
    
    // Add query parameters
    const queryString = queryParams
      .filter(param => params[param] !== undefined)
      .map(param => `${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`)
      .join('&');
    
    if (queryString) {
      url += `?${queryString}`;
    }
    
    // Build request
    const requestInit: RequestInit = {
      method,
      headers: this.headers,
      credentials: 'include',
    };
    
    // Add body for non-GET requests
    if (method !== 'GET' && method !== 'HEAD') {
      const bodyParams = { ...params };
      
      // Remove query params from body
      queryParams.forEach(param => delete bodyParams[param]);
      
      requestInit.body = JSON.stringify(bodyParams);
    }
    
    logger.debug('REST request', { url, method });
    
    try {
      const response = await fetch(url, requestInit);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`HTTP error ${response.status}: ${errorData.message || response.statusText}`);
      }
      
      // Parse response as JSON
      return await response.json();
    } catch (error) {
      logger.error('REST request failed', { url, error });
      throw error;
    }
  }
}

// lib/clients/soap/soapClient.ts
import { ServiceConfig } from '@/lib/config/serviceConfig';
import { logger } from '@/lib/utils/logging';
import { getEnvironmentEndpoint } from '@/lib/config/endpoints';
import { createClientAsync } from 'soap'; // External soap library
import { XMLParser } from 'fast-xml-parser'; // For parsing XML responses

export class SoapClient {
  private wsdlUrl: string;
  private soapOptions: any;
  private xmlParser: XMLParser;
  
  constructor(private config: ServiceConfig) {
    this.wsdlUrl = `${getEnvironmentEndpoint(config.serviceName, config.environment)}?wsdl`;
    this.soapOptions = {
      disableCache: false,
      endpoint: getEnvironmentEndpoint(config.serviceName, config.environment),
      httpClient: this.httpClientFactory(),
      ...config.soapOptions
    };
    
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "_",
    });
  }
  
  /**
   * Factory for custom HTTP client to handle authentication and special headers
   */
  private httpClientFactory() {
    return async (url: string, data: string, callback: Function, headers: Record<string, string>) => {
      // Add custom headers
      const mergedHeaders = {
        ...headers,
        ...this.config.headers
      };
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: mergedHeaders,
          body: data,
          credentials: 'include'
        });
        
        const responseText = await response.text();
        
        callback(null, {
          statusCode: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseText
        });
      } catch (error) {
        callback(error);
      }
    };
  }
  
  /**
   * Execute SOAP operation
   */
  async execute(operation: string, params: Record<string, any>): Promise<any> {
    try {
      logger.debug('Creating SOAP client', { wsdl: this.wsdlUrl });
      
      // Create SOAP client
      const client = await createClientAsync(this.wsdlUrl, this.soapOptions);
      
      // Add security headers if configured
      this.addSecurity(client);
      
      logger.debug('Executing SOAP operation', { operation });
      
      // Execute SOAP method
      const [result] = await client[operation + 'Async'](params);
      
      // Parse the result
      return result;
    } catch (error) {
      logger.error('SOAP operation failed', { operation, error });
      throw error;
    }
  }
  
  /**
   * Add security headers based on config
   */
  private addSecurity(client: any) {
    const { security } = this.config;
    
    if (!security) return;
    
    if (security.type === 'wssecurity') {
      client.setSecurity(new (require('soap').WSSecurity)(
        security.username,
        security.password,
        { hasTimeStamp: security.hasTimeStamp }
      ));
    } else if (security.type === 'custom') {
      client.addSoapHeader(security.header);
    }
  }
}
