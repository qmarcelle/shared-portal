'use server';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { getPCPInfo } from '@/app/findcare/primaryCareOptions/actions/pcpInfo';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { CoverageType } from '@/models/member/api/loggedInUserInfo';
import { CoverageTypes } from '@/userManagement/models/coverageType';
import { error } from 'console';
import { DashboardData } from '../models/dashboardData';

export const getDashboardData = async (): Promise<
  ActionResponse<number, DashboardData>
> => {
  try {
    const session = await auth();
    const [loggedUserDetails, primaryCareProviderData] =
      await Promise.allSettled([
        getLoggedInUserInfo(session?.user.currUsr?.plan.memCk ?? ''),
        getPCPInfo(session),
      ]);

    let loggedUserInfo;
    if (loggedUserDetails.status === 'fulfilled')
      loggedUserInfo = loggedUserDetails.value;
    else throw error;
    return {
      status: 200,
      data: {
        memberDetails: {
          firstName: loggedUserInfo.subscriberFirstName,
          lastName: loggedUserInfo.subscriberLastName,
          planName: loggedUserInfo.groupData.groupName,
          coverageType: computeCoverageType(loggedUserInfo.coverageTypes),
          subscriberId: loggedUserInfo.subscriberID,
          groupId: loggedUserInfo.groupData.groupID,
        },
        primaryCareProvider:
          primaryCareProviderData.status === 'fulfilled'
            ? primaryCareProviderData.value
            : null,
        role: session?.user.currUsr?.role,
        visibilityRules: session?.user.vRules,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        memberDetails: null,
        primaryCareProvider: null,
      },
    };
  }
};

const computeCoverageType = (coverageTypes: CoverageType[]): string[] => {
  const policies: string[] = [];
  coverageTypes.map((coverage) => {
    if (CoverageTypes.get(coverage.productType)) {
      policies.push(CoverageTypes.get(coverage.productType)!);
    }
  });
  return policies;
};
