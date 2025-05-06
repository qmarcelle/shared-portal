'use client';

import { BenefitsAndCoverageSection } from '@/app/dashboard/components/BenefitsAndCoverageSection';
import { EmployeeProvidedBenefitsTile } from '@/app/dashboard/components/EmployeeProvidedBenefitsTile';
import { MedicalBalanceSection } from '@/app/dashboard/components/MedicalBalanceSection';
import { PayPremiumSection } from '@/app/dashboard/components/PayPremium';
import { PillBox } from '@/app/dashboard/components/PillBox';
import { PriorAuthSection } from '@/app/dashboard/components/PriorAuthSection';
import { SpendingAccountSummary } from '@/app/dashboard/components/SpendingAccountSummary';
import { PrimaryCareProvider } from '@/app/findcare/primaryCareOptions/components/PrimaryCareProvider';
import {
  CVS_DEEPLINK_MAP,
  CVS_PHARMACY_SEARCH_FAST,
  EYEMED_DEEPLINK_MAP,
  EYEMED_PROVIDER_DIRECTORY,
  PROV_DIR_DEEPLINK_MAP,
  PROV_DIR_DENTAL,
  PROV_DIR_MENTAL_HEALTH,
} from '@/app/sso/ssoConstants';
import { InfoCard } from '@/components/composite/InfoCard';
import { RecentClaimSection } from '@/components/composite/RecentClaimSection';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import {
  isAHAdvisorpage,
  isBlueCareEligible,
  isEmboldHealthEligible,
  isLifePointGrp,
  isPayMyPremiumEligible,
  isPharmacyBenefitsEligible,
  isPrimaryCarePhysicianEligible,
  isQuantumHealthEligible,
  isSpendingAccountsEligible,
  isVisionEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import EstimateCost from '../../../../public/assets/estimate_cost.svg';
import FindCare from '../../../../public/assets/find_care_search.svg';
import { AmplifyHealthAdvisorBanner } from '../components/AmplifyHealthAdvisorBanner';
import { AmplifyHealthCard } from '../components/AmplifyHealthCard';
import { DashboardData } from '../models/dashboardData';
import { FindMedicalProvidersComponent } from './FindMedicalProvidersComponent';

export type DashboardProps = {
  data: DashboardData;
};

const MemberDashboard = ({ data }: DashboardProps) => {
  const router = useRouter();
  const { memberDetails, visibilityRules, primaryCareProvider } = data;
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
            {!isQuantumHealthEligible(visibilityRules) &&
              isPayMyPremiumEligible(visibilityRules) && (
                <PayPremiumSection
                  className="large-section"
                  dueDate="08/10/2023"
                  amountDue={1000.46}
                  visibilityRules={visibilityRules}
                />
              )}

            {!isBlueCareEligible(visibilityRules) &&
              isSpendingAccountsEligible(visibilityRules) && (
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
            {isQuantumHealthEligible(visibilityRules) &&
              isLifePointGrp(visibilityRules) && (
                <BenefitsAndCoverageSection
                  className="large-section"
                  benefits={[
                    {
                      benefitName: 'Dental Benefits',
                      benefitURL: '/member/myplan/benefits',
                    },
                    {
                      benefitName: 'Vision Benefits',
                      benefitURL: '/member/myplan/benefits',
                    },
                  ]}
                />
              )}
            {!isQuantumHealthEligible(visibilityRules) && (
              <BenefitsAndCoverageSection
                className="large-section"
                benefits={[
                  {
                    benefitName: 'Medical Benefits',
                    benefitURL: '/member/myplan/benefits',
                  },
                  {
                    benefitName: 'Pharmacy Benefits',
                    benefitURL: '/member/myplan/benefits',
                  },
                  {
                    benefitName: 'Dental Benefits',
                    benefitURL: '/member/myplan/benefits',
                  },
                  {
                    benefitName: 'Vision Benefits',
                    benefitURL: '/member/myplan/benefits',
                  },
                  {
                    benefitName: 'Other Benefits',
                    benefitURL: '/member/myplan/benefits',
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
                      router.push(
                        `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&alternateText=Find a PCP&isPCPSearchRedirect=true&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_PCP_SSO_TARGET}`,
                      );
                    },
                  },
                  {
                    label: 'Dentist',
                    callback: () => {
                      router.push(
                        `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET!.replace('{DEEPLINK}', PROV_DIR_DEEPLINK_MAP.get(PROV_DIR_DENTAL)!)}`,
                      );
                    },
                  },
                  {
                    label: 'Mental Health Provider',
                    callback: () => {
                      router.push(
                        `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET!.replace('{DEEPLINK}', PROV_DIR_DEEPLINK_MAP.get(PROV_DIR_MENTAL_HEALTH)!)}`,
                      );
                    },
                  },
                  isVisionEligible(visibilityRules)
                    ? {
                        label: 'Eye Doctor',
                        callback: () => {
                          router.push(
                            `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_EYEMED}&TargetResource=${process.env.NEXT_PUBLIC_EYEMED_SSO_TARGET!.replace('{DEEPLINK}', EYEMED_DEEPLINK_MAP.get(EYEMED_PROVIDER_DIRECTORY)!)}`,
                          );
                        },
                      }
                    : {
                        label: 'Eye Doctor',
                        callback: () => {
                          router.push('');
                        },
                      },
                  isPharmacyBenefitsEligible(visibilityRules)
                    ? {
                        label: 'Pharmacy',
                        callback: () => {
                          router.push(
                            `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_PHARMACY_SEARCH_FAST)!)}`,
                          );
                        },
                      }
                    : {
                        label: 'Pharmacy',
                        callback: () => {
                          router.push(
                            `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_PHARMACY_SEARCH_FAST)!)}`,
                          );
                        },
                      },
                  {
                    label: 'Virtual Care',
                    callback: () => {
                      router.push('/virtualCareOptions');
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
