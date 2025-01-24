'use server';

import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { PrimaryCareOptionsData } from '../model/app/primary_care_options_data';
import { getPCPInfo } from './pcpInfo';

export const getPrimaryCareOptionsData = async (): Promise<
  ActionResponse<number, PrimaryCareOptionsData>
> => {
  const session = await auth();
  try {
    const pcpPhysician = await getPCPInfo(session);
    return {
      status: 200,
      data: {
        primaryCareProvider: pcpPhysician,
        visibilityRules: session?.user.vRules,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        primaryCareProvider: null,
        visibilityRules: session?.user.vRules,
      },
    };
  }
};
