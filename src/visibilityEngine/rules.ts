export const MEMBER_ATTRIBUTES_LIST = [
  'active',
  'termed',
  'futureEffective',
  'selfFunded',
  'fullyInsured',
  'levelFunded',
  'delinquent',
  'subscriber',
  'commercial',
  'individual',
  'medical',
  'dental',
  'vision',
  'wellness',
  'wellnessOnly',
  'spendingAccounts',
  'externalSpendingAcct',
  'teladoc',
  'primary360',
  'myStrengthComplete',
  'pharmacy',
  'amplifyHealth',
  'premiumHealth',
  'employerProvidedBenefits',
  'fsaOnly',
  'terminated',
  'katieBeckNoBenefitsElig',
  'blueCare',
  'myPCPElig',
  'identityProtectionServices',
  'otcEnable',
  'bluePerksEligible',
] as const;

export type VisibilityRule = (typeof MEMBER_ATTRIBUTES_LIST)[number];
export type VisibilityRules = {
  [key in VisibilityRule]?: boolean;
};
