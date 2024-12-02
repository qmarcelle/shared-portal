import { logger } from '@/utils/logger';
import axios from 'axios';
import https from 'https';

export const getExternalAppIframeContent = async (
  url: string,
  userId: string,
): Promise<string> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_ANWAS_31_URL}${url}`,
      {
        proxy:
          process.env.NEXT_PUBLIC_PROXY?.toLocaleLowerCase() === 'false'
            ? false
            : undefined,
        headers: {
          userID: userId,
        },
        //Need to Remove once we get proper url for anwas31
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      },
    );
    return response?.data;
  } catch (error) {
    logger.error('Error Response from External App Iframe content', error);
    throw error;
  }
};
