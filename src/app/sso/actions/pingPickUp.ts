'use server';

import { logger } from '@/utils/logger';
import axios, { AxiosResponse } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { PingPickUpResponse } from '../models/api/pickup_response';

export async function submitInboundSSOChallenge(
  refId: string,
): Promise<PingPickUpResponse> {
  try {
    const request = {
      challenge: refId,
    };
    const davinciEndpoint = `${process.env.DAVINCI_API_URL}/company/${process.env.NEXT_PUBLIC_ENV_ID}/policy/${process.env.PICK_UP_POLICY_ID}/start`;
    const headers = {
      'X-SK-API-Key': process.env.ES_API_APP_ID,
      'Content-Type': 'application/json',
    };
    const proxyUrl = 'http://webgateway.bcbst.com:80/';
    const agent = new HttpsProxyAgent(proxyUrl);

    const response: AxiosResponse<PingPickUpResponse> = await axios.post(
      davinciEndpoint,
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
    return response.data;
  } catch (error) {
    logger.error('Error Response from Inbound Pickup API', error);
    throw error;
  }
}
