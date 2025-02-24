'use server';

import { logger } from '@/utils/logger';
import axios, { AxiosResponse } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SDKResponse } from '../models/api/sdk_response';

export async function getSDKToken(): Promise<string> {
  try {
    const request = {
      policyId: process.env.DROP_OFF_POLICY_ID,
    };
    const sdkEndpoint = `${process.env.DAVINCI_API_URL}/company/${process.env.NEXT_PUBLIC_ENV_ID}/sdktoken`;
    const headers = {
      'X-SK-API-Key': process.env.ES_API_APP_ID,
      'Content-Type': 'application/json',
    };
    const proxyUrl = 'http://webgateway.bcbst.com:80/';
    const agent = new HttpsProxyAgent(proxyUrl);

    const response: AxiosResponse<SDKResponse> = await axios.post(
      sdkEndpoint,
      request,
      {
        proxy:
          process.env.NEXT_PUBLIC_PROXY?.toLocaleLowerCase() === 'false'
            ? false
            : undefined,
        headers,
        httpsAgent: agent,
      },
    );
    return response.data.access_token;
  } catch (error) {
    logger.error('Error Response from get SDK Token API', error);
    throw error;
  }
}
