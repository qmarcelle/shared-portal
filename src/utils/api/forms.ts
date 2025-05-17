import axios from 'axios';
import { logger } from '../logger';
import { getAuthToken } from './getToken';

const formsServiceURL = `${process.env.PORTAL_SERVICES_URL}${process.env.FORMS_SERVICE_URL}`;

export const formsService = axios.create({
  baseURL: formsServiceURL,
  proxy:
    process.env.NEXT_PUBLIC_PROXY?.toLocaleLowerCase() === 'false'
      ? false
      : undefined,
  headers: {
    'Content-type': 'application/json',
  },
});

formsService.interceptors.request?.use(
  async (config) => {
    try {
      logger.info(`Request URL: ${formsServiceURL}${config.url}`);

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
