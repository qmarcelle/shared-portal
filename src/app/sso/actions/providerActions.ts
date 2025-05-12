'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { BaseSSOParameters } from '../models/types';
import { ProviderFactory } from '../providers/ProviderFactory';

/**
 * Server action to get provider implementation and generate parameters
 */
export async function generateProviderParameters(
  providerId: string,
  member: LoggedInMember,
  searchParams?: Record<string, string>,
): Promise<BaseSSOParameters> {
  const provider = ProviderFactory.getProvider(providerId);
  return await provider.generateParameters(member, searchParams);
}

/**
 * Server action to check if a provider supports drop-off SSO
 * via the Provider Factory
 */
export async function checkProviderDropOffSupport(
  providerId: string,
): Promise<boolean> {
  return ProviderFactory.supportsDropOff(providerId);
}

/**
 * Server action to get provider name from ID
 */
export async function getProviderNameById(providerId: string): Promise<string> {
  return ProviderFactory.getProviderName(providerId);
}
