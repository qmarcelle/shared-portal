import { ESResponseValidation } from '@/models/enterprise/esResponse';
import axios from 'axios';
import { logger } from '../logger';
import { getAuthToken } from './getToken';

const baseURL = process.env.ES_API_URL;
export const esApi = axios.create({
  baseURL: baseURL,
  proxy:
    process.env.NEXT_PUBLIC_PROXY?.toLocaleLowerCase() === 'false'
      ? false
      : undefined,
  headers: {
    'Content-type': 'application/json',
  },
});

esApi.interceptors.request?.use(
  async (config) => {
    try {
      logger.info(`ES API Request URL: ${baseURL}${config.url}`);
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
        logger.info(`API Bearer Token :: ${token}`);
      }
    } catch (error) {
      logger.error('GetAuthToken API - Failure', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

esApi.interceptors.response.use(
  (response) => {
    const esResponse = response.data as ESResponseValidation;
    if (
      !esResponse.details?.componentStatus ||
      esResponse.details?.componentStatus !== 'Success'
    ) {
      logger.error(`Error Response from ES: ${response.config.url}`);
      if (esResponse?.details?.innerDetails?.statusDetails) {
        const detailsLog = esResponse.details.innerDetails.statusDetails
          .map(
            (detail) =>
              `Component: ${detail.componentName}, Status: ${detail.componentStatus}, Message: ${detail.message}`,
          )
          .join(' | ');
        logger.info(`Status Details: ${detailsLog}`);
      }
      throw new Error(`ES Call has failures: ${esResponse.details?.message}`);
    }
    return response;
  },
  (error) => {
    logger.error('ES API Error', error);
    return Promise.reject(error);
  },
);
