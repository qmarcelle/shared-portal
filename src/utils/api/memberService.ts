import axios from 'axios';
import { serverConfig } from '../env-config';
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
  // Extended fields for Genesys Cloud Chat
  member_ck: number; // MEMBER_ID
  first_name: string;
  last_name: string;
  lob_group: string; // LOB grouping
  RoutingChatbotInteractionId: string; // RoutingChatbotInteractionId
  IDCardBotName: string; // IDCardBotName
  MEMBER_DOB: string; // MEMBER_DOB
  INQ_TYPE: string; // INQ_TYPE
  SERV_Type: string; // SERV_Type
  PLAN_ID: string; // PLAN_ID
  GROUP_ID: string; // GROUP_ID
  coverage_eligibility: string; // coverage_eligibility
  Origin: string; // Origin
  Source: string; // Source
  // Add any other fields as needed
}

// Log environment variables to help with debugging
logger.info('Member Service Environment Variables:', {
  PORTAL_SERVICES_URL: serverConfig.PORTAL_SERVICES_URL || 'undefined',
  MEMBERSERVICE_CONTEXT_ROOT:
    serverConfig.MEMBERSERVICE_CONTEXT_ROOT || 'undefined',
  NODE_ENV: serverConfig.NODE_ENV || 'undefined',
});

// Create URL with fallbacks to prevent "undefinedundefined" strings
const portalServicesUrl = serverConfig.PORTAL_SERVICES_URL || '';
const memberServiceContext = serverConfig.MEMBERSERVICE_CONTEXT_ROOT || '';
const memSvcURL = `${portalServicesUrl}${memberServiceContext}`;

// Log the constructed URL
logger.info(`Member Service URL: ${memSvcURL || '(empty)'}`);

export const memberService = axios.create({
  baseURL: memSvcURL || undefined, // Use undefined instead of empty string for better axios handling
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
      // Log the full request URL to help with debugging
      const requestUrl = config.baseURL
        ? `${config.baseURL}${config.url}`
        : config.url;
      logger.info(`Request URL: ${requestUrl}`);

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

export const getChatInfo = (memberType: string, memberId: string) =>
  memberService.get(`/members/${memberType}/${memberId}/chat/getChatInfo`);

export const isCloudChatEligible = (memberType: string, memberId: string) =>
  memberService.get(
    `/members/${memberType}/${memberId}/chat/isCloudChatEligible`,
  );

export const isChatAvailable = (memberType: string, memberId: string) =>
  memberService.get(`/members/${memberType}/${memberId}/chat/isChatAvailable`);

export const getCloudChatGroups = () =>
  memberService.get(`/members/chat/cloudChatGroups`);
