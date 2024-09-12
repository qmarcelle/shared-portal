import axios, { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import { logger } from '../logger';
import { getAuthToken } from './getToken';

export const ES_TRANSACTION_ID = 'ES-transactionId';

export const esApi = axios.create({
  baseURL: process.env.ES_API_URL,
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

export const logESTransactionId = (resp: AxiosResponse | AxiosError) => {
  if ((resp as AxiosResponse).headers instanceof AxiosHeaders) {
    const esTransactionId = ((resp as AxiosResponse).headers as AxiosHeaders)
      .get(ES_TRANSACTION_ID)
      ?.toString();
    logger.info(`ES TRANSACTION ID: ${esTransactionId}`);
  } else if ((resp as AxiosError).response?.headers instanceof AxiosHeaders) {
    const esTransactionId = (
      (resp as AxiosError).response?.headers as AxiosHeaders
    )
      .get(ES_TRANSACTION_ID)
      ?.toString();
    logger.error(`ES TRANSACTION ID: ${esTransactionId}`);
  }
};
