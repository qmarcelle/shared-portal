import {
  isLifePointGrp,
  isQuantumHealthEligible,
  isVisionEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { BenefitDetails } from '../models/benefits_detail';

export const getBenefitsAndCoverageOptions = (
  visibilityRules: VisibilityRules,
): BenefitDetails[] => {
  const benefitsCoverageOptions: BenefitDetails[] = [];

  // Step 1: Add benefits based on base visibility rules
  if (visibilityRules['medical']) {
    benefitsCoverageOptions.push({
      benefitName: 'Medical Benefits',
      benefitURL: '/member/myplan/benefits',
    });
    benefitsCoverageOptions.push({
      benefitName: 'Pharmacy Benefits',
      benefitURL: '/member/myplan/benefits',
    });
  }

  if (visibilityRules['dental']) {
    benefitsCoverageOptions.push({
      benefitName: 'Dental Benefits',
      benefitURL: '/member/myplan/benefits',
    });
  }

  if (isVisionEligible(visibilityRules)) {
    benefitsCoverageOptions.push({
      benefitName: 'Vision Benefits',
      benefitURL: '/member/myplan/benefits',
    });
  }

  benefitsCoverageOptions.push({
    benefitName: 'Other Benefits',
    benefitURL: '/member/myplan/benefits',
  });

  // Step 2: Apply filtering logic for specific conditions
  if (
    isQuantumHealthEligible(visibilityRules) &&
    isLifePointGrp(visibilityRules)
  ) {
    const allowedBenefits = ['Dental Benefits', 'Vision Benefits'];
    return benefitsCoverageOptions.filter((benefit) =>
      allowedBenefits.includes(benefit.benefitName),
    );
  }

  // Step 3: Return the full list if no filtering is applied
  return benefitsCoverageOptions;
};
