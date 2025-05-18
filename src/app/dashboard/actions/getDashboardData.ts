'use server';

import { getPolicyInfo } from '@/actions/getPolicyInfo';
import { getLoggedInMember } from '@/actions/memberDetails';
import { getEmployerProvidedBenefits } from '@/app/benefits/employerProvidedBenefits/actions/getEmployerProvidedBenefits';
import { getPCPInfo } from '@/app/findcare/primaryCareOptions/actions/pcpInfo';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { CoverageType } from '@/models/member/api/loggedInUserInfo';
import { CoverageTypes } from '@/userManagement/models/coverageType';
import { UserRole } from '@/userManagement/models/sessionUser';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { logger } from '@/utils/logger';
import { transformPolicyToPlans } from '@/utils/policy_computer';
import { computeUserProfilesFromPbe } from '@/utils/profile_computer';
import { error } from 'console';
import { DashboardData } from '../models/dashboardData';
import { getDashboarPriorAuthData } from './getDashboarPriorAuthData';

export const getDashboardData = async (): Promise<
  ActionResponse<number, DashboardData>
> => {
  try {
    const session = await auth();
    // Check if current user is non member
    if (session?.user.currUsr.role == UserRole.NON_MEM) {
      // Get the name of the non member and send off
      const pbe = await getPersonBusinessEntity(session!.user!.id);
      return {
        status: 200,
        data: {
          memberDetails: {
            firstName: pbe.getPBEDetails[0].firstName,
            lastName: pbe.getPBEDetails[0].lastName,
          },
          role: UserRole.NON_MEM,
          profiles: computeUserProfilesFromPbe(pbe),
        },
      };
    } else if (session?.user.currUsr.plan == null) {
      const pbe = await getPersonBusinessEntity(session!.user!.id);
      const profiles = computeUserProfilesFromPbe(
        pbe,
        session?.user.currUsr.umpi,
      );
      const selectedProfile = profiles.find((item) => item.selected == true);
      const plans = await getPolicyInfo(
        selectedProfile!.plans.map((item) => item.memCK),
      );
      if (plans.currentPolicies.length == 0 && plans.pastPolicies.length == 0)
        throw 'NoPlansAvailable';
      return {
        status: 200,
        data: {
          memberDetails: {
            firstName: selectedProfile!.firstName,
            lastName: selectedProfile!.lastName,
            plans: transformPolicyToPlans(plans),
          },
          role: session!.user.currUsr.role,
        },
      };
    }

    const [
      loggedUserDetails,
      primaryCareProviderData,
      employerProvidedBenefits,
      planDetails,
    ] = await Promise.allSettled([
      getLoggedInMember(session),
      getPCPInfo(session),
      getEmployerProvidedBenefits(session?.user.currUsr?.plan.memCk ?? ''),
      getPolicyInfo((session?.user.currUsr?.plan.memCk ?? '').split(',')),
    ]);

    let loggedUserInfo;
    if (
      loggedUserDetails.status !== 'fulfilled' ||
      planDetails.status !== 'fulfilled'
    )
      throw error;
    else {
      loggedUserInfo = loggedUserDetails.value;
      if (
        planDetails.value.currentPolicies.length == 0 &&
        planDetails.value.pastPolicies.length == 0
      )
        throw 'NoPlansAvailable';
    }

    return {
      status: 200,
      data: {
        memberDetails: {
          firstName: loggedUserInfo.firstName,
          lastName: loggedUserInfo.lastName,
          planName: loggedUserInfo.groupName,
          coverageType: computeCoverageType(loggedUserInfo.coverageTypes),
          subscriberId: loggedUserInfo.subscriberId,
          groupId: loggedUserInfo.groupId,
          selectedPlan:
            planDetails.status === 'fulfilled'
              ? transformPolicyToPlans(planDetails.value)[0]
              : undefined,
        },
        primaryCareProvider:
          primaryCareProviderData.status === 'fulfilled'
            ? primaryCareProviderData.value
            : null,
        employerProvidedBenefits:
          employerProvidedBenefits.status === 'fulfilled' &&
          employerProvidedBenefits.value.status === 200
            ? employerProvidedBenefits.value.data
            : null,
        role: session?.user.currUsr?.role,
        visibilityRules: session?.user.vRules,
        priorAuthDetail: getDashboarPriorAuthData(),
      },
    };
  } catch (error) {
    logger.error('getDashboardData failed{}', error);
    return {
      status: 400,
      data: {
        memberDetails: null,
        primaryCareProvider: null,
        role: null,
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
