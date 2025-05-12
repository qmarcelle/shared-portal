// app/actions/member/getProfile.ts
'use server'

import { getCurrentUser } from '@/lib/auth/session';
import { memberClient } from '@/lib/clients/member/memberClient';
import { ApiResponse } from '@/lib/types/api';
import { MemberProfile } from '@/lib/types/member';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';

/**
 * Get the current user's profile
 * This is cached for server components
 */
export const getProfile = cache(async (): Promise<ApiResponse<MemberProfile>> => {
  try {
    // Get authenticated user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
        status: 401
      };
    }
    
    // Call the client to fetch profile
    const profile = await memberClient.getProfile(user.id, {
      tenant: user.tenant
    });
    
    return {
      success: true,
      data: profile
    };
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to fetch profile',
      status: error.status || 500
    };
  }
});

// app/actions/member/updateProfile.ts
'use server'

import { getCurrentUser } from '@/lib/auth/session';
import { memberClient } from '@/lib/clients/member/memberClient';
import { ApiResponse } from '@/lib/types/api';
import { MemberProfile, UpdateProfileInput } from '@/lib/types/member';
import { validateProfileUpdate } from '@/lib/utils/validation';
import { revalidatePath } from 'next/cache';

/**
 * Update the current user's profile
 */
export async function updateProfile(
  formData: FormData | UpdateProfileInput
): Promise<ApiResponse<MemberProfile>> {
  try {
    // Get authenticated user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
        status: 401
      };
    }
    
    // Convert FormData to object if needed
    const data = formData instanceof FormData 
      ? Object.fromEntries(formData.entries()) as UpdateProfileInput 
      : formData;
    
    // Validate data
    const validationResult = validateProfileUpdate(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        status: 400,
        validationErrors: validationResult.errors
      };
    }
    
    // Call client to update profile
    const updatedProfile = await memberClient.updateProfile(
      user.id, 
      validationResult.data,
      { tenant: user.tenant }
    );
    
    // Revalidate relevant paths
    revalidatePath('/member/dashboard');
    revalidatePath('/member/profile');
    
    return {
      success: true,
      data: updatedProfile
    };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to update profile',
      status: error.status || 500
    };
  }
}

// app/actions/benefits/getPlans.ts
'use server'

import { getCurrentUser } from '@/lib/auth/session';
import { benefitsClient } from '@/lib/clients/benefits/benefitsClient';
import { ApiResponse } from '@/lib/types/api';
import { Plan } from '@/lib/types/benefits';
import { cache } from 'react';

interface PlanQueryOptions {
  year?: number;
  status?: string;
}

/**
 * Get available plans for the member
 */
export const getPlans = cache(async (
  options: PlanQueryOptions = {}
): Promise<ApiResponse<Plan[]>> => {
  try {
    // Get authenticated user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
        status: 401
      };
    }
    
    // Use current year if not specified
    const year = options.year || new Date().getFullYear();
    
    // Call client to get plans
    const plans = await benefitsClient.getPlans({
      memberId: user.id,
      year, 
      status: options.status,
      tenant: user.tenant
    });
    
    return {
      success: true,
      data: plans
    };
  } catch (error: any) {
    console.error('Error fetching plans:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to fetch plans',
      status: error.status || 500
    };
  }
});
