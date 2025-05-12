'use server';

import { headers } from 'next/headers';
import { userAgent } from 'next/server';
import { LoginRequest, LoginResponse, PortalLoginResponse } from '../models/api/login';
import { LoginStatus } from '../models/status';
import { AxiosError } from 'axios';

type ActionResponse<T, D = unknown> = {
  status: T;
  data?: D;
  error?: {
    errorCode?: string;
    message?: string;
  };
};

// This would be imported from a shared API client in a real implementation
const esApi = {
  post: async <T>(url: string, data: any): Promise<{ data: T }> => {
    // Mock implementation - would be replaced with actual API call
    console.log(`Mock API call to ${url} with data`, data);
    throw new Error('API not implemented');
  }
};

// Mock logging function - would be replaced with actual logger
const logger = {
  info: (message: string, ...args: any[]) => console.info(message, ...args),
  error: (message: string, ...args: any[]) => console.error(message, ...args)
};

// Mock encryption function - would be replaced with actual implementation
const encrypt = (data: string): string => {
  return `encrypted_${data}`;
};

// Mock date formatter - would be replaced with actual implementation
const UNIXTimeSeconds = (): number => {
  return Math.floor(Date.now() / 1000);
};

// Mock function for setting websphere redirect cookie
const setWebsphereRedirectCookie = async (data: LoginResponse) => {
  // Implementation would set appropriate cookies
  console.log('Setting websphere redirect cookie with data', data);
};

// Mock function for signing in
const signIn = async (provider: string, options: { userId: string; redirect: boolean }) => {
  // Implementation would handle authentication
  console.log(`Signing in with ${provider}`, options);
};

const INVALID_CREDENTIALS_ES_ERROR_CODE = 'UI-401';

export async function login(request: LoginRequest): Promise<ActionResponse<LoginStatus, PortalLoginResponse>> {
  let authUser: string | null = null;
  const headersInfo = headers();
  const ipAddress = headersInfo.get('x-forwarded-for');
  const userAgentStructure = {
    headers: headersInfo,
  };
  const uAgent = userAgent(userAgentStructure);
  let status: LoginStatus;
  
  try {
    if (!request.username || !request.password) {
      return {
        status: LoginStatus.VALIDATION_FAILURE,
      };
    }
    
    // Prepare the request with additional data
    request.policyId = process.env.ES_API_POLICY_ID;
    request.appId = process.env.ES_API_APP_ID;
    request.ipAddress = ipAddress;
    request.userAgent = uAgent.ua;
    
    // Call the authentication API
    const resp = await esApi.post<{ data: LoginResponse }>(
      '/mfAuthentication/loginAuthentication',
      request,
    );

    logger.info('Login API - Success', resp, request.username);
    status = LoginStatus.ERROR;

    // Handle different authentication responses
    switch (resp.data.data?.message) {
      case 'MFA_Disabled':
      case 'COMPLETED':
        authUser = request.username;
        await setWebsphereRedirectCookie({
          ...resp.data.data,
        });
        status = LoginStatus.LOGIN_OK;
        break;
      case 'EMAIL_VERIFICATION_REQUIRED':
      case 'NO_DEVICES_EMAIL_VERIFICATION_REQUIRED':
        status = LoginStatus.VERIFY_EMAIL;
        break;
      case 'OTP_REQUIRED':
        status = LoginStatus.MFA_REQUIRED_ONE_DEVICE;
        break;
      case 'DEVICE_SELECTION_REQUIRED':
        status = LoginStatus.MFA_REQUIRED_MULTIPLE_DEVICES;
        break;
      case 'PASSWORD_RESET_REQUIRED':
        status = LoginStatus.PASSWORD_RESET_REQUIRED;
        break;
      case 'NEW_EMAIL_REQUIRED':
        status = LoginStatus.EMAIL_UNIQUENESS;
        break;
      case 'DEACTIVATED_DUE_TO_INACTIVITY':
        status = LoginStatus.REACTIVATION_REQUIRED;
        break;
      case 'Duplicate_Account':
        status = LoginStatus.DUPLICATE_ACCOUNT;
        break;
    }
    
    if (!resp.data.data) throw 'Invalid API response';
    
    return {
      status,
      data: {
        ...resp.data.data,
        userToken: encrypt(
          JSON.stringify({
            user: request.username,
            time: UNIXTimeSeconds(),
          }),
        ),
      },
    };
  } catch (error) {
    logger.error('Login API - Failure', error, request.username);
    if (error instanceof AxiosError) {
      return {
        status:
          error.response?.data.data.errorCode == INVALID_CREDENTIALS_ES_ERROR_CODE
            ? LoginStatus.INVALID_CREDENTIALS
            : LoginStatus.ERROR,
        data: error.response?.data.data,
        error: {
          errorCode: error.response?.data.data.errorCode,
          message: error.response?.data,
        },
      };
    } else {
      throw error;
    }
  } finally {
    if (authUser) {
      // Sign in the user if authentication was successful
      await signIn('credentials', {
        userId: authUser,
        redirect: false,
      });
    }
  }
}