import axios from 'axios';
import { logger } from '../logger';
import { getServerSideUserId } from '../server_session';
import { getAuthToken } from './getToken';
export const ES_TRANSACTION_ID = 'ES-transactionId';

export const portalSvcsApi = axios.create({
  baseURL: process.env.ES_PORTAL_SVCS_API_URL,
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
      //Get Bearer Token from PING and add it in headers for ES service request.
      logger.info(
        `Portal Service API Endpoint:
        ${process.env.ES_PORTAL_SVCS_API_URL}`,
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
