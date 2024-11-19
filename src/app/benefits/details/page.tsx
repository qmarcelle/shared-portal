'use client';
import { BenefitTypeDetails } from '../components/BenefitTypeDetails';
import { BenefitTypeDetail } from '../models/benefit_details';
import { BenefitLevelDetails } from '../models/benefit_type_header_details';
import { useBenefitsStore } from '../stores/benefitsStore';

const Details = () => {
  const { selectedBenefitsBean, selectedBenefitCategory } = useBenefitsStore();

  // Check if benefitsData is populated
  if (!selectedBenefitsBean || !selectedBenefitCategory) {
    return 'No benefits data available.';
  }

  const benefitTypeDetails: BenefitTypeDetail = { benefitDetails: [] };
  console.log(selectedBenefitsBean);
  const benefitLevelDetails: BenefitLevelDetails[] =
    selectedBenefitsBean.networkTiers.map((tier: NetWorksAndTierInfo) => {
      return {
        benefitLevel: tier.tierDesc,
        benefitValue: tier.tierExplanation,
      };
    });
  benefitTypeDetails.benefitTypeHeaderDetails = {
    title: selectedBenefitCategory.category,
    benefitLevelDetails: benefitLevelDetails,
  };
  console.log(benefitLevelDetails);
  const listCoveredServices: CoveredService[] | undefined =
    selectedBenefitsBean.coveredServices.filter((service: CoveredService) => {
      return service.categoryId === selectedBenefitCategory.id;
    });
  if (listCoveredServices) {
    benefitTypeDetails.benefitDetails = listCoveredServices.map((service) => ({
      listBenefitDetails: [
        {
          benefitTitle: service.description,
          copayOrCoinsurance: `$${service.copay} copay`,
        },
      ],
    }));
    console.log(benefitTypeDetails.benefitDetails);
  }
  console.log(`List of covered services: ${listCoveredServices}`);
  console.log(`BenefitTypeDetails: ${benefitTypeDetails}`);

  return (
    <main className="flex flex-col justify-center items-center page">
      <BenefitTypeDetails benefitTypeDetails={benefitTypeDetails} />
    </main>
  );
};

export default Details;
