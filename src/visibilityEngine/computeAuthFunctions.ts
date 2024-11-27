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

  rules.identityProtectionServices = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'IDPROTECTELIGIBLE',
  )?.available;

  rules.otcEnable = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'OTCEnable',
  )?.available;

  rules.otcEnable = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'ENABLE_PHAR_TAB',
  )?.available;

  rules.bluePerksEligible = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'BLUEPRKS',
  )?.available;
}
