'use server';

import { getMemberAndDependentsPlanDetails } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';
import { formatText } from '@/utils/name_formatter';
import {
  ContactInfoData,
  ContactInfoResponse,
} from '../model/app/contactInfoResponse';
import { AllMyPlanData } from '../model/app/myPlanData';

export const getAllPlansData = async (): Promise<
  ActionResponse<number, AllMyPlanData<string>[]>
> => {
  const session = await auth();
  try {
    const membersData = await getMemberAndDependentsPlanDetails(session);

    const getAge = (DOB: string) => {
      const currentYear = new Date().getFullYear();
      const dobYear = DOB.split('/');
      const dobAge: number = parseInt(dobYear[2], 10);
      return currentYear - dobAge;
    };
    const memberPlanData: AllMyPlanData<string>[] = membersData.map((plan) => {
      const planContactMailingAddress = plan.address?.find(
        (contact) => contact.type === plan.mailAddressType,
      );
      return {
        memberName: formatText(plan.memberName),
        dob: new Date(plan.dob).toLocaleDateString(),
        planDetails: plan.planDetails,
        medicalEffectiveDate: plan.medicalEffectiveDate,
        dentalEffectiveDate: plan.dentalEffectiveDate,
        visionEffectiveDate: plan.visionEffectiveDate,
        address1:
          planContactMailingAddress != null
            ? `${planContactMailingAddress?.address1 ?? ''} `
            : '',
        address2:
          planContactMailingAddress != null
            ? `${planContactMailingAddress?.city ?? ''}, ${planContactMailingAddress?.state ?? ''} ${planContactMailingAddress?.zipcode ?? ''}`
            : '',
        primaryPhoneNumber: plan.primaryPhoneNumber,
        secondaryPhoneNumber: 'N/A',
        age: getAge(new Date(plan.dob).toLocaleDateString()),
        memCk: plan.memCk,
        loggedInMember: plan.memCk == session?.user.currUsr.plan?.memCk,
      };
    });

    return {
      status: 200,
      data: memberPlanData,
    };
  } catch (error) {
    logger.error('GetAllPlansData Failed', error);
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
    throw err;
  }
}
