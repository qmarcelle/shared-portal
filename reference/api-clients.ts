// lib/clients/http/httpClient.ts
import { ApiError } from './apiError';
import { getSession } from '@/lib/auth/session';
import { getServiceUrl } from '@/lib/config/endpoints';

export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  tenant?: string;
  timeout?: number;
  retry?: number;
}

/**
 * Enhanced fetch wrapper with auth, error handling, and tenant support
 */
export async function fetchWithAuth(
  serviceName: string,
  path: string,
  options: RequestOptions = {}
): Promise<any> {
  // Get authentication token from session
  const session = await getSession();
  const authToken = session?.user?.token;
  
  // Get service URL from configuration
  const baseUrl = getServiceUrl(serviceName, options.tenant);
  const url = `${baseUrl}${path}`;
  
  // Set default options
  const defaultOptions: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers
    }
  };
  
  // Add body for non-GET requests
  if (options.body && (defaultOptions.method !== 'GET' && defaultOptions.method !== 'HEAD')) {
    defaultOptions.body = JSON.stringify(options.body);
  }
  
  // Request with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000);
  
  try {
    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || response.statusText,
        response.status,
        errorData
      );
    }
    
    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    
    // For other errors, wrap in ApiError
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}

// lib/clients/http/apiError.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// lib/clients/member/memberClient.ts
import { fetchWithAuth } from '@/lib/clients/http/httpClient';
import { MemberProfile, UpdateProfileInput } from '@/lib/types/member';

interface ClientOptions {
  tenant?: string;
}

/**
 * Client for member-related API calls
 */
export const memberClient = {
  /**
   * Authenticate user
   */
  async authenticate(credentials: { username: string; password: string }): Promise<any> {
    return fetchWithAuth('auth', '/login', {
      method: 'POST',
      body: credentials
    });
  },
  
  /**
   * Get member profile
   */
  async getProfile(memberId: string, options: ClientOptions = {}): Promise<MemberProfile> {
    return fetchWithAuth('member', `/profile/${memberId}`, {
      tenant: options.tenant
    });
  },
  
  /**
   * Update member profile
   */
  async updateProfile(
    memberId: string, 
    data: UpdateProfileInput,
    options: ClientOptions = {}
  ): Promise<MemberProfile> {
    return fetchWithAuth('member', `/profile/${memberId}`, {
      method: 'PUT',
      body: data,
      tenant: options.tenant
    });
  }
};

// lib/clients/benefits/benefitsClient.ts
import { fetchWithAuth } from '@/lib/clients/http/httpClient';
import { Plan } from '@/lib/types/benefits';

interface GetPlansOptions {
  memberId: string;
  year?: number;
  status?: string;
  tenant?: string;
}

/**
 * Client for benefits-related API calls
 */
export const benefitsClient = {
  /**
   * Get available plans
   */
  async getPlans(options: GetPlansOptions): Promise<Plan[]> {
    const queryParams = new URLSearchParams();
    
    if (options.year) {
      queryParams.append('year', options.year.toString());
    }
    
    if (options.status) {
      queryParams.append('status', options.status);
    }
    
    const queryString = queryParams.toString();
    const path = `/members/${options.memberId}/plans${queryString ? `?${queryString}` : ''}`;
    
    return fetchWithAuth('benefits', path, {
      tenant: options.tenant
    });
  },
  
  /**
   * Enroll in a plan
   */
  async enrollInPlan(
    memberId: string, 
    planId: string,
    options: { effectiveDate: string; tenant?: string }
  ): Promise<any> {
    return fetchWithAuth('benefits', `/members/${memberId}/enrollment`, {
      method: 'POST',
      body: {
        planId,
        effectiveDate: options.effectiveDate
      },
      tenant: options.tenant
    });
  }
};
