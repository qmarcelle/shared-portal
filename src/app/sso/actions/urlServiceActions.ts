'use server';

import { URLService } from '../services/URLService';

/**
 * Server action to generate a complete drop-off SSO URL
 */
export async function generateDropOffSSOUrl(
  providerId: string,
  searchParams?: Record<string, string>,
): Promise<string> {
  return await URLService.generateDropOffSSOUrl(providerId, searchParams);
}

/**
 * Server action to build a direct SSO URL
 */
export async function buildDirectSSOUrl(searchParams: string): Promise<string> {
  return URLService.buildDirectSSOUrl(searchParams);
}

/**
 * Server action to generate the appropriate SSO URL based on provider type
 */
export async function generateSSOUrl(
  providerId: string,
  searchParamsString: string,
  searchParams?: Record<string, string>,
): Promise<string> {
  return await URLService.generateSSOUrl(
    providerId,
    searchParamsString,
    searchParams,
  );
}
