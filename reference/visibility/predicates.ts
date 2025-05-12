// // File: src/lib/visibility/predicates.ts
// import { RuleEvaluator } from './types';

// // Core predicates - building blocks for more complex rules
// export const isActive: RuleEvaluator = (rules) => !!rules?.active;

// export const isHealthPlanMember: RuleEvaluator = (rules) => 
//   !!rules?.medical || !!rules?.dental || !!rules?.vision;

// export const isActiveHealthPlanMember: RuleEvaluator = (rules) =>
//   isActive(rules) && 
//   isHealthPlanMember(rules) && 
//   !rules?.futureEffective && 
//   !rules?.terminated && 
//   !rules?.fsaOnly && 
//   !rules?.wellnessOnly && 
//   !rules?.katieBeckNoBenefitsElig;

// export const isCommercial: RuleEvaluator = (rules) => !!rules?.commercial;

// export const isIndividual: RuleEvaluator = (rules) => !!rules?.individual;

// export const isMedicare: RuleEvaluator = (rules) => !!rules?.medicare;

// export const isBlueCare: RuleEvaluator = (rules) => !!rules?.blueCare;

// export const isSubscriber: RuleEvaluator = (rules) => !!rules?.subscriber;

// export const isFullyInsured: RuleEvaluator = (rules) => !!rules?.fullyInsured;

// export const isSelfFunded: RuleEvaluator = (rules) => !!rules?.selfFunded;

// export const isLevelFunded: RuleEvaluator = (rules) => !!rules?.levelFunded;

// // Business logic predicates
// export const isBlueCareEligible: RuleEvaluator = (rules) => 
//   isActiveHealthPlanMember(rules) && isBlueCare(rules);

// export const isPrimaryCarePhysicianEligible: RuleEvaluator = (rules) => 
//   isActiveHealthPlanMember(rules) && !!rules?.myPCPElig;

// export const isBlue365FitnessYourWayEligible: RuleEvaluator = (rules) => 
//   (isIndividual(rules) || isCommercial(rules)) && !!rules?.bluePerksElig;

// export const isQuantumHealthEligible: RuleEvaluator = (rules) => 
//   !!rules?.isCondensedExperience;

// export const isChipRewardsEligible: RuleEvaluator = (rules) => 
//   (isSelfFunded(rules) || !isCommercial(rules) || isIndividual(rules)) &&
//   !rules?.futureEffective &&
//   !rules?.fsaOnly &&
//   !rules?.terminated &&
//   !rules?.katieBeckNoBenefitsElig &&
//   !!rules?.chipRewardsEligible &&
//   !!rules?.blueHealthRewardsEligible;

// // ... Add other predicates similarly