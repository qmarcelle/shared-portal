'use server';

import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { getSDKToken } from './getSDKToken';

interface DropOffResp {
  REF: string;
}

interface ChallengeDropOffResp {
  additionalProperties: {
    challenge: string;
  };
}

export default async function dropOffToPing(myDataMap: Map<string, string>) {
  try {
    const baseURL = process.env.NEXT_PUBLIC_PING_REST_URL;
    const pingServiceEndpoint = `${baseURL}/ext/ref/dropoff`;
    const username = process.env.NEXT_PUBLIC_PING_REST_AUTH_ID;
    const password = process.env.NEXT_PUBLIC_PING_REST_AUTH_PW;
    const instanceId = process.env.NEXT_PUBLIC_PING_REST_INSTANCE_ID;

    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    const headers = {
      'ping.instanceId': instanceId,
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
    console.log('Drop Off Endpoint :: ' + pingServiceEndpoint);
    console.log('Drop Off To Ping instance id :: ' + instanceId);
    console.log('Drop Off To Ping Basic Auth :: ' + auth);
    console.log(
      'Drop Off To Ping SSO Param Map :: ' +
        JSON.stringify(Object.fromEntries(myDataMap)),
    );

    const response = await axios.post<DropOffResp>(
      pingServiceEndpoint,
      Object.fromEntries(myDataMap),
      { headers },
    );

    console.log('Drop off Response :: ', response);
    if (response.status !== 200) {
      console.log('Failure error code', response.status);
      console.log(response.data);
      console.log(JSON.stringify(myDataMap));
      throw new Error(JSON.stringify(response.data));
    }
    return response.data.REF;
  } catch (error) {
    console.log('Error in dropOff:', error);
    if (error instanceof Error) {
      console.log(`Error posting information to ping: ${error.message}`);
    } else {
      console.log('Issue with PingDropOff', error);
    }
  }
}

export async function challengeDropOffToPing(myDataMap: Map<string, string>) {
  try {
    const token = await getSDKToken();
    const dropOffEndpoint = `${process.env.PING_ONE_BASE_URL}${process.env.NEXT_PUBLIC_ENV_ID}/davinci/policy/${process.env.DROP_OFF_POLICY_ID}/start`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    console.log(
      'Drop Off To Ping SSO Param Map :: ' +
        JSON.stringify(Object.fromEntries(myDataMap)),
    );

    const proxyUrl = 'http://webgateway.bcbst.com:80/';
    const agent = new HttpsProxyAgent(proxyUrl);
    const response = await axios.post<ChallengeDropOffResp>(
      dropOffEndpoint,
      Object.fromEntries(myDataMap),
      {
        proxy:
          process.env.NEXT_PUBLIC_PROXY?.toLocaleLowerCase() === 'false'
            ? false
            : undefined,
        headers,
        httpsAgent: agent,
      },
    );

    console.log('Drop off Response :: ', response);
    if (response.status !== 200) {
      throw new Error(JSON.stringify(response.data));
    }
    return response.data.additionalProperties.challenge;
  } catch (error) {
    console.log('Error in dropOff:', error);
    if (error instanceof Error) {
      console.log(`Error posting information to ping: ${error.message}`);
    } else {
      console.log('Issue with PingDropOff', error);
    }
  }
}
