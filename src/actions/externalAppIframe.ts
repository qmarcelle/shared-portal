'use client';
import { logger } from '@/utils/logger';
import axios from 'axios';
import https from 'https';

export const getExternalAppIframeContent = async (
  url: string,
  userId: string,
): Promise<string> => {
  try {
    const response = await axios.get(url, {
      proxy:
        process.env.NEXT_PUBLIC_PROXY?.toLocaleLowerCase() === 'false'
          ? false
          : undefined,
      headers: {
        userID: userId,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    logger.info('Request Headers:', response.config.headers);
    if (response.status !== 200) {
      logger.error(
        'Error Response from External App Iframe content',
        response.statusText,
        response.status,
        response.data,
      );
      throw new Error(`Error fetching iframe content: ${response.statusText}`);
    }
    return response?.data;
  } catch (error) {
    logger.error('Error Response from External App Iframe content', error);
    throw error;
  }
};
