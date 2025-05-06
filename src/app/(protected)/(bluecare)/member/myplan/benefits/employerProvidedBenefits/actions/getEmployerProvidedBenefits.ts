'use server';

import { BenefitsProviderInfo } from '@/app/(protected)/(common)/member/dashboard/models/BenefitsProviderInfo';
import { ActionResponse } from '@/models/app/actionResponse';
import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { EmployerProvidedBenefitsResponse } from '../models/employerProvidedBenefitsResponse';

export async function getEmployerProvidedBenefits(
  memeCK: string,
): Promise<ActionResponse<number, BenefitsProviderInfo[]>> {
  try {
    const resp = await memberService.get<EmployerProvidedBenefitsResponse>(
      `/api/member/v1/members/byMemberCk/${memeCK}/benefits/employerProvidedBenefits`,
    );
    return {
      status: 200,
      data: resp.data.benefitSumInfo
        .flatMap((item) => {
          return item.carveOutInfo?.map((item) => ({
            providedBy: item.name,
            id: item.name,
            contact: item.contactNumber?.split(',')[0]?.substring(1),
            url: item.contactNumber?.split(',')[1]
              ? `https://${item.contactNumber.split(',')[1]!.substring(1)}`
              : undefined,
          }));
        })
        .filter((item) => item != undefined),
    };
  } catch (err) {
    logger.error('Employer Provided Benefits API Failed', err);
    return {
      status: 400,
    };
  }
}
