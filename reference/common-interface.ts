// lib/domain/member/memberService.ts
import { ProfileData } from '@/lib/models/member/profile';
import { ServiceResult } from '@/lib/utils/serviceResult';
import { getServiceAdapter } from '@/lib/adapters/serviceRegistry';
import { logger } from '@/lib/utils/logging';
import { cache } from '@/lib/utils/caching';

export class MemberService {
  /**
   * Gets member profile by member ID
   */
  static async getProfile(memberId: string): Promise<ServiceResult<ProfileData>> {
    try {
      // Get appropriate adapter based on service configuration
      const adapter = getServiceAdapter('member', 'profile');
      
      // Use caching for performance if appropriate
      const cacheKey = `member:profile:${memberId}`;
      const cachedResult = await cache.get(cacheKey);
      
      if (cachedResult) {
        logger.debug('Profile fetched from cache', { memberId });
        return ServiceResult.success(cachedResult);
      }
      
      // Call the adapter to abstract the underlying service details
      const result = await adapter.execute('getProfile', { memberId });
      
      // Cache successful results
      if (result.success) {
        await cache.set(cacheKey, result.data, 300); // 5 minute cache
      }
      
      return result;
    } catch (error) {
      logger.error('Failed to get member profile', { memberId, error });
      return ServiceResult.failure('Failed to get member profile', error);
    }
  }

  /**
   * Updates member profile
   */
  static async updateProfile(memberId: string, profile: Partial<ProfileData>): Promise<ServiceResult<ProfileData>> {
    try {
      const adapter = getServiceAdapter('member', 'profile');
      
      // Execute the update operation
      const result = await adapter.execute('updateProfile', { memberId, profile });
      
      // Invalidate cache on successful updates
      if (result.success) {
        await cache.delete(`member:profile:${memberId}`);
      }
      
      return result;
    } catch (error) {
      logger.error('Failed to update member profile', { memberId, error });
      return ServiceResult.failure('Failed to update member profile', error);
    }
  }
}
