import axios from 'axios';
import { logger } from '../logger';
import { getAuthToken } from './getToken';

export interface ChatInfoResponse {
  isEligible: boolean;
  cloudChatEligible: boolean;
  chatGroup?: string;
  businessHours?: {
    text: string;
    isOpen: boolean;
  };
  workingHours?: string;
}

const memSvcURL = `${process.env.PORTAL_SERVICES_URL}${process.env.MEMBERSERVICE_CONTEXT_ROOT}`;

export const memberService = axios.create({
  baseURL: memSvcURL,
  proxy:
    process.env.NEXT_PUBLIC_PROXY?.toLocaleLowerCase() === 'false'
      ? false
      : undefined,
  headers: {
    'Content-type': 'application/json',
  },
});

memberService.interceptors.request?.use(
  async (config) => {
    try {
      logger.info(`Request URL: ${memSvcURL}${config.url}`);

      //Get Bearer Token from PING and add it in headers for ES service request.
      const token = await getAuthToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      logger.error(`GetAuthToken ${error}`);
      // If token fetch fails, reject the request
      return Promise.reject(new Error('Failed to get authentication token'));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for token expiration
memberService.interceptors.response?.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      logger.error('Token expired or invalid');
      // Trigger token refresh or logout flow
      window.location.href = '/login';
      return Promise.reject(new Error('Authentication expired'));
    }
    return Promise.reject(error);
  },
);
