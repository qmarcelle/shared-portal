'use server';

import { getMemberAndDependentsPlanDetails } from '@/actions/memberDetails';
import { auth } from '@/app/(system)/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';
import {
  ContactInfoData,
  ContactInfoResponse,
} from '../model/app/contactInfoResponse';
import { AllMyPlanData } from '../model/app/myPlanData';

export const getAllPlansData = async (): Promise<
  ActionResponse<number, AllMyPlanData[]>
> => {
  const session = await auth();
  try {
    const membersData = await getMemberAndDependentsPlanDetails(session);
    return {
      status: 200,
      data: membersData,
    };
  } catch (error) {
    return {
      status: 400,
      data: [],
    };
  }
};

export async function getContactInfo(umpi: string): Promise<ContactInfoData> {
  try {
    const resp = await portalSvcsApi.get<ContactInfoResponse>('/contact', {
      params: {
        umpi,
      },
    });

    return resp.data.data;
  } catch (err) {
    logger.error('Contact Api Failed', err);
    return {
      email: 'demo@bcbst.com',
      email_verified_flag: true,
      phone: '7654387656',
      phone_verified_flag: true,
      umpi: 'pool5',
    };
    //throw err;
  }
}
