import axios from 'axios';
import { serverConfig } from '../env-config';
import { logger } from '../logger';
import { getServerSideUserId } from '../server_session';
import { getAuthToken } from './getToken';

export const ES_TRANSACTION_ID = 'ES-transactionId';

// Use the baseURL from serverConfig to ensure it's properly loaded
const baseURL = serverConfig.ES_PORTAL_SVCS_API_URL;

// Log the URL to help with debugging
logger.info(`Portal Service API URL: ${baseURL || '(empty)'}`);

export const portalSvcsApi = axios.create({
  baseURL: baseURL,
  proxy:
    process.env.NEXT_PUBLIC_PROXY?.toLocaleLowerCase() === 'false'
      ? false
      : undefined,
  headers: {
    'Content-type': 'application/json',
  },
});

portalSvcsApi.interceptors.request?.use(
  async (config) => {
    try {
      logger.info(`Request URL: ${baseURL}${config.url}`);
      //Get Bearer Token from PING and add it in headers for ES service request.
      logger.info(
        `Portal Service API Endpoint: ${serverConfig.ES_PORTAL_SVCS_API_URL}`,
      );
      const token = await getAuthToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      logger.info('token' + token);
      config.headers['consumer'] = 'member';
      config.headers['portaluser'] = await getServerSideUserId();
    } catch (error) {
      logger.error(`GetAuthToken ${error}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
