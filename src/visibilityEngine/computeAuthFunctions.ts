import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';

import { VisibilityRules } from './rules';

export function computeAuthFunctions(
  loggedUserInfo: LoggedInUserInfo,
  rules: VisibilityRules,
): void {
  rules.delinquent = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'CLAIMSHOLD',
  )?.available;

  rules.katieBeckNoBenefitsElig = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'KB_NO_BENEFITS',
  )?.available;

  rules.myPCPElig = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'MYPCPELIGIBLE',
  )?.available;

  rules.chipRewardsEligible = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'CHIPELIGIBLE',
  )?.available;

  rules.blueHealthRewardsEligible = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'BLUEHEALTHREWARDS',
  )?.available;

  rules.bluePerksElig = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'BLUEPRKS',
  )?.available;

  rules.myStrengthCompleteEligible = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'TELADOC_MYSTRENGTHCOMPLETE',
  )?.available;

  rules.mentalHealthSupport = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'MENTAL_HEALTH_SUPPORT',
  )?.available;

  rules.primary360Eligible = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'TELADOC_PRIMARY360',
  )?.available;

  rules.individualSBCEligible = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'INDIVIDUAL_SBC_ELIGIBLE',
  )?.available;

  rules.medicareAdvantageGroupIndicator = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'MedicareAdvantageGroupIndicator',
  )?.available;

  rules.isCondensedExperience = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'CONDENSED_EXPERIENCE',
  )?.available;

  rules.enRollEligible = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'ENROLLELIGIBLE',
  )?.available;

  rules.enableBenefitChange = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'ENABLE_BENEFIT_CHANGE_TAB',
  )?.available;

  rules.dentalCostsEligible = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'DENTALCOSTELIGIBLE',
  )?.available;

  rules.enableCostTools = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'ENABLE_COST_TOOLS',
  )?.available;

  rules.payMyPremiumElig = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'PAYMYPREMIUMELIGIBLE',
  )?.available;

  rules.mentalHealthSupport = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'MENTAL_HEALTH_SUPPORT',
  )?.available;

  rules.myStrengthCompleteEligible = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'TELADOC_MYSTRENGTHCOMPLETE',
  )?.available;

  rules.primary360Eligible = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'TELADOC_PRIMARY360',
  )?.available;

  rules.hingeHealthEligible = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'HINGE_HEALTH_ELIGIBLE',
  )?.available;

  rules.groupRenewalDateBeforeTodaysDate = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'GROUP_RENEWAL_DATE_BEFORE_TODAY',
  )?.available;

  rules.healthCoachElig = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'HEALTHCOACHELIGIBLE',
  )?.available;

  rules.isAmplifyMem = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'AMPLIFYMEMBER',
  )?.available;
}
