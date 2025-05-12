'use server';

import { AxiosError } from 'axios';
import { LoginResponse } from '../models/api/login';
import { SelectMfaDeviceResponse } from '../models/api/select_mfa_device_response';
import { slideErrorCodes } from '../models/app/error_code_message_map';
import { SelectMFAStatus, SubmitMFAStatus } from '../models/status';

interface DXAuthToken {
  user: string;
  time: number;
}

type ActionResponse<T, D = unknown> = {
  status: T;
  data?: D;
  error?: {
    errorCode?: string;
    message?: string;
  };
};

// Mock API client - would be replaced with actual implementation
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

// Mock decryption function - would be replaced with actual implementation
const decrypt = (token: string): string => {
  // Remove the prefix we added during encryption
  if (token.startsWith('encrypted_')) {
    return token.substring(10);
  }
  throw new Error('Invalid token format');
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

type SelectMfaArgs = {
  deviceId: string;
  interactionId: string;
  interactionToken: string;
  userToken: string;
  policyId?: string;
  appId?: string;
};

type SubmitMfaOtpArgs = {
  otp: string;
  interactionId: string;
  interactionToken: string;
  userToken: string;
  policyId?: string;
  appId?: string;
};

export async function selectDevice(
  args: SelectMfaArgs,
): Promise<ActionResponse<SelectMFAStatus, SelectMfaDeviceResponse>> {
  let username: string | null = null;
  try {
    logger.info('Selected Mfa Device');
    args.policyId = process.env.ES_API_POLICY_ID;
    args.appId = process.env.ES_API_APP_ID;
    username = verifyUserId(args.userToken);
    
    const resp = await esApi.post<{ data: SelectMfaDeviceResponse }>(
      '/mfAuthentication/loginAuthentication/selectDevice',
      args,
    );
    
    logger.info('Select Device API - Success', resp, username);
    return {
      status: SelectMFAStatus.OK,
      data: resp.data?.data,
    };
  } catch (err) {
    logger.error('Select Device API - Failure', err, username);
    if (err instanceof AxiosError) {
      return {
        status: SelectMFAStatus.ERROR,
        error: {
          errorCode: err.response?.data?.data?.errorCode,
        },
      };
    } else {
      throw new Error('An error occurred');
    }
  }
}

export async function submitMfaOtp(
  params: SubmitMfaOtpArgs,
): Promise<ActionResponse<SubmitMFAStatus, LoginResponse>> {
  let authUser: string | null = null;
  let username: string | null = null;
  try {
    let status: SubmitMFAStatus = SubmitMFAStatus.OTP_OK;
    params.policyId = process.env.ES_API_POLICY_ID;
    params.appId = process.env.ES_API_APP_ID;
    username = verifyUserId(params.userToken);
    
    const resp = await esApi.post<{ data: LoginResponse }>(
      '/mfAuthentication/loginAuthentication/provideOtp',
      params,
    );
    
    logger.info('Submit MFA OTP API - Success', resp, username);
    
    if (!username) {
      throw new Error('Failed to verify username');
    }
    
    if (resp.data.data?.flowStatus == 'PASSWORD_RESET_REQUIRED') {
      status = SubmitMFAStatus.PASSWORD_RESET_REQUIRED;
    } else if (resp.data.data?.flowStatus == 'NEW_EMAIL_REQUIRED') {
      status = SubmitMFAStatus.EMAIL_UNIQUENESS;
    } else if (resp.data.data?.message == 'Duplicate_Account') {
      status = SubmitMFAStatus.DUPLICATE_ACCOUNT;
    } else {
      authUser = username;
      await setWebsphereRedirectCookie({
        ...resp.data.data,
      });
    }
    
    return {
      status: status,
      data: resp.data.data,
    };
  } catch (err) {
    logger.error('Submit MFA OTP API - Failure', err, username);
    if (err instanceof AxiosError) {
      if (slideErrorCodes.includes(err.response?.data.data.errorCode)) {
        if (err.response?.data.data.errorCode == 'MF-405') {
          return {
            status: SubmitMFAStatus.OTP_INVALID_LIMIT_REACHED,
            error: {
              errorCode: err.response?.data.data.errorCode,
            },
          };
        } else {
          return {
            status: SubmitMFAStatus.GENERIC_OR_INLINE_ERROR,
            error: {
              errorCode: err.response?.data.data.errorCode,
            },
          };
        }
      } else {
        return {
          status: SubmitMFAStatus.GENERIC_OR_INLINE_ERROR,
          error: {
            errorCode: err.response?.data.data.errorCode,
          },
        };
      }
    } else {
      throw new Error('An error occurred');
    }
  } finally {
    if (authUser) {
      await signIn('credentials', {
        userId: authUser,
        redirect: false,
      });
    }
  }
}

function verifyUserId(token: string): string | null {
  try {
    const json = decrypt(token);
    const userData: DXAuthToken = JSON.parse(json);
    logger.info(`Verified MFA user token: ${userData.user}`);
    return userData.user;
  } catch (err) {
    logger.error('Failed to verify username in MFA flow!', err);
    return null;
  }
}