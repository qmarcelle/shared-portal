export const MEMBER_ATTRIBUTES_LIST = [
  'employerBenefits',
  'wellnessScheme',
  'claimsAndBalances',
  'balances',
  'bluecare',
  'teladoc',
  'pharmacy',
  'amplifyHealth',
  'premiumHealth',
] as const;

export type VisibilityRule = (typeof MEMBER_ATTRIBUTES_LIST)[number];
export type VisibilityRules = {
  [key in VisibilityRule]?: boolean;
};
