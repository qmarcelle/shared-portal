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
}
