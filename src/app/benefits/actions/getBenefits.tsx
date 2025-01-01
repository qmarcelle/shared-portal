import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { logger } from '@/utils/logger';
import { BenefitsData } from '../models/benefitsData';

export async function getBenefits(): Promise<
  ActionResponse<number, BenefitsData>
> {
  try {
    const session = await auth();

    return {
      status: 200,
      data: {
        visibilityRules: session?.user.vRules,
      },
    };
  } catch (err) {
    const session = await auth();
    console.error(err);
    logger.error('benefits Retrieval failed', err);
    return {
      status: 400,
      data: {
        visibilityRules: session?.user.vRules,
      },
    };
  }
}
