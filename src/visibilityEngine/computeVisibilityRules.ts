import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { encodeVisibilityRules } from './converters';
import { VisibilityRules } from './rules';

const COMMERCIAL_LOB = ['REGL'];
const INDIVIDUAL_LOB = ['INDV'];

const PTYP_SELF_FUNDED: string[] = ['ASO', 'CLIN', 'COST'];
const PTYP_LEVEL_FUNDED: string[] = ['LVLF'];
const PTYP_FULLY_INSURED: string[] = [
  'SGR',
  'SGN',
  'MINP',
  'MPOA',
  'ERAT',
  'IER',
  'LGP',
  'INDV',
];

export function computeVisibilityRules(
  loggedUserInfo: LoggedInUserInfo,
): string {
  //TODO: Update the rules computation logic with the current implementation
  const rules: VisibilityRules = {};

  rules.active = loggedUserInfo.isActive;
  rules.subscriber = loggedUserInfo.subscriberLoggedIn;
  rules.commercial = COMMERCIAL_LOB.includes(loggedUserInfo.lob);
  rules.individual = INDIVIDUAL_LOB.includes(loggedUserInfo.lob);
  rules.selfFunded = PTYP_SELF_FUNDED.includes(
    loggedUserInfo.groupData.policyType,
  );
  rules.fullyInsured = PTYP_FULLY_INSURED.includes(
    loggedUserInfo.groupData.policyType,
  );
  rules.levelFunded = PTYP_LEVEL_FUNDED.includes(
    loggedUserInfo.groupData.policyType,
  );

  rules.delinquent = loggedUserInfo.authFunctions.find(
    (f) => f.functionName == 'CLAIMSHOLD',
  )?.available;

  loggedUserInfo.members.forEach((member) => {
    //Logic for subscriber
    if (member.memRelation == 'M') {
      rules.futureEffective = member.futureEffective;
    }
    rules.externalSpendingAcct = loggedUserInfo.healthCareAccounts?.length > 0;
  });

  rules['employerProvidedBenefits'] = false;
  rules['premiumHealth'] = true;
  rules['pharmacy'] = true;
  rules['amplifyHealth'] = false;
  rules['teladoc'] = true;
  return encodeVisibilityRules(rules);
}

async function getRoles() {}

async function getPermissions() {}

async function getFunctionsAvailability() {}
