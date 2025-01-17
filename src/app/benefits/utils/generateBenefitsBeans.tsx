import { ManageBenefitsItems } from '../components/MedicalPharmacyDentalCard';
import { BenefitType } from '../models/benefitConsts';

export function generateBenefitsItems(
  benefitsBean: BenefitDetailsBean,
  onBenefitSelected: (
    networkTiers: NetWorksAndTierInfo[] | undefined,
    serviceCategory: { serviceDetails: ServiceDetails[] }[],
    category: { category: string; id: number },
    benefitType: string,
  ) => void,
  filterAndGroupByCategoryId: (
    data: CoveredService[] | undefined,
    categoryId: number,
  ) => { serviceDetails: ServiceDetails[] }[],
  benefitEnum: BenefitType,
) {
  const medBenefits: ManageBenefitsItems[] = [];
  benefitsBean.serviceCategories.forEach((item) => {
    medBenefits.push({
      title: item.category,
      body: '',
      externalLink: false,
      onClick: () =>
        onBenefitSelected(
          benefitsBean.networkTiers,
          filterAndGroupByCategoryId(benefitsBean.coveredServices, item.id),
          { category: item.category, id: item.id },
          benefitEnum,
        ),
    });
  });
  return medBenefits;
}
