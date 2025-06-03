import { LoggedInMember } from '@/models/app/loggedin_member';
import { logger } from '@/utils/logger';
import { BaseSSOParameters, SSOProvider } from '../models/types';

/**
 * Base implementation for SSO providers
 */
export abstract class BaseProvider implements SSOProvider {
  protected providerId: string;
  protected displayName: string;

  constructor(providerId: string, displayName: string) {
    this.providerId = providerId;
    this.displayName = displayName;
  }

  /**
   * Convert provider-specific parameters to a Map<string, string> for backward compatibility
   */
  protected parametersToMap(params: BaseSSOParameters): Map<string, string> {
    const map = new Map<string, string>();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        map.set(key, value.toString());
      }
    });

    return map;
  }

  /**
   * Utility function for error handling
   */
  protected async withErrorHandling<T>(
    operation: () => Promise<T>,
    errorContext: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      logger.error(`SSO Error (${this.displayName}): ${errorContext}`, error);
      throw error;
    }
  }

  /**
   * Default implementation of generateParameters - should be overridden by subclasses
   */
  abstract generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<BaseSSOParameters>;

  /**
   * Get the display name of this provider
   */
  getName(): string {
    return this.displayName;
  }

  /**
   * Whether this provider supports drop-off SSO
   * Defaults to false, override in subclasses if needed
   */
  supportsDropOff(): boolean {
    return false;
  }

  /**
   * Get the provider ID
   */
  getProviderId(): string {
    return this.providerId;
  }

  /**
   * Generate a Map<string, string> of parameters for backward compatibility
   */
  async generateParametersMap(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<Map<string, string>> {
    const params = await this.generateParameters(member, searchParams);
    return this.parametersToMap(params);
  }
}
