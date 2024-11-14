'use client';
import { useSearchParams } from 'next/navigation';
import { BenefitTypeDetails } from '../components/BenefitTypeDetails';
import { BenefitTypeDetail } from '../models/benefit_details';
import { BenefitLevelDetails } from '../models/benefit_type_header_details';
import { useBenefitsStore } from '../stores/benefitsStore';

const Details = () => {
  const searchParams = useSearchParams();
  const serviceType = searchParams.get('serviceType');
  const serviceCategory = searchParams.get('serviceCategory');
  const { currentUserBenefitData } = useBenefitsStore();

  if (!serviceType || !serviceCategory) {
    return 'Looks like something went wrong.';
  }

  // Check if benefitsData is populated
  if (!currentUserBenefitData) {
    return 'No benefits data available.';
  }

  const benefitTypeDetails: BenefitTypeDetail = { benefitDetails: [] };

  console.log(`Benefits Data: ${JSON.stringify(currentUserBenefitData)}`);
  const currentBenefitsData = currentUserBenefitData;

  const getBenefitDetails = (serviceType: string, serviceCategory: string) => {
    let benefits: ServiceCategory = {
      id: 0,
      category: '',
      comments: '',
      displaySortOrder: 0,
    };
    switch (serviceType) {
      case 'Medical':
        console.log('Checking medical benefits');
        console.log(currentBenefitsData.medicalBenefits);
        if (!currentBenefitsData.medicalBenefits) break;
        benefits =
          currentBenefitsData.medicalBenefits.serviceCategories.find(
            (item: ServiceCategory) => item.id === parseInt(serviceCategory),
          ) || benefits;
        const benefitLevelDetails: BenefitLevelDetails[] =
          currentBenefitsData.medicalBenefits.networkTiers.map(
            (tier: NetWorksAndTierInfo) => {
              return {
                benefitLevel: tier.tierDesc,
                benefitValue: tier.tierExplanation,
              };
            },
          );
        benefitTypeDetails.benefitTypeHeaderDetails = {
          title: benefits.category,
          benefitLevelDetails: benefitLevelDetails,
        };
        console.log(benefitLevelDetails);
        const listCoveredServices: CoveredService[] | undefined =
          benefits.services?.filter((service) => {
            return service.categoryId === benefits.id;
          });
        if (listCoveredServices === undefined) break;
        benefitTypeDetails.benefitDetails = listCoveredServices.map(
          (service) => ({
            listBenefitDetails: [
              {
                benefitTitle: service.description,
                copayOrCoinsurance: service.copay.toString(),
              },
            ],
          }),
        );
        console.log(benefitTypeDetails.benefitDetails);
        break;
      default:
        break;
    }
  };

  getBenefitDetails(serviceType, serviceCategory);
  console.log(benefitTypeDetails);

  return (
    <main className="flex flex-col justify-center items-center page">
      <BenefitTypeDetails benefitTypeDetails={benefitTypeDetails} />
    </main>
  );
};

export default Details;
