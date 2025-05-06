'use server';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { PrimaryCareOptionsData } from '@/app/(commo../(common)/findcare/primaryCareOptions/model/app/primary_care_options_data';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { logger } from '@/utils/logger';
import { getDependentPCPInfo, getPCPProviderInfo } from './getPCPInfo';

export const getPrimaryCareOptionsData = async (): Promise<
  ActionResponse<number, PrimaryCareOptionsData>
> => {
  
  try {
    const session = await auth();
    const loggedUserInfo = await getLoggedInUserInfo(
    session!.user.currUsr!.plan!.memCk,
  );
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
    logger.error('Primary Care Provider API - Failure', error);
    return {
      status: 400,
      data: {
        primaryCareProvider: null,
      },
    };
  }
};
