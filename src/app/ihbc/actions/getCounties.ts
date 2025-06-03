'use server';
import { auth } from '@/auth';
import {
  COUNTY_SETTING,
  RESOURCE_API,
  USER_HEADER,
  benefitChangeService,
} from '@/utils/api/benefitChangeService';
import { logger } from '@/utils/logger';
import { Counties } from '../models/service_responses/Counties';
import { ServiceError } from '../models/service_responses/ServiceError';

const getCounties = async (zipCode: string) => {
  try {
    logger.info('Calling GetCounties Api');
    const session = await auth();
    const userId = session!.user.id;
    const response = await benefitChangeService.post(
      RESOURCE_API + COUNTY_SETTING,
      zipCode,
      {
        headers: {
          [USER_HEADER]: userId,
          ['Accept']: 'application/json',
        },
      },
    );

    const counties = response.data as Counties;
    const serviceError: ServiceError | undefined = counties.serviceError;
    if (serviceError) {
      throw new Error(
        `Get Counties Call failed: ${serviceError.id} - ${serviceError.description}`,
      );
    }
    return counties.countyList;
  } catch (err) {
    logger.error('Get Counties Failed', err);
    console.error(err);
  }
};

export default getCounties;
