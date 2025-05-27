'use client';

import { BalanceSectionWrapper } from '@/app/benefits/balances/components/BalanceSection';
import { BenefitsAndCoverageSection } from '@/app/dashboard/components/BenefitsAndCoverageSection';
import { EmployeeProvidedBenefitsTile } from '@/app/dashboard/components/EmployeeProvidedBenefitsTile';
import { PayPremiumSection } from '@/app/dashboard/components/PayPremium';
import { PillBox } from '@/app/dashboard/components/PillBox';
import { PriorAuthSection } from '@/app/dashboard/components/PriorAuthSection';
import { PrimaryCareProvider } from '@/app/findcare/primaryCareOptions/components/PrimaryCareProvider';
import { InfoCard } from '@/components/composite/InfoCard';
import { RecentClaimSection } from '@/components/composite/RecentClaimSection';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import {
  isAHAdvisorpage,
  isAnnualStatementEligible,
  isBlueCareEligible,
  isEmboldHealthEligible,
  isPayMyPremiumEligible,
  isPrimaryCarePhysicianEligible,
  isQuantumHealthEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import EstimateCost from '../../../../public/assets/estimate_cost.svg';
import FindCare from '../../../../public/assets/find_care_search.svg';
import { getBenefitsAndCoverageOptions } from '../actions/getBenefitsCoverageOptions';
import { getFindCarePillOptions } from '../actions/getFindCarePillOptions';
import { getProcedurePillOptions } from '../actions/getProcedurePillOptions';
import { AmplifyHealthAdvisorBanner } from '../components/AmplifyHealthAdvisorBanner';
import { AmplifyHealthCard } from '../components/AmplifyHealthCard';
import { BenefitDetails } from '../models/benefits_detail';
import { DashboardData } from '../models/dashboardData';
import { AnnualSpendingCompact } from './AnnualSpendingCompact';
import { FindMedicalProvidersComponent } from './FindMedicalProvidersComponent';

export type DashboardProps = {
  data: DashboardData;
};

const MemberDashboard = ({ data }: DashboardProps) => {
  const router = useRouter();
  const { visibilityRules, primaryCareProvider, memberClaims, balanceData } =
    data;

  const benefitsCoverageOptions: BenefitDetails[] =
    getBenefitsAndCoverageOptions(visibilityRules!);

  const findCarePillOptions = getFindCarePillOptions(visibilityRules!, router);
  const procedurePillOptions = getProcedurePillOptions(
    visibilityRules!,
    router,
  );
  return (
    <div className="flex flex-col w-full justify-center items-center page">
      <Column className="app-content app-base-font-color">
        {!isBlueCareEligible(visibilityRules) &&
          !isQuantumHealthEligible(visibilityRules) &&
          isAHAdvisorpage(visibilityRules) && (
            <>
              <section className="sm:flex sm:flex-row items-start">
                <AmplifyHealthAdvisorBanner />
              </section>
              <Spacer size={32}></Spacer>
            </>
          )}

        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <RecentClaimSection
              className="large-section"
              title="Recent Claims"
              linkText="View Claims"
              linkUrl="/claims"
              claimDetails={memberClaims}
            />
            {isPrimaryCarePhysicianEligible(visibilityRules) &&
              !isQuantumHealthEligible(visibilityRules) && (
                <PrimaryCareProvider
                  className="large-section"
                  providerDetails={primaryCareProvider ?? null}
                  label="Primary Care Provider"
                  linkLabel="View or Update Primary Care Provider"
                  title="My Primary Care Provider"
                />
              )}
            {!isBlueCareEligible(visibilityRules) &&
              !isQuantumHealthEligible(visibilityRules) && (
                <BalanceSectionWrapper
                  key="Medical"
                  title="Medical & Pharmacy Balance"
                  product={balanceData?.medical}
                  phone={'phone'}
                  showMinView={true}
                  balanceDetailLink={true}
                />
              )}
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            {!isQuantumHealthEligible(visibilityRules) &&
              isPayMyPremiumEligible(visibilityRules) && (
                <PayPremiumSection
                  className="large-section"
                  dueDate={data.payPremiumResponse?.paymentDue ?? ''}
                  amountDue={data.payPremiumResponse?.paymentDue ?? ''}
                  visibilityRules={visibilityRules}
                />
              )}
            {isAnnualStatementEligible(visibilityRules) && (
              <AnnualSpendingCompact
                className="large-section"
                title="Spending Summary"
                linkLabel="Download Summary"
                subTitle={'October 12, 2023'}
                amountPaid={1199.19}
                totalBilledAmount={9804.31}
                amountSaved={8605.12}
                amountSavedPercentage={89}
                color1={'#005EB9'}
                color2={'#5DC1FD'}
              />
            )}
            <PriorAuthSection
              className="large-section"
              priorAuth={data.priorAuthDetail ?? null}
            />
          </Column>
        </section>
        <Spacer size={32} />
        <Header
          text="Find Care & Costs"
          type="title-2"
          className="!font-light !text-[32px]/[40px]"
        />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            {benefitsCoverageOptions && (
              <BenefitsAndCoverageSection
                className="large-section"
                benefits={benefitsCoverageOptions}
              />
            )}
          </Column>
          <Column className="page-section-36_67 items-stretch">
            {!isBlueCareEligible(visibilityRules) &&
              isEmboldHealthEligible(visibilityRules) && (
                <FindMedicalProvidersComponent />
              )}
            {!isEmboldHealthEligible(visibilityRules) &&
              findCarePillOptions && (
                <PillBox
                  title="Looking for Care?"
                  subTitle="Find a:"
                  icon={
                    <Image
                      src={FindCare}
                      className="w-[50px] h-[50px] pr-2"
                      alt=""
                    />
                  }
                  pillObjects={findCarePillOptions}
                ></PillBox>
              )}

            {isBlueCareEligible(visibilityRules) && (
              <InfoCard
                label="Estimate Costs"
                body="Plan your upcoming care costs before you make an appointment."
                icon={EstimateCost}
                link={process.env.NEXT_PUBLIC_ESTIMATE_COSTS_SAPPHIRE ?? ''}
              ></InfoCard>
            )}
            {!isBlueCareEligible(visibilityRules) && procedurePillOptions && (
              <PillBox
                title="Planning for a procedure? You can estimate costs for:"
                icon={
                  <Image
                    src={EstimateCost}
                    className="w-[50px] h-[50px] pr-2"
                    alt=""
                  />
                }
                pillObjects={procedurePillOptions}
              ></PillBox>
            )}
          </Column>
        </section>
        <section>
          {!isBlueCareEligible(visibilityRules) &&
            !isQuantumHealthEligible(visibilityRules) &&
            isAHAdvisorpage(visibilityRules) && <AmplifyHealthCard />}
        </section>
        <section>
          {data.employerProvidedBenefits != undefined &&
            data.employerProvidedBenefits?.length != 0 &&
            !isQuantumHealthEligible(visibilityRules) && (
              <EmployeeProvidedBenefitsTile
                className="large-section"
                employer={data.memberDetails?.planName ?? ''}
                groupId={data.memberDetails?.groupId ?? ''}
                benefits={data.employerProvidedBenefits}
              />
            )}
        </section>
        <Spacer size={32}></Spacer>
      </Column>
    </div>
  );
};

export default MemberDashboard;
