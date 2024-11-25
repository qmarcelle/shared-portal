'use server';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { CoverageType } from '@/models/member/api/loggedInUserInfo';
import { CoverageTypes } from '@/userManagement/models/coverageType';
import { DashboardData } from '../models/dashboardData';

export const getDashboardData = async (): Promise<
  ActionResponse<number, DashboardData>
> => {
  try {
    const session = await auth();
    const loggedUserInfo = await getLoggedInUserInfo(
      session?.user.currUsr?.plan.memCk ?? '',
    );

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
        role: session?.user.currUsr?.role,
        visibilityRules: session?.user.vRules,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        memberDetails: null,
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
