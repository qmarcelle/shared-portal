import { PBEData } from '@/models/member/api/pbeData';
import { getPersonBusinessEntity } from './api/client/get_pbe';
import { logger } from './logger';

// Simple in-memory cache for PBE data
const pbeCache: Record<string, { data: PBEData; timestamp: number }> = {};

// Cache expiry time (5 minutes)
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

// Track ongoing requests to prevent duplicate calls
const pendingRequests: Record<string, Promise<PBEData>> = {};

/**
 * Get PBE data with caching to avoid redundant API calls
 * @param userId User ID to fetch PBE data for
 * @param forceRefresh Whether to force a refresh of cached data
 * @returns PBE data for the user
 */
export async function getCachedPersonBusinessEntity(
  userId: string,
  forceRefresh = false
): Promise<PBEData> {
  // Return from cache if valid and not forcing refresh
  const cachedEntry = pbeCache[userId];
  const now = Date.now();
  
  if (
    !forceRefresh &&
    cachedEntry &&
    now - cachedEntry.timestamp < CACHE_EXPIRY_MS
  ) {
    return cachedEntry.data;
  }
  
  // If there's already a request in progress for this user, wait for it
  if (userId in pendingRequests) {
    try {
      return await pendingRequests[userId];
    } catch (error) {
      // If the pending request fails, we'll try again below
      logger.error('Pending request for PBE data failed:', error);
    }
  }
  
  // Start a new request
  try {
    // Create a promise for this request and store it
    pendingRequests[userId] = getPersonBusinessEntity(userId);
    
    // Wait for the data
    const data = await pendingRequests[userId];
    
    // Update cache with fresh data
    pbeCache[userId] = {
      data,
      timestamp: now,
    };
    
    return data;
  } catch (error) {
    logger.error('Error fetching PBE data:', error);
    
    // If we have cached data, return it even if expired as fallback
    if (cachedEntry) {
      logger.warn('Using expired cached PBE data as fallback');
      return cachedEntry.data;
    }
    
    throw error;
  } finally {
    // Clean up the pending request entry
    delete pendingRequests[userId];
  }
}

/**
 * A lightweight check if the user has multiple plans
 * @param userId User ID to check
 * @returns Promise resolving to boolean
 */
export async function hasMultiplePlansForUser(
  userId: string
): Promise<boolean> {
  try {
    const pbeData = await getCachedPersonBusinessEntity(userId);
    
    // Use a more efficient approach with a fixed date object
    const now = new Date();
    let planCount = 0;
    const seenPlans = new Set<string>();
    
    // Early return optimization
    for (const detail of pbeData.getPBEDetails || []) {
      for (const info of detail.relationshipInfo || []) {
        // Skip if we've already seen this plan
        if (seenPlans.has(info.memeCk)) continue;
        
        try {
          // Check if the plan is active
          const termDate = new Date(info.roleTermDate);
          if (termDate > now && info.memeCk) {
            seenPlans.add(info.memeCk);
            planCount++;
            
            // Early return if we've found more than one plan
            if (planCount > 1) {
              return true;
            }
          }
        } catch (err) {
          // Skip invalid dates
          logger.warn('Invalid date in plan data:', info.roleTermDate);
        }
      }
    }
    
    return false; // Only one or zero plans found
  } catch (error) {
    logger.error('Error determining if user has multiple plans:', error);
    return false; // Default to false on error
  }
}