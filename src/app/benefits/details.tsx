'use client';
import { GetHelpSection } from '@/components/composite/GetHelpSection';
import { InfoCard } from '@/components/composite/InfoCard';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import estimateCost from '@/public/assets/estimate_cost.svg';
import pharmacyCost from '@/public/assets/estimate_pharmacy_cost.svg';
import servicesUsed from '@/public/assets/services_used.svg';
import { isSpendingAccountsEligible } from '@/visibilityEngine/computeVisibilityRules';
import { CVS_DEEPLINK_MAP, CVS_DRUG_SEARCH_INIT } from '../sso/ssoConstants';
import { BalanceSectionWrapper } from './balances/components/BalanceSection';
import {
  SpendingAccountSection,
  SpendingAccountSectionProps,
} from './balances/components/SpendingAccountsSection';
import { BalanceData } from './balances/models/app/balancesData';
import { BenefitDetailSection } from './components/BenefitDetailSection';
import { BenefitTypeHeaderSection } from './components/BenefitTypeHeaderSection';
import { BenefitTypeDetail } from './models/benefit_details';
import { BenefitLevelDetails } from './models/benefit_type_header_details';
import { BenefitType } from './models/benefitConsts';
import { useBenefitsStore } from './stores/benefitsStore';

export interface BenefitDetailsParams {
  productType: string;
  serviceClass: string;
}

export const Details = ({
  /* We will update this to populate the details from the URL params post-release */
  params, //eslint-disable-line
  balanceData,
  spendingAccountInfo,
  contact,
}: {
  params: BenefitDetailsParams;
  balanceData: BalanceData | undefined;
  spendingAccountInfo: SpendingAccountSectionProps;
  contact: string;
}) => {
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
          const formatDollarAmount = (amount: number) =>
            amount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });

          const copayInsurance = [
            detail.deductible > 0
              ? `${formatDollarAmount(detail.deductible)} deductible`
              : null,
            detail.memberPays > 0 ? `${detail.memberPays}% coinsurance` : null,
            detail.copay > 0
              ? `${formatDollarAmount(detail.copay)} copay`
              : null,
          ]
            .filter(Boolean)
            .join(', ');
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
      <Column className="app-content app-base-font-color">
        {benefitTypeDetails?.benefitTypeHeaderDetails && (
          <>
            <section className="flex flex-row items-start app-body">
              <Column className="flex-grow page-section-63_33 items-stretch">
                <Column className="app-content app-base-font-color">
                  <BenefitTypeHeaderSection
                    benefitTypeHeaderDetails={
                      benefitTypeDetails?.benefitTypeHeaderDetails
                    }
                  />
                  <Spacer size={16} />
                </Column>
              </Column>
            </section>
          </>
        )}
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <BenefitDetailSection
              benefitDetail={benefitTypeDetails?.benefitDetails ?? []}
            />
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch md:ml-4">
            <>
              {selectedBenefitDetails.benefitType ===
                BenefitType.MEDICAL.toString() && (
                <>
                  <InfoCard
                    label="Estimate Costs"
                    body="Plan your upcoming care costs before you make an appointment."
                    icon={estimateCost}
                    link="/member/findcare"
                  />
                  <InfoCard
                    label="Services Used"
                    body="View a list of common services, the maximum amount covered by your plan and how many you've used."
                    icon={servicesUsed}
                    link="/member/myplan/servicesused"
                  />
                </>
              )}
              {selectedBenefitDetails.benefitType ===
                BenefitType.RX.toString() && (
                <>
                  <InfoCard
                    label="Find Drug Costs and Coverage"
                    body="Your pharmacy benefits are managed by CVS Caremark. You can estimate drug costs and view your coverage at caremark.com."
                    icon={pharmacyCost}
                    link={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_DRUG_SEARCH_INIT)!)}`}
                  />
                </>
              )}
              {/* Add Medical Balances Card */}
              {[
                BenefitType.MEDICAL.toString(),
                BenefitType.RX.toString(),
              ].includes(selectedBenefitDetails.benefitType) && (
                <BalanceSectionWrapper
                  key="Medical"
                  title="Medical & Pharmacy Balance"
                  product={balanceData?.medical}
                  phone={contact}
                  showMinView={true}
                  balanceDetailLink={true}
                />
              )}
              {selectedBenefitDetails.benefitType ===
                BenefitType.DENTAL.toString() && (
                <BalanceSectionWrapper
                  key="Dental"
                  title="Dental Balance"
                  product={balanceData?.dental}
                  phone={contact}
                  showMinView={true}
                  balanceDetailLink={true}
                />
              )}

              {isSpendingAccountsEligible(balanceData?.visibilityRules) &&
                spendingAccountInfo && (
                  <SpendingAccountSection
                    fsaBalance={spendingAccountInfo.fsaBalance}
                    hsaBalance={spendingAccountInfo.hsaBalance}
                    linkURL={spendingAccountInfo.linkURL}
                    className={spendingAccountInfo.className}
                  />
                )}
              <GetHelpSection
                contact={contact}
                link="/support/faqTopics/benefits"
                linkURL="Benefits & Coverage FAQ"
                headerText="Get Help with Benefits"
              />
            </>
          </Column>
        </section>
      </Column>
    </main>
  );
};
