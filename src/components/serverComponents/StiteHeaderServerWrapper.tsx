import { getPolicyInfo } from '@/actions/getPolicyInfo';
import { getUserProfiles } from '@/actions/profileData';
import { auth } from '@/auth';
import { logger } from '@/utils/logger';
import { transformPolicyToPlans } from '@/utils/policy_computer';
import SiteHeader from '../foundation/SiteHeader';
import SiteHeaderPBEError from '../foundation/SiteHeaderPBEError';

export const SiteHeaderServerWrapper = async () => {
  //const visibityRules = await getVisibilityRules();
  const session = await auth();
  const visibityRules = session?.user.vRules;
  if (visibityRules) {
    try {
      const profiles = await getUserProfiles();
      const selectedProfile = profiles.find((item) => item.selected == true)!;
      const selectedPlanId = selectedProfile?.plans.find(
        (item) => item.selected == true,
      )?.memCK;
      let policyInfo;
      try {
        policyInfo =
          selectedProfile!.plans?.length > 0
            ? await getPolicyInfo(
                selectedProfile!.plans.map((item) => item.memCK),
              )
            : null;
      } catch (error) {
        logger.error('SiteHeader Action - getPolicyInfo Failed {}', error);
      }
      const plans = policyInfo ? transformPolicyToPlans(policyInfo) : [];
      const selectedPlan = selectedPlanId
        ? plans?.find((item) => item.memeCk == selectedPlanId)
        : undefined;

      return (
        <SiteHeader
          visibilityRules={visibityRules}
          profiles={profiles}
          plans={plans}
          selectedPlan={selectedPlan}
          selectedProfile={selectedProfile}
          userId={session?.user.id}
          groupId={session?.user.currUsr.plan?.grpId}
        />
      );
    } catch (error) {
      logger.error('SiteHeader Action - getPBEConsentDetails Failed {}', error);
      return <SiteHeaderPBEError />;
    }
  } else {
    return <></>;
  }
};
