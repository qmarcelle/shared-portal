'use server';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';

export const getImpersonationAccess = async (userAccountId: string) => {
  try {
    const response = await esApi.get(
      `/identityInformation?userAccountId=${userAccountId}`,
    );
    if (response.status !== 200) {
      logger.error('Error fetching identity information:', response.statusText);
      throw new Error('Failed to fetch identity information');
    }
    if (!response.data.data.identityInformations) {
      logger.error('Error fetching identity information:', response.statusText);
      throw new Error('No identity information found');
    }
    logger.info(`Found identity information for user ${userAccountId}`);
    const groups =
      response.data.data.identityInformations.identityInformation[0].groupNames
        .groupName;
    return groups.includes(process.env.IMPERSONATION_ADGROUP);
  } catch (error) {
    console.error('Error fetching identity information:', error);
    throw error;
  }
};
