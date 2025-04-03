import { getPolicyInfo } from '@/actions/getPolicyInfo';
import { getVisibilityRules } from '@/actions/getVisibilityRules';
import { getUserProfiles } from '@/actions/profileData';
import { logger } from '@/utils/logger';
import { transformPolicyToPlans } from '@/utils/policy_computer';
import SiteHeader from '../foundation/SiteHeader';
import SiteHeaderPBEError from '../foundation/SiteHeaderPBEError';

export const SiteHeaderServerWrapper = async () => {
  const visibityRules = await getVisibilityRules();
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
