'use server';
import { auth } from '@/auth';
import {
  benefitChangeService,
  GET_PLANS,
  RESOURCE_API,
  USER_HEADER,
} from '@/utils/api/benefitChangeService';
import { logger } from '@/utils/logger';
import { Plans } from '../models/service_responses/Plans';
import { ServiceError } from '../models/service_responses/ServiceError';

export const getPlans = async (
  subscriberId: string,
  planType: string,
  eligDate: Date,
) => {
  try {
    const session = await auth();
    const userId = session!.user.id;
    const compiledURL = `${RESOURCE_API}${GET_PLANS}/${subscriberId}?eligdate${eligDate}&producttype=${planType}`;
    const response = await benefitChangeService.post(compiledURL, {
      headers: {
        [USER_HEADER]: userId,
      },
    });
    if (response.data.serviceError) {
      throw new Error(
        `Get Applications Call failed: ${response.data.serviceError}`,
      );
    }
    const plans = response.data as Plans;
    const serviceError: ServiceError | undefined = plans.serviceError;
    if (serviceError) {
      throw new Error(
        `Get Plans failed: ${serviceError.id} - ${serviceError.description}`,
      );
    }

    return plans.plans;
  } catch (err) {
    logger.error('Get Counties Failed', err);
    console.error(err);
    if (planType === 'M') return ['EGSWB808'];
    else if (planType === 'D') return ['DID00003'];
    else return ['VEMIS003'];
    //return MockMedicalPlan;
  }
};
