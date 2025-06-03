'use server';
import { auth } from '@/auth';
import {
  benefitChangeService,
  REGION_CODE,
  USER_HEADER,
} from '@/utils/api/benefitChangeService';
import { logger } from '@/utils/logger';
import { ServiceError } from '../models/service_responses/ServiceError';
import { StringWrapper } from '../models/service_responses/StringWrapper';

const getRegionCodeForCounty = async (county: string) => {
  try {
    const session = await auth();
    const userId = session!.user.id;

    if (county == null) throw new Error('County is required');
    const urlEncodedCounty = encodeURIComponent(county.trim());

    const response = await benefitChangeService.get(
      `${REGION_CODE}/${urlEncodedCounty}`,
      {
        headers: {
          [USER_HEADER]: userId,
          ['Accept']: 'application/json',
        },
      },
    );
    const regionCode: StringWrapper = response.data;
    const serviceError: ServiceError | undefined = regionCode.serviceError;
    if (serviceError) {
      throw new Error(
        `Get Region Code Call failed: ${serviceError.id} - ${serviceError.description}`,
      );
    }
    return regionCode.value;
  } catch (err) {
    logger.error('Get Counties Failed', err);
    console.error(err);
    return '12';
  }
};

export default getRegionCodeForCounty;
