import 'server-only';

import { getMemberAndDependents } from '@/actions/memberDetails';
import { invokePhoneNumberAction } from '@/app/profileSettings/actions/profileSettingsAction';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { FilterItem } from '@/models/filter_dropdown_details';
import { logger } from '@/utils/logger';
import { isBlueCareEligible } from '@/visibilityEngine/computeVisibilityRules';
import { PriorAuthData } from '../models/app/priorAuthAppData';
import { getInitialPriorAuthFilter } from './getInitialFilter';

export const getPriorAuthData = async (): Promise<
  ActionResponse<number, PriorAuthData>
> => {
  const session = await auth();
  const memberData = await getMemberAndDependents(
    session!.user.currUsr!.plan!.memCk,
  );
  const filterList = getInitialPriorAuthFilter(memberData);
  try {
    const [phoneNumber] = await Promise.allSettled([invokePhoneNumberAction()]);

    // Compute authorization type server-side
    const authorizationType = isBlueCareEligible(session?.user.vRules)
      ? 'blueCare'
      : 'standard';

    return {
      status: 200,
      data: {
        phoneNumber:
          phoneNumber.status === 'fulfilled' ? phoneNumber.value : '',
        authorizationType,
        visibilityRules: session?.user.vRules,
        filterList: filterList,
      },
    };
  } catch (error) {
    logger.error('Error in getPriorAuthData {} ', error);
    return {
      status: 400,
      data: {
        phoneNumber: '',
        authorizationType: 'standard',
        visibilityRules: session?.user.vRules,
        filterList: [] as FilterItem[],
      },
    };
  }
};
