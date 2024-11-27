import { Member } from '@/models/member/api/loggedInUserInfo';

import { VisibilityRules } from './rules';

let fsaFlag: boolean, wellnessFlag: boolean;
export function computeCoverageTypes(
  member: Member,
  rules: VisibilityRules,
): void {
  member.coverageTypes.forEach((coverage) => {
    if (coverage.productType == 'M') {
      rules.medical = true;
    }
    if (coverage.productType == 'D') {
      rules.dental = true;
    }
    if (coverage.productType == 'V') {
      rules.vision = true;
    }
    if (coverage.productType == 'F') {
      fsaFlag = true;
    }
    if (coverage.productType == 'S') {
      wellnessFlag = true;
    }
  });
  if (!rules.medical && !rules.dental && !rules.vision) {
    if (wellnessFlag) {
      rules.wellnessOnly = true;
    } else if (fsaFlag) {
      rules.fsaOnly = true;
    }
  }
}
