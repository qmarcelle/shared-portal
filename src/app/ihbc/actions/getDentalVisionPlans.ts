import {
  benefitChangeService,
  DENTAL_VISION_PLANS,
  RESOURCE_API,
  USER_HEADER,
} from '@/utils/api/benefitChangeService';
import { logger } from '@/utils/logger';
import { dentalMockResponse } from '../mock/dentalMockResponse';
import { Product } from '../models/Product';
import { PlansRequest } from '../models/service_responses/PlansRequest';
import { Products } from '../models/service_responses/Products';
import { ServiceError } from '../models/service_responses/ServiceError';

export const getDentalVisionPlans = async (
  plansRequest: PlansRequest,
  userId: string,
): Promise<Product[]> => {
  try {
    const compiledURL = `${RESOURCE_API}${DENTAL_VISION_PLANS}`;
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
    logger.error('Get DentalVisionPlans Failed', err);
    console.error(err);
    //throw err;
    return dentalMockResponse;
  }
};
