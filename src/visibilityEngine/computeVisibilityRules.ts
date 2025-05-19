import { hingeHealthLinks } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/hinge_health_links';
import { ahAdvisorpageSetting } from '@/models/app/visibility_rules_constants';
import { LoggedInUserInfo, Member } from '@/models/member/api/loggedInUserInfo';
import { Session } from 'next-auth';
import { computeAuthFunctions } from './computeAuthFunctions';
import { computeCoverageTypes } from './computeCoverageType';
import { encodeVisibilityRules } from './converters';
import {
  condensedExperienceProfileHorizonGroups,
  katieBeckettGroups,
  lifePointGroup,
  ncqaGroups,
  offMarketGroups,
  payPremiumMedicareOnlyGroups,
  wellnessProfileWellnessOnlyGroups,
} from './groups';
import { VisibilityRules } from './rules';

const COMMERCIAL_LOB = ['REGL'];
const INDIVIDUAL_LOB = ['INDV'];
const MEDICAID_LOB = ['MEDA'];
const MEDICARE_LOB = ['MEDC'];

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
  const groupId = loggedUserInfo.groupData.groupID;
  //TODO: Update the rules computation logic with the current implementation
  const rules: VisibilityRules = {};
  rules.active = loggedUserInfo.isActive;
  rules.subscriber = loggedUserInfo.subscriberLoggedIn;
  rules.externalSpendingAcct = loggedUserInfo.healthCareAccounts?.length > 0;
  rules.commercial = COMMERCIAL_LOB.includes(loggedUserInfo.lob);
  rules.individual = INDIVIDUAL_LOB.includes(loggedUserInfo.lob);
  rules.blueCare = MEDICAID_LOB.includes(loggedUserInfo.lob);
  rules.medicare = MEDICARE_LOB.includes(loggedUserInfo.lob);
  rules.dsnpGrpInd = loggedUserInfo.groupData.clientID === 'ES';
  rules.isSilverFitClient = loggedUserInfo.groupData.clientID === 'MX';
  rules.offMarketGrp = offMarketGroups.includes(groupId);
  rules.isLifePointGrp = lifePointGroup.includes(groupId);
  rules.isAmplifyHealthGroupEnabled = isAHAdvisorEnabled(groupId);

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

  rules.externalSpendingAcct =
    loggedUserInfo.healthCareAccounts &&
    loggedUserInfo.healthCareAccounts.length > 0;

  rules.isCondensedExperienceProfileHorizon =
    rules?.isCondensedExperience &&
    condensedExperienceProfileHorizonGroups.includes(groupId);

  rules.cityOfMemphisWellnessOnly =
    rules?.wellnessOnly && wellnessProfileWellnessOnlyGroups.includes(groupId);

  rules.isWellnessQa =
    rules?.wellnessOnly &&
    !rules.futureEffective &&
    !rules.terminated &&
    !rules.fsaOnly &&
    !wellnessProfileWellnessOnlyGroups.includes(groupId);

  rules.ncqaEligible = rules?.blueCare || ncqaGroups.includes(groupId);

  rules.katieBeckettEligible = katieBeckettGroups.includes(groupId);

  rules.payMyPremiumMedicareEligible =
    payPremiumMedicareOnlyGroups.includes(groupId);

  for (const member of loggedUserInfo.members) {
    if (member.memRelation == 'M') {
      rules.futureEffective = member.futureEffective;
      rules.terminated = !member.isActive;
      computeCoverageTypes(member, rules);
      computeMemberAge(member, rules);
      break;
    }
  }

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

export function isOtherInsuranceEligible(rules?: VisibilityRules) {
  return rules?.otherInsuranceEligible && activeAndHealthPlanMember(rules);
}

export function isActiveAndNotFSAOnly(
  rules: VisibilityRules | undefined,
): boolean {
  return (
    !rules?.futureEffective &&
    !rules?.fsaOnly &&
    !rules?.terminated &&
    !rules?.katieBeckNoBenefitsElig
  );
}

const isNonCondensedExperience = (rules: VisibilityRules) => {
  return !rules.katieBeckNoBenefitsElig && !rules.cityOfMemphisWellnessOnly;
};

export const isChipRewardsEligible = (rules: VisibilityRules | undefined) => {
  return (
    (isSelfCommercial(rules) || !isLobCommercial(rules) || rules?.individual) &&
    isActiveAndNotFSAOnly(rules) &&
    rules?.chipRewardsEligible &&
    rules?.blueHealthRewardsEligible
  );
};

