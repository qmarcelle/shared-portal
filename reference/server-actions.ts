// lib/actions/member/getProfile.ts
'use server'

import { MemberService } from '@/lib/domain/member/memberService';
import { ProfileData } from '@/lib/models/member/profile';
import { getCurrentUser } from '@/lib/utils/auth';
import { ApiResponse } from '@/lib/utils/apiResponse';
import { rateLimit } from '@/lib/utils/rateLimit';

/**
 * Server action to get the current user's profile
 */
export async function getProfile(): Promise<ApiResponse<ProfileData>> {
  try {
    // Get current authenticated user
    const user = await getCurrentUser();
    
    if (!user) {
      return ApiResponse.error('Authentication required', 401);
    }
    
    // Apply rate limiting
    const rateLimitResult = await rateLimit('getProfile', user.id);
    if (!rateLimitResult.success) {
      return ApiResponse.error('Too many requests', 429);
    }
    
    // Call domain service
    const result = await MemberService.getProfile(user.id);
    
    if (!result.success) {
      return ApiResponse.error(result.error?.message || 'Failed to get profile', 500);
    }
    
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error('An unexpected error occurred', 500);
  }
}

// lib/actions/member/updateProfile.ts
'use server'

import { MemberService } from '@/lib/domain/member/memberService';
import { ProfileData, ProfileUpdateSchema } from '@/lib/models/member/profile';
import { getCurrentUser } from '@/lib/utils/auth';
import { ApiResponse } from '@/lib/utils/apiResponse';
import { validateData } from '@/lib/utils/validation';
import { revalidatePath } from 'next/cache';

/**
 * Server action to update the current user's profile
 */
export async function updateProfile(
  formData: FormData | Record<string, unknown>
): Promise<ApiResponse<ProfileData>> {
  try {
    // Get current authenticated user
    const user = await getCurrentUser();
    
    if (!user) {
      return ApiResponse.error('Authentication required', 401);
    }
    
    // Convert FormData to plain object if needed
    const data = formData instanceof FormData
      ? Object.fromEntries(formData.entries())
      : formData;
    
    // Validate input data
    const validationResult = validateData(data, ProfileUpdateSchema);
    if (!validationResult.success) {
      return ApiResponse.error('Invalid data', 400, validationResult.errors);
    }
    
    // Call domain service
    const result = await MemberService.updateProfile(user.id, validationResult.data);
    
    if (!result.success) {
      return ApiResponse.error(result.error?.message || 'Failed to update profile', 500);
    }
    
    // Revalidate any paths that might show profile data
    revalidatePath('/dashboard');
    revalidatePath('/profile');
    
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error('An unexpected error occurred', 500);
  }
}
