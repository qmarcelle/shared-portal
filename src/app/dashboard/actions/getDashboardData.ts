'use server';

import { getPolicyInfo } from '@/actions/getPolicyInfo';
import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
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

export const getDashboardData = async (): Promise<
  ActionResponse<number, DashboardData>
> => {
  logger.info('[getDashboardData] ENTRY');
  try {
    const session = await auth();
    logger.info('[getDashboardData] Session fetched', {
      userId: session?.user.id,
      role: session?.user.currUsr.role,
    });
    // Check if current user is non member
    if (session?.user.currUsr.role == UserRole.NON_MEM) {
      logger.info(
        '[getDashboardData] User is NON_MEM, calling getPersonBusinessEntity',
        { userId: session!.user!.id },
      );
      const pbe = await getPersonBusinessEntity(session!.user!.id);
      logger.info('[getDashboardData] PBE fetched', {
        pbeSummary:
          pbe && pbe.getPBEDetails ? pbe.getPBEDetails.length : 'none',
      });
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
      logger.info(
        '[getDashboardData] User has no plan, calling getPersonBusinessEntity',
        { userId: session!.user!.id },
      );
      const pbe = await getPersonBusinessEntity(session!.user!.id);
      logger.info('[getDashboardData] PBE fetched', {
        pbeSummary:
          pbe && pbe.getPBEDetails ? pbe.getPBEDetails.length : 'none',
      });
      const profiles = computeUserProfilesFromPbe(
        pbe,
        session?.user.currUsr.umpi,
      );
      const selectedProfile = profiles.find((item) => item.selected == true);
      logger.info('[getDashboardData] Selected profile', { selectedProfile });
      const plans = await getPolicyInfo(
        selectedProfile!.plans.map((item) => item.memCK),
      );
      logger.info('[getDashboardData] Plans fetched', {
        plansCount: Array.isArray(plans) ? plans.length : typeof plans,
      });
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
    logger.info('[getDashboardData] Fetching additional dashboard data');
    const [
      loggedUserDetails,
      primaryCareProviderData,
      employerProvidedBenefits,
      planDetails,
    ] = await Promise.allSettled([
      getLoggedInUserInfo(session?.user.currUsr?.plan.memCk ?? ''),
      getPCPInfo(session),
      getEmployerProvidedBenefits(session?.user.currUsr?.plan.memCk ?? ''),
      getPolicyInfo((session?.user.currUsr?.plan.memCk ?? '').split(',')),
    ]);
    let loggedUserInfo;
    if (loggedUserDetails.status === 'fulfilled')
      loggedUserInfo = loggedUserDetails.value;
    else {
      logger.error('[getDashboardData] loggedUserDetails failed', {
        error: loggedUserDetails.reason,
      });
      throw error;
    }
    logger.info('[getDashboardData] EXIT success');
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
      },
    };
  } catch (error) {
    logger.error('[getDashboardData] ERROR', { error });
    return {
      status: 500,
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
