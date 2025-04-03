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
      const planContactMailingAddress = plan.address.find(
        (contact) => contact.type === plan.mailAddressType,
      );
      return {
        memberName: formatText(plan.memberName),
        dob: new Date(plan.dob).toLocaleDateString(),
        planDetails: plan.planDetails,
        medicalEffectiveDate: plan.medicalEffectiveDate,
        dentalEffectiveDate: plan.dentalEffectiveDate,
        visionEffectiveDate: plan.visionEffectiveDate,
        address:
          planContactMailingAddress != null
            ? `${planContactMailingAddress?.address1 ?? ''} ${planContactMailingAddress?.city ?? ''}, ${planContactMailingAddress?.state ?? ''} ${planContactMailingAddress?.zipcode ?? ''}`
            : '',
        primaryPhoneNumber: plan.primaryPhoneNumber,
        secondaryPhoneNumber: 'N/A',
        age: getAge(new Date(plan.dob).toLocaleDateString()),
      };
    });

    return {
      status: 200,
      data: memberPlanData,
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
