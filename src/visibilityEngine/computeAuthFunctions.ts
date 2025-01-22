import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';

import { VisibilityRules } from './rules';

export function computeAuthFunctions(
  loggedUserInfo: LoggedInUserInfo,
  rules: VisibilityRules,
): void {
  const authFunctionsMap = new Map<string, boolean>(
    loggedUserInfo.authFunctions.map((x) => [x.functionName, x.available]),
  );

  rules.delinquent = authFunctionsMap.get('CLAIMSHOLD');

  rules.katieBeckNoBenefitsElig = authFunctionsMap.get('KB_NO_BENEFITS');

  rules.myPCPElig = authFunctionsMap.get('MYPCPELIGIBLE');

  rules.chipRewardsEligible = authFunctionsMap.get('CHIPELIGIBLE');

  rules.blueHealthRewardsEligible = authFunctionsMap.get('BLUEHEALTHREWARDS');

  rules.bluePerksElig = authFunctionsMap.get('BLUEPRKS');

  rules.condensedPortalExperienceGroups = authFunctionsMap.get(
    'CONDENSED_EXPERIENCE',
  );

  rules.amplifyMember = authFunctionsMap.get('AMPLIFYMEMBER');

  rules.myStrengthCompleteEligible = authFunctionsMap.get(
    'TELADOC_MYSTRENGTHCOMPLETE',
  );

  rules.mentalHealthSupport = authFunctionsMap.get('MENTAL_HEALTH_SUPPORT');

  rules.primary360Eligible = authFunctionsMap.get('TELADOC_PRIMARY360');

  rules.individualSBCEligible = authFunctionsMap.get('INDIVIDUAL_SBC_ELIGIBLE');

  rules.medicareAdvantageGroupIndicator = authFunctionsMap.get(
    'MedicareAdvantageGroupIndicator',
  );

  rules.isCondensedExperience = authFunctionsMap.get('CONDENSED_EXPERIENCE');

  rules.enRollEligible = authFunctionsMap.get('ENROLLELIGIBLE');

  rules.enableBenefitChange = authFunctionsMap.get('ENABLE_BENEFIT_CHANGE_TAB');

  rules.dentalCostsEligible = authFunctionsMap.get('DENTALCOSTELIGIBLE');

  rules.enableCostTools = authFunctionsMap.get('ENABLE_COST_TOOLS');

  rules.payMyPremiumElig = authFunctionsMap.get('PAYMYPREMIUMELIGIBLE');

  rules.mentalHealthSupport = authFunctionsMap.get('MENTAL_HEALTH_SUPPORT');

  rules.myStrengthCompleteEligible = authFunctionsMap.get(
    'TELADOC_MYSTRENGTHCOMPLETE',
  );

  rules.primary360Eligible = authFunctionsMap.get('TELADOC_PRIMARY360');

  rules.hingeHealthEligible = authFunctionsMap.get('HINGE_HEALTH_ELIGIBLE');

  rules.groupRenewalDateBeforeTodaysDate = authFunctionsMap.get(
    'GROUP_RENEWAL_DATE_BEFORE_TODAY',
  );

  rules.healthCoachElig = authFunctionsMap.get('HEALTHCOACHELIGIBLE');

  rules.isAmplifyMem = authFunctionsMap.get('AMPLIFYMEMBER');

  rules.diabetesPreventionEligible = authFunctionsMap.get(
    'TELADOC_DIABETESPREVENTION',
  );

  rules.cmEnable = authFunctionsMap.get('careManagementExclusion');

  rules.ohdEligible = authFunctionsMap.get('OHDELIGIBLE');

  rules.displayPharmacyTab = authFunctionsMap.get('ENABLE_PHAR_TAB');

  rules.otcEnable = authFunctionsMap.get('OTCEnable');

  rules.fsaHraEligible = authFunctionsMap.get('FSAHRAELIGIBLE');

  rules.flexibleSpendingAccount = authFunctionsMap.get(
    'FlexibleSpendingAccount',
  );

  rules.healthReimbursementAccount = authFunctionsMap.get(
    'HealthReimbursementAccount',
  );
}
