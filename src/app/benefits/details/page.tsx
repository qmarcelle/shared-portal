'use client';
import { BenefitTypeDetails } from '../components/BenefitTypeDetails';
import { BenefitTypeDetail } from '../models/benefit_details';
import { BenefitLevelDetails } from '../models/benefit_type_header_details';
import { useBenefitsStore } from '../stores/benefitsStore';

const Details = () => {
  const { selectedBenefitDetails } = useBenefitsStore();

  // Check if benefitsData is populated
  if (!selectedBenefitDetails) {
    return 'No benefits data available.';
  }

  const benefitTypeDetails: BenefitTypeDetail = { benefitDetails: [] };
  const benefitLevelDetails: BenefitLevelDetails[] =
    selectedBenefitDetails.networkTiers.map((tier: NetWorksAndTierInfo) => {
      return {
        benefitLevel: tier.tierDesc,
        benefitValue: tier.tierExplanation,
      };
    });
  benefitTypeDetails.benefitTypeHeaderDetails = {
    title: selectedBenefitDetails.serviceCategory.category,
    benefitLevelDetails: benefitLevelDetails,
  };
  console.log(benefitLevelDetails);
  const listCoveredServices = selectedBenefitDetails.coveredServices.map(
    (service) => {
      return {
        listBenefitDetails: service.serviceDetails.map((detail) => {
          const copayInsurance = detail.copay
            ? `$${detail.copay} copay`
            : detail.memberPays
              ? `${detail.memberPays}% coinsurance after you pay the deductible`
              : '';
          return {
            benefitTitle: detail.description,
            copayOrCoinsurance: copayInsurance,
          };
        }),
        note: service.serviceDetails[0].comment
          ? service.serviceDetails[0].comment
          : '',
      };
    },
  );

  benefitTypeDetails.benefitDetails = listCoveredServices;
  console.log(benefitTypeDetails.benefitDetails);
  console.log(`List of covered services: ${listCoveredServices}`);
  console.log(`BenefitTypeDetails: ${benefitTypeDetails}`);

  return (
    <main className="flex flex-col justify-center items-center page">
      <BenefitTypeDetails benefitTypeDetails={benefitTypeDetails} />
    </main>
  );
};

export default Details;
