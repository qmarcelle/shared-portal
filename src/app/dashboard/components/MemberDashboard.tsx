'use client';

import { BenefitsAndCoverageSection } from '@/app/dashboard/components/BenefitsAndCoverageSection';
import { EmployeeProvidedBenefitsTile } from '@/app/dashboard/components/EmployeeProvidedBenefitsTile';
import { MedicalBalanceSection } from '@/app/dashboard/components/MedicalBalanceSection';
import { PayPremiumSection } from '@/app/dashboard/components/PayPremium';
import { PillBox } from '@/app/dashboard/components/PillBox';
import { PriorAuthSection } from '@/app/dashboard/components/PriorAuthSection';
import { SpendingAccountSummary } from '@/app/dashboard/components/SpendingAccountSummary';
import { PrimaryCareProvider } from '@/app/findcare/primaryCareOptions/components/PrimaryCareProvider';
import { PrimaryCareProviderDetails } from '@/app/findcare/primaryCareOptions/model/api/primary_care_provider';
import { InfoCard } from '@/components/composite/InfoCard';
import { RecentClaimSection } from '@/components/composite/RecentClaimSection';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { bcbstBlueLogo } from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import {
  isAHAdvisorpage,
  isBlueCareEligible,
  isEmboldHealthEligible,
  isPayMyPremiumEligible,
  isPrimaryCarePhysicianEligible,
  isQuantumHealthEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import EstimateCost from '../../../../public/assets/estimate_cost.svg';
import FindCare from '../../../../public/assets/find_care_search.svg';
import { AmplifyHealthAdvisorBanner } from '../components/AmplifyHealthAdvisorBanner';
import { AmplifyHealthCard } from '../components/AmplifyHealthCard';
import { FindMedicalProvidersComponent } from './FindMedicalProvidersComponent';

export type DashboardProps = {
  visibilityRules?: VisibilityRules;
  primaryCareProviderData: PrimaryCareProviderDetails | null;
};

const MemberDashboard = ({
  visibilityRules,
  primaryCareProviderData,
}: DashboardProps) => {
  return (
    <div className="flex flex-col w-full justify-center items-center page">
      <Column className="app-content app-base-font-color">
        {!isBlueCareEligible(visibilityRules) &&
          !isQuantumHealthEligible(visibilityRules) &&
          isAHAdvisorpage(visibilityRules) && (
            <section className="sm:flex sm:flex-row items-start">
              <AmplifyHealthAdvisorBanner />
            </section>
          )}
        <Spacer size={32}></Spacer>
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <RecentClaimSection
              className="large-section"
              title="Recent Claims"
              linkText="View Claims"
              claims={[
                {
                  id: 'Claim98',
                  claimStatus: 'Processed',
                  claimType: 'Medical',
                  claimTotal: '67',
                  issuer: 'John Doe',
                  memberName: 'Chris James',
                  serviceDate: '02/06/2024',
                  isMiniCard: true,
                  claimInfo: {},
                  memberId: '04',
                  claimStatusCode: 2,
                },
                {
                  id: 'Claim76',
                  claimStatus: 'Pending',
                  claimType: 'Pharmacy',
                  claimTotal: '30.24',
                  issuer: 'John Doe',
                  memberName: 'Aly Jame',
                  serviceDate: '01/06/2024',
                  claimInfo: {},
                  isMiniCard: true,
                  memberId: '03',
                  claimStatusCode: 2,
                },
                {
                  id: 'Claim54',
                  claimStatus: 'Denied',
                  claimType: 'Dental',
                  claimTotal: '65.61',
                  issuer: 'John Doe',
                  memberName: 'Aly Jame',
                  serviceDate: '01/16/2024',
                  claimInfo: {},
                  isMiniCard: true,
                  memberId: '08',
                  claimStatusCode: 4,
                },
              ]}
            />
            {isBlueCareEligible(visibilityRules) &&
              isPrimaryCarePhysicianEligible(visibilityRules) &&
              !isQuantumHealthEligible(visibilityRules) && (
                <PrimaryCareProvider
                  className="large-section"
                  providerDetails={primaryCareProviderData}
                  label="Primary Care Provider"
                  linkLabel="View or Update Primary Care Provider"
                  title="My Primary Care Provider"
                />
              )}
            {!isBlueCareEligible(visibilityRules) &&
              !isQuantumHealthEligible(visibilityRules) && (
                <MedicalBalanceSection
                  className="large-section"
                  members={[
                    {
                      label: 'Chris Hall',
                      value: '0',
                    },
                    {
                      label: 'Megan Chaler',
                      value: '43',
                    },
                  ]}
                  balanceNetworks={[
                    {
                      label: 'In-Network',
                      value: '0',
                    },
                    { label: 'Out-of-Network', value: '1' },
                  ]}
                  deductibleLimit={2000}
                  deductibleSpent={1800}
                  onSelectedMemberChange={() => {}}
                  onSelectedNetworkChange={() => {}}
                  outOfPocketLimit={3000}
                  outOfPocketSpent={1500}
                  selectedMemberId="43"
                  selectedNetworkId="1"
                  displayDisclaimerText={false}
                />
              )}
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            {!isBlueCareEligible(visibilityRules) &&
              !isQuantumHealthEligible(visibilityRules) &&
              isPayMyPremiumEligible(visibilityRules) && (
                <PayPremiumSection
                  className="large-section"
                  dueDate="08/10/2023"
                  amountDue={1000.46}
                />
              )}

            {!isBlueCareEligible(visibilityRules) && (
              <SpendingAccountSummary
                className="large-section"
                title="Spending Summary"
                linkLabel="View Spending Summary"
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
              priorauth={[
                {
                  priorAuthStatus: 'Approved',
                  priorAuthName: 'Magnetic Resonance Images(MRI)',
                  member: 'Chris Hall',
                  dateOfVisit: '01/23/23',
                  priorAuthType: 'Medical',
                },
              ]}
            />
          </Column>
        </section>
        <Header
          text="Find Care & Costs"
          type="title-2"
          className="!font-light !text-[32px]/[40px]"
        />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            {!isQuantumHealthEligible(visibilityRules) && (
              <BenefitsAndCoverageSection
                className="large-section"
                benefits={[
                  {
                    benefitName: 'Medical Benefits',
                    benefitURL: '#',
                  },
                  {
                    benefitName: 'Pharmacy Benefits',
                    benefitURL: '#',
                  },
                  {
                    benefitName: 'Dental Benefits',
                    benefitURL: '#',
                  },
                  {
                    benefitName: 'Vision Benefits',
                    benefitURL: '#',
                  },
                  {
                    benefitName: 'Other Benefits',
                    benefitURL: '#',
                  },
                ]}
              />
            )}
          </Column>
          <Column className="page-section-36_67 items-stretch">
            {!isBlueCareEligible(visibilityRules) &&
              isEmboldHealthEligible(visibilityRules) && (
                <FindMedicalProvidersComponent />
              )}
            {!isEmboldHealthEligible(visibilityRules) && (
              <PillBox
                title="Looking for Care? Find A:"
                icon={
                  <Image src={FindCare} className="w-[50px] h-[50px]" alt="" />
                }
                pillObjects={[
                  {
                    label: 'Primary Care Provider',
                    callback: () => {
                      console.log('Clicked Pill PCP');
                    },
                  },
                  {
                    label: 'Dentist',
                    callback: () => {
                      console.log('Clicked Pill Dentist');
                    },
                  },
                  {
                    label: 'Mental Health Provider',
                    callback: () => {
                      console.log('Clicked Pill Mental Health Provider');
                    },
                  },
                  {
                    label: 'Eye Doctor',
                    callback: () => {
                      console.log('Clicked Pill Eye Doctor');
                    },
                  },
                  {
                    label: 'Pharmacy',
                    callback: () => {
                      console.log('Clicked Pill Pharmacy');
                    },
                  },
                  {
                    label: 'Virtual Care',
                    callback: () => {
                      console.log('Clicked Pill Virtual Care');
                    },
                  },
                ]}
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
            {!isBlueCareEligible(visibilityRules) && (
              <PillBox
                title="Planning for a procedure? You can estimate costs for:"
                icon={
                  <Image
                    src={EstimateCost}
                    className="w-[50px] h-[50px]"
                    alt=""
                  />
                }
                pillObjects={[
                  {
                    label: 'Medical',
                    callback: () => {
                      console.log('Clicked Pill Medical');
                    },
                  },
                  {
                    label: 'Dental',
                    callback: () => {
                      console.log('Clicked Pill Dental');
                    },
                  },
                  {
                    label: 'Prescription Drugs',
                    callback: () => {
                      console.log('Clicked Pill Prescription Drugs');
                    },
                  },
                  {
                    label: 'Vision',
                    callback: () => {
                      console.log('Clicked Pill Vision');
                    },
                  },
                ]}
              ></PillBox>
            )}
          </Column>
        </section>
        <section>
          {!isBlueCareEligible(visibilityRules) &&
            !isQuantumHealthEligible(visibilityRules) && <AmplifyHealthCard />}
        </section>
        <section>
          {visibilityRules?.employerProvidedBenefits &&
            !isQuantumHealthEligible(visibilityRules) && (
              <EmployeeProvidedBenefitsTile
                className="large-section"
                employer="Ben Cole Co"
                employerLogo={bcbstBlueLogo}
                benefits={[
                  {
                    id: '45',
                    providedBy: 'Davis Vision',
                    contact: '1-800-456-9876',
                    url: 'https://davis-vision.com',
                  },
                  {
                    id: '87',
                    providedBy: 'Nirmal Dental',
                    contact: '1-800-367-9676',
                    url: 'https://nirmaldental.com',
                  },
                  {
                    id: '25',
                    providedBy: 'Low Pharm',
                    contact: '1-800-834-2465',
                  },
                  {
                    id: '289',
                    providedBy: 'Quant Labs',
                    contact: '1-800-834-3465',
                  },
                ]}
              />
            )}
        </section>
        <Spacer size={32}></Spacer>
      </Column>
    </div>
  );
};

export default MemberDashboard;
