'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { SSOService } from '../services/SSOService';

/**
 * Server action to perform drop-off SSO to Ping
 */
export async function performDropOffSSO(providerId: string): Promise<string> {
  return await SSOService.performDropOffSSO(providerId);
}

/**
 * Server action to generate SSO parameters
 */
export async function generateSSOParameters(
  providerId: string,
  member: LoggedInMember,
  searchParams?: Record<string, string>,
): Promise<Map<string, string>> {
  return await SSOService.generateParameters(providerId, member, searchParams);
}

/**
 * Server action to check if a provider supports drop-off SSO
 */
export function checkSSODropOffSupport(providerId: string): boolean {
  return SSOService.supportsDropOff(providerId);
}

/**
 * Server action to get provider display name
 */
export function getProviderDisplayName(providerId: string): string {
  return SSOService.getProviderName(providerId);
}
