// lib/api/member/profileService.ts
import { getServiceAdapter } from '@/lib/api/adapters/serviceRegistry';
import { ServiceResult } from '@/lib/api/utils/serviceResult';
import { ProfileData } from '@/lib/models/member';

type ServiceOptions = {
  tenant?: string;
};

/**
 * Service for member profile operations
 */
export class ProfileService {
  /**
   * Get member profile
   */
  static async getProfile(
    memberId: string, 
    options: ServiceOptions = {}
  ): Promise<ServiceResult<ProfileData>> {
    try {
      // Get the appropriate adapter based on tenant and service configuration
      const adapter = getServiceAdapter('member', 'profile', options.tenant);
      
      // Execute the operation through the adapter
      return await adapter.execute('getProfile', { memberId });
    } catch (error) {
      return ServiceResult.failure('Failed to get member profile', error);
    }
  }
  
  /**
   * Update member profile
   */
  static async updateProfile(
    memberId: string, 
    profileData: Partial<ProfileData>,
    options: ServiceOptions = {}
  ): Promise<ServiceResult<ProfileData>> {
    try {
      const adapter = getServiceAdapter('member', 'profile', options.tenant);
      
      return await adapter.execute('updateProfile', { 
        memberId,
        profile: profileData
      });
    } catch (error) {
      return ServiceResult.failure('Failed to update member profile', error);
    }
  }
}
