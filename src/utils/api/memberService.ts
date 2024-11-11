import axios from 'axios';
import { logger } from '../logger';
import { getAuthToken } from './getToken';

export const memberService = axios.create({
  baseURL: `${process.env.PORTAL_SERVICES_URL}/${process.env.MEMBERSERVICE_CONTEXT_ROOT}`,
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
      //Client ID & Client Secret are encrypted and added as credentials to request body
      if (config.data) {
        config.data.credentials = process.env.ES_API_PING_CREDENTIALS
          ? btoa(process.env.ES_API_PING_CREDENTIALS)
          : undefined;
      }
      //Get Bearer Token from PING and add it in headers for ES service request.
      const token = await getAuthToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      logger.error(`GetAuthToken ${error}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
