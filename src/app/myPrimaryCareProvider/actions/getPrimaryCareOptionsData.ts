'use server';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { PrimaryCareOptionsData } from '@/app/findcare/primaryCareOptions/model/app/primary_care_options_data';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { getDependentPCPInfo, getPCPProviderInfo } from './getPCPInfo';

export const getPrimaryCareOptionsData = async (): Promise<
  ActionResponse<number, PrimaryCareOptionsData>
> => {
  const session = await auth();
  const loggedUserInfo = await getLoggedInUserInfo(
    session?.user.currUsr?.plan.memCk ?? '',
  );
  try {
    const pcpPhysician = await getPCPProviderInfo(loggedUserInfo, session);
    const depPcpPhysician = await getDependentPCPInfo(loggedUserInfo, session);
    return {
      status: 200,
      data: {
        primaryCareProvider: pcpPhysician,
        dependentPrimaryCareProvider: depPcpPhysician,
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
