'use server';
import { auth } from '@/auth';
import {
  benefitChangeService,
  MEDICAL_PLANS,
  RESOURCE_API,
  USER_HEADER,
} from '@/utils/api/benefitChangeService';
import { logger } from '@/utils/logger';
import { MedicalMockData } from '../mock/medicalMockResponse';
import { PlansRequest } from '../models/service_responses/PlansRequest';
import { Products } from '../models/service_responses/Products';
import { ServiceError } from '../models/service_responses/ServiceError';

export const getMedicalPlans = async (plansRequest: PlansRequest) => {
  try {
    const session = await auth();
    const userId = session!.user.id;
    const compiledURL = `${RESOURCE_API}${MEDICAL_PLANS}`;
    const response = await benefitChangeService.post(
      compiledURL,
      plansRequest,
      {
        headers: {
          [USER_HEADER]: userId,
          ['Accept']: 'application/json',
        },
      },
    );
    const plans = response.data as Products;
    const serviceError: ServiceError | undefined = plans.serviceError;
    if (serviceError) {
      throw new Error(
        `Get Plans failed: ${serviceError.id} - ${serviceError.description}`,
      );
    }

    return plans.products;
  } catch (err) {
    logger.error('Get Medical Plan Failed', err);
    console.error(err);
    return MedicalMockData;
  }
};
