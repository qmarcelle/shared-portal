import axios from 'axios';
import { logger } from '../logger';
import { getAuthToken } from './getToken';

const memberLimitSvcURL = `${process.env.PORTAL_SERVICES_URL}${process.env.MEMBERLIMITSERVICE_CONTEXT_ROOT}`;

export const memberLimitService = axios.create({
  baseURL: memberLimitSvcURL,
  proxy:
    process.env.NEXT_PUBLIC_PROXY?.toLocaleLowerCase() === 'false'
      ? false
      : undefined,
  headers: {
    'Content-type': 'application/json',
  },
});

memberLimitService.interceptors.request?.use(
  async (config) => {
    try {
      logger.info(`Request URL: ${memberLimitSvcURL}${config.url}`);
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
