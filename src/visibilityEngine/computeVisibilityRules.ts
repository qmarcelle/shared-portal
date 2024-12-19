import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { computeAuthFunctions } from './computeAuthFunctions';
import { computeCoverageTypes } from './computeCoverageType';
import { encodeVisibilityRules } from './converters';
import { VisibilityRules } from './rules';


const COMMERCIAL_LOB = ['REGL'];
const INDIVIDUAL_LOB = ['INDV'];
const MEDICAID_LOB = ['MEDA'];

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

let groupID: string;
export function computeVisibilityRules(
  loggedUserInfo: LoggedInUserInfo,
): string {
  //TODO: Update the rules computation logic with the current implementation
  const rules: VisibilityRules = {};

  rules.active = loggedUserInfo.isActive;
  rules.subscriber = loggedUserInfo.subscriberLoggedIn;
  rules.externalSpendingAcct = loggedUserInfo.healthCareAccounts?.length > 0;
  rules.commercial = COMMERCIAL_LOB.includes(loggedUserInfo.lob);
  rules.individual = INDIVIDUAL_LOB.includes(loggedUserInfo.lob);
  rules.blueCare = MEDICAID_LOB.includes(loggedUserInfo.lob);
  groupID = loggedUserInfo.groupData.groupID;
  rules.selfFunded = PTYP_SELF_FUNDED.includes(
    loggedUserInfo.groupData.policyType,
  );
  rules.fullyInsured = PTYP_FULLY_INSURED.includes(
    loggedUserInfo.groupData.policyType,
  );
  rules.levelFunded = PTYP_LEVEL_FUNDED.includes(
    loggedUserInfo.groupData.policyType,
  );

  computeAuthFunctions(loggedUserInfo, rules);

  for (const member of loggedUserInfo.members) {
    if (member.memRelation == 'M') {
      rules.futureEffective = member.futureEffective;
      rules.terminated = !member.isActive;
      computeCoverageTypes(member, rules);
      break;
    }
  }

  rules['employerProvidedBenefits'] = false;
  rules['premiumHealth'] = true;
  rules['pharmacy'] = true;
  rules['teladoc'] = true;
  return encodeVisibilityRules(rules);
}

const isSelfCommercial = (rules: VisibilityRules | undefined) => {
  return rules?.commercial && rules?.selfFunded;
};

const isLobCommercial = (rules: VisibilityRules | undefined) => {
  return rules?.commercial || rules?.individual;
};

const isActiveAndNotFSAOnly = (rules: VisibilityRules | undefined) => {
  return (
    !rules?.futureEffective &&
    !rules?.fsaOnly &&
    !rules?.terminated &&
    !rules?.katieBeckNoBenefitsElig
  );
};

export const isChipRewardsEligible = (rules: VisibilityRules | undefined) => {
  return (
    (isSelfCommercial(rules) || !isLobCommercial(rules) || rules?.individual) &&
    isActiveAndNotFSAOnly(rules) &&
    rules?.chipRewardsEligible &&
    rules?.blueHealthRewardsEligible
  );
};

async function getRoles() {}

async function getPermissions() {}

async function getFunctionsAvailability() {}

function activeAndHealthPlanMember(rules: VisibilityRules | undefined) {
  return (
    !rules?.futureEffective &&
    !rules?.fsaOnly &&
    !rules?.wellnessOnly &&
    !rules?.terminated &&
    !rules?.katieBeckNoBenefitsElig
  );
}

export function isBlueCareEligible(rules: VisibilityRules | undefined) {
  return activeAndHealthPlanMember(rules) && rules?.blueCare;
}

export function isBlueCareNotEligible(rules: VisibilityRules | undefined) {
  return !isBlueCareEligible(rules);
}

export function isPrimaryCarePhysicianEligible(
  rules: VisibilityRules | undefined,
) {
  return activeAndHealthPlanMember(rules) && rules?.myPCPElig;
}

export function isBlue365FitnessYourWayEligible(
  rules: VisibilityRules | undefined,
) {
  return (rules?.individual || rules?.commercial) && rules?.bluePerksElig;
}

export function isBenefitBookletEnabled(rules: VisibilityRules | undefined) {
  return (
    !rules?.wellnessOnly &&
    (rules?.individualSBCEligible ||
      rules?.commercial ||
      rules?.medicareAdvantageGroupIndicator) &&
    rules.subscriber &&
    hasCondensesedExperienceProfiler(rules) != 'Quantum'
  );
}

function hasCondensesedExperienceProfiler(rules: VisibilityRules | undefined) {
  if (rules?.isCondensedExperience && groupID == '130430')
    return 'FirstHorizon';
  if (rules?.isCondensedExperience) return 'Quantum';
}

export function isCommunicationSettingsEligible(
  rules: VisibilityRules | undefined,
) {
  return !rules?.terminated && !rules?.futureEffective;
}

export function isEnrollEligible(rules: VisibilityRules | undefined) {
  return (
    rules?.commercial &&
    activeAndHealthPlanMember(rules) &&
    rules?.subscriber &&
    rules?.enRollEligible
  );
}

export function isManageMyPolicyEligible(rules: VisibilityRules | undefined) {
  return (
    rules?.enableBenefitChange &&
    rules?.subscriber &&
    !rules?.wellnessOnly &&
    !rules?.futureEffective
  );
}

export function isNewMentalHealthSupportAbleToEligible(
  rules: VisibilityRules | undefined,
) {
  return (
    (rules?.mentalHealthSupport || rules?.fullyInsured) &&
    rules?.medical &&
    isActiveAndNotFSAOnly(rules)
  );
}

export function isNewMentalHealthSupportMyStrengthCompleteEligible(
  rules: VisibilityRules | undefined,
) {
  return rules?.myStrengthCompleteEligible && activeAndHealthPlanMember(rules);
}

export function isTeladocPrimary360Eligible(
  rules: VisibilityRules | undefined,
) {
  return rules?.primary360Eligible && activeAndHealthPlanMember(rules);
}

export function isHingeHealthEligible(rules: VisibilityRules | undefined) {
  return (
    rules?.hingeHealthEligible ||
    (rules?.groupRenewalDateBeforeTodaysDate &&
      (rules?.fullyInsured || rules?.levelFunded))
  );
}

function nurseChatEnabler(rules: VisibilityRules | undefined) {
  if (
    isActiveAndNotFSAOnly(rules) &&
    (rules?.healthCoachElig || rules?.indivEHBUser || rules?.groupEHBUser)
  )
    return 'enabled';
  else return 'disabled';
}

export function isNurseChatEligible(rules: VisibilityRules | undefined) {
  if (nurseChatEnabler(rules) === 'enabled') return true;
  else return false;
}