export function activeAndHealthPlanMember(rules: VisibilityRules | undefined) {
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

export function isPrimaryCarePhysicianEligible(
  rules: VisibilityRules | undefined,
) {
  return (
    activeAndHealthPlanMember(rules) &&
    rules?.myPCPElig &&
    (rules?.blueCare || rules?.individual)
  );
}

export function isBlue365FitnessYourWayEligible(
  rules: VisibilityRules | undefined,
) {
  return (rules?.individual || rules?.commercial) && rules?.bluePerksElig;
}

export function isQuantumHealthEligible(rules: VisibilityRules | undefined) {
  return rules?.isCondensedExperience;
}

export function isAHAdvisorpage(rules: VisibilityRules | undefined) {
  return (
    (rules?.active && rules?.amplifyMember) ||
    rules?.isAmplifyHealthGroupEnabled
  );
}

function isAHAdvisorEnabled(groupId: string | undefined) {
  const currentDate = new Date();
  const ahAdvisorValue = ahAdvisorpageSetting;
  const ahAdvisor = ahAdvisorValue.split(',');
  if (!ahAdvisor || ahAdvisor.length === 0) {
    return false;
  }
  for (let i = 0; i < ahAdvisor.length; i++) {
    const groupWithDate = ahAdvisor[i].split('|');
    if (!groupWithDate || groupWithDate.length !== 2) {
      continue;
    }
    if (groupId === groupWithDate[0]) {
      let configuredDate;
      try {
        configuredDate = new Date(groupWithDate[1]);
        return currentDate <= configuredDate;
      } catch (e) {
        console.error('Error while parsing Date ' + e);
      }
    }
  }
  return false;
}

export function isTeladocPrimary360Eligible(
  rules: VisibilityRules | undefined,
) {
  return rules?.primary360Eligible && activeAndHealthPlanMember(rules);
}

export function isPrimaryCareMenuOption(rules: VisibilityRules | undefined) {
  return isBlueCareEligible(rules) || isTeladocPrimary360Eligible(rules);
}
export function isMentalHealthMenuOption(rules: VisibilityRules | undefined) {
  return (
    isBlueCareEligible(rules) ||
    isNewMentalHealthSupportMyStrengthCompleteEligible(rules) ||
    isNewMentalHealthSupportAbleToEligible(rules)
  );
}

export function isBlueCareNotEligible(rules: VisibilityRules | undefined) {
  return !isBlueCareEligible(rules);
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

export function isBalancesPageVisible(rules: VisibilityRules): boolean {
  return (
    ((rules.individual ||
      rules.commercial ||
      rules.allMedicareAdvantageEligible) &&
      hasCondensesedExperienceProfiler(rules) != 'Quantum' &&
      activeAndHealthPlanMember(rules)) ||
    false
  );
}

export function isClaimsPageVisible(rules: VisibilityRules): boolean {
  return !rules.katieBeckNoBenefitsElig && !rules.cityOfMemphisWellnessOnly;
}

function hasCondensesedExperienceProfiler(rules: VisibilityRules | undefined) {
  if (rules?.isCondensedExperienceProfileHorizon) return 'FirstHorizon';
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

export function isFindADentist(rules: VisibilityRules | undefined) {
  return rules?.dental;
}

export function isDentalCostEstimator(rules: VisibilityRules | undefined) {
  return rules?.enableCostTools && rules?.dentalCostsEligible && rules?.dental;
}

export function isFindCareEligible(rules: VisibilityRules) {
  return (
    !rules.fsaOnly &&
    !rules.terminated &&
    (!rules.wellnessOnly || nurseChatEnabler(rules) == 'enabled') &&
    isNonCondensedExperience(rules)
  );
}

export function isPriceDentalCareMenuOptions(
  rules: VisibilityRules | undefined,
) {
  return (
    isBlueCareNotEligible(rules) ||
    (isDentalCostEstimator(rules) && isFindADentist(rules))
  );
}
export function isPayMyPremiumEligible(rules: VisibilityRules | undefined) {
  return (
    rules?.subscriber &&
    !rules?.wellnessOnly &&
    rules?.payMyPremiumElig &&
    !rules?.blueCare
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
  return (
    rules?.teladocEligible &&
    rules?.myStrengthCompleteEligible &&
    activeAndHealthPlanMember(rules)
  );
}

export function isHingeHealthEligible(rules: VisibilityRules | undefined) {
  return (
    ((rules?.hingeHealthEligible ||
      (rules?.groupRenewalDateBeforeTodaysDate &&
        (rules?.fullyInsured || rules?.levelFunded))) &&
      isCityOfMemphisWellnessOnlyProfiler(rules) != 'IsWellnessOnly') ||
    rules?.isHighDeductiblePlanMember
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
  if (
    nurseChatEnabler(rules) === 'enabled' &&
    isCityOfMemphisWellnessOnlyProfiler(rules) != 'IsWellnessOnly'
  )
    return true;
  else return false;
}

export function getHingeHealthLink(session: Session | null) {
  const groupId = session?.user.currUsr?.plan!.grpId;
  const hingehealthvRules = session?.user.vRules;
  let hingeHealthLink;
  if (groupId) {
    hingeHealthLink = hingeHealthLinks.get(groupId);
  }

  if (hingeHealthLink == null) {
    if (
      hingehealthvRules?.groupRenewalDateBeforeTodaysDate &&
      (hingehealthvRules?.fullyInsured ||
        hingehealthvRules?.selfFunded ||
        hingehealthvRules?.levelFunded)
    )
      return process.env.NEXT_PUBLIC_HINGE_HEALTH ?? '';
    else return process.env.NEXT_PUBLIC_HINGE_HEALTH_DEFAULT ?? '';
  }
  return hingeHealthLink;
}
export function isVisionEligible(rules: VisibilityRules | undefined) {
  return rules?.vision && activeAndHealthPlanMember(rules);
}
export function isPriceVisionCareMenuOptions(
  rules: VisibilityRules | undefined,
) {
  return isBlueCareNotEligible(rules) || isVisionEligible(rules);
}
export function isDiabetesPreventionEligible(
  rules: VisibilityRules | undefined,
) {
  return (
    rules?.teladocEligible &&
    rules?.diabetesPreventionEligible &&
    activeAndHealthPlanMember(rules)
  );
}
export function isDiabetesManagementEligible(
  rules: VisibilityRules | undefined,
) {
  return (
    rules?.teladocEligible &&
    rules?.diabetesManagementEligible &&
    activeAndHealthPlanMember(rules)
  );
}
export function isCareManagementEligiblity(rules: VisibilityRules | undefined) {
  return (
    isLobCommercial(rules) &&
    rules?.cmEnable &&
    !(hasCondensesedExperienceProfiler(rules) == 'Quantum')
  );
}

export function isBiometricScreening(rules: VisibilityRules | undefined) {
  return rules?.ohdEligible;
}

export function isPharmacyBenefitsEligible(rules: VisibilityRules | undefined) {
  return (
    rules?.showPharmacyTab &&
    !rules?.terminated &&
    !rules?.wellnessOnly &&
    !rules?.fsaOnly
  );
}

export function isSpendingAccountsMenuOptions(
  rules: VisibilityRules | undefined,
) {
  return isBlueCareNotEligible(rules) || isSpendingAccountsEligible(rules);
}

export function isSpendingAccountsEligible(rules: VisibilityRules | undefined) {
  if (rules?.subscriber) {
    if (rules?.fsaOnly || rules?.externalSpendingAcct) {
      if (rules?.fsaHraEligible && rules?.commercial) {
        if (
          rules?.flexibleSpendingAccount ||
          rules?.healthReimbursementAccount
        ) {
          return true;
        } else return false;
      } else return false;
    } else return false;
  } else return false;
}
export function isAnnualStatementEligible(rules: VisibilityRules | undefined) {
  return (
    rules?.subscriber &&
    rules?.phsEligible &&
    (rules?.individual ||
      rules?.commercial ||
      rules?.allMedicareAdvantageEligible) &&
    !rules?.wellnessOnly
  );
}

export function isMedicareDsnpEligible(rules: VisibilityRules | undefined) {
  return rules?.medicare;
}

export function isMedicareEligible(rules: VisibilityRules | undefined) {
  return isActiveAndNotFSAOnly(rules) && rules?.medicare && !rules.dsnpGrpInd;
}

export function isFreedomMaBlueAdvantage(rules: VisibilityRules | undefined) {
  return rules?.active && rules.otcEnable && !rules.showPharmacyTab;
}

export function isBloodPressureManagementEligible(rules: VisibilityRules) {
  return (
    rules.teladocEligible &&
    rules.hypertensionMgmt &&
    activeAndHealthPlanMember(rules)
  );
}

export function isTeladocSecondOpinionAdviceAndSupportEligible(
  rules: VisibilityRules | undefined,
) {
  return (
    rules?.teladocEligible &&
    isActiveAndNotFSAOnly(rules) &&
    rules?.consumerMedicalEligible
  );
}

export function isIndividualMaBlueAdvantageEligible(
  rules: VisibilityRules | undefined,
) {
  return rules?.active && rules.otcEnable && rules.showPharmacyTab;
}

function computeMemberAge(member: Member, rules: VisibilityRules) {
  console.log('Birth Date', member.birthDate);
  const birthDate = new Date(member.birthDate);
  const today = new Date();
  //Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  //Adjust age if birthday hasn't occured this year yet
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
  rules.matureMinor = age >= 13 && age <= 17;
}

export function isMatureMinor(rules: VisibilityRules | undefined) {
  return rules?.active && rules?.matureMinor;
}

export function isSilverAndFitnessEligible(rules: VisibilityRules | undefined) {
  return (
    (rules?.medicare || (rules?.individual && rules.isSilverFitClient)) &&
    activeAndHealthPlanMember(rules)
  );
}
export function isHealthProgamAndResourceEligible(
  rules: VisibilityRules | undefined,
) {
  return isLobCommercial(rules) || rules?.medicare;
}
export function isMedicarePrescriptionPaymentPlanEligible(
  rules: VisibilityRules | undefined,
) {
  return (
    rules?.medicarePrescriptionPaymentPlanEligible &&
    rules?.showPharmacyTab &&
    !rules?.terminated &&
    !rules?.wellnessOnly &&
    !rules?.fsaOnly
  );
}

export const isWellnessQa = (rules: VisibilityRules | undefined) =>
  rules?.isWellnessQa;

export const isNotWellnessQa = (rules: VisibilityRules | undefined) =>
  !isWellnessQa(rules);

export const isTeladocEligible = (rules: VisibilityRules | undefined) =>
  rules?.teladocEligible && activeAndHealthPlanMember(rules);

export const isQuestSelectEligible = (rules: VisibilityRules | undefined) =>
  rules?.questSelectEligible && rules?.active;

export function isEmboldHealthEligible(rules: VisibilityRules | undefined) {
  return isActiveAndNotFSAOnly(rules) && rules?.isEmboldHealth;
}

function isCityOfMemphisWellnessOnlyProfiler(
  rules: VisibilityRules | undefined,
) {
  if (rules?.cityOfMemphisWellnessOnly) return 'IsWellnessOnly';
}

export function isMemberWellnessCenterEligible(
  rules: VisibilityRules | undefined,
) {
  return isActiveAndNotFSAOnly(rules) && rules?.phaMemberEligible;
}

export function isMskEligible(rules: VisibilityRules | undefined) {
  return rules?.isMskEligible;
}

export const isHealthyMaternity = (rules: VisibilityRules | undefined) =>
  (rules?.fullyInsuredHealthyMaternity || rules?.enableHealthyMaternity) &&
  (rules?.wellnessOnly || rules?.medical) &&
  isCityOfMemphisWellnessOnlyProfiler(rules) != 'IsWellnessOnly';

export function isNCQAEligible(rules: VisibilityRules | undefined) {
  return rules?.ncqaEligible && rules?.active;
}

export function isTaxDocument1095BRequestEligible(
  rules: VisibilityRules | undefined,
) {
  return (
    rules?.prevYearMedical && rules?.prevYearFullyInsured && rules?.offMarketGrp
  );
}

export function isTaxDocument1095BRequestVisible(
  rules: VisibilityRules | undefined,
) {
  return rules?.prevYearMedical || rules?.prevYearFullyInsured;
}

export function isKatieBeckettEligible(rules: VisibilityRules | undefined) {
  return rules?.katieBeckettEligible;
}

export function payMyPremiumMedicareEligible(
  rules: VisibilityRules | undefined,
) {
  return rules?.payMyPremiumMedicareEligible && rules?.active;
}

export function isWellnessOnlyBenefitsQV(rules: VisibilityRules | undefined) {
  return rules?.isWellnessOnlyBenefitsQV;
}
export function isLifePointGrp(rules: VisibilityRules | undefined) {
  return rules?.isLifePointGrp || false;
}

export const isChipRewardsINTEligible = (
  rules: VisibilityRules | undefined,
) => {
  return (
    !isSelfCommercial(rules) &&
    isActiveAndNotFSAOnly(rules) &&
    isLobCommercial(rules) &&
    !rules?.individual
  );
};
