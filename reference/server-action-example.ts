// app/actions/member/getProfile.ts
'use server'

import { ProfileService } from '@/lib/api/member/profileService';
import { getTenant } from '@/lib/utils/tenant';
import { currentUser } from '@/lib/auth';
import { cache } from 'react';

// Use React cache for server components to deduplicate requests
export const getProfile = cache(async () => {
  // Get the current authenticated user
  const user = await currentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  // Get the current tenant
  const tenant = getTenant();
  
  // Use domain service to fetch profile
  try {
    const result = await ProfileService.getProfile(user.id, { tenant });
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to fetch profile');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Could not retrieve profile information');
  }
});
