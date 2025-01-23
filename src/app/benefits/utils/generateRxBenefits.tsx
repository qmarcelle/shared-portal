import { ManageBenefitsItems } from '../components/MedicalPharmacyDentalCard';
import { BenefitType } from '../models/benefitConsts';
import { filterAndGroupByCategoryId } from './filterAndGroupByCategoryId';

export function generateRxBenefits(
  medicalBenefits: BenefitDetailsBean,
  onBenefitSelected: (
    networkTiers: NetWorksAndTierInfo[] | undefined,
    serviceCategory: { serviceDetails: ServiceDetails[] }[],
    category: { category: string; id: number },
    benefitType: string,
  ) => void,
): ManageBenefitsItems[] {
  const rxBenefits: ManageBenefitsItems[] = [
    {
      title: 'Prescription Drugs',
      body: '',
      externalLink: false,
      onClick: () =>
        onBenefitSelected(
          medicalBenefits?.networkTiers,
          filterAndGroupByCategoryId(medicalBenefits?.coveredServices, 107),
          { category: 'Prescription Drugs', id: 107 },
          BenefitType.MEDICAL,
        ),
    },
  ];
  return rxBenefits;
}
