'use client';
import { InfoCard } from '@/components/composite/InfoCard';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import EstimateCost from '../../../public/assets/estimate_cost.svg';
import { SpendingAccountSection } from '../benefits/balances/components/SpendingAccountsSection';
import { MedicalBalanceSection } from '../dashboard/components/MedicalBalanceSection';
import { BenefitDetailSection } from './components/BenefitDetailSection';
const MedicalBenefitDetail = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Spacer size={32}></Spacer>
      <Column className="app-content app-base-font-color">
        <Header className="m-4 mb-0" text="Office Visits" />

        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <Column className="flex-grow m-4">
              <Row className="mb-2">
                <TextBox className="body-1" text="Benefit Level 1: "></TextBox>
                <TextBox
                  className="body-1"
                  text="[Services performed by ...]"
                ></TextBox>
              </Row>
              <Row className="mb-2">
                <TextBox className="body-1" text="Benefit Level 2: "></TextBox>
                <TextBox
                  className="body-1"
                  text="[Services performed by ...]"
                ></TextBox>
              </Row>
            </Column>
          </Column>
        </section>

        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <BenefitDetailSection
              className="large-section"
              benefitDetail={[
                {
                  listBenefitDetails: [
                    {
                      benefitTitle:
                        'Benefit Level 1 Office Visit, PCP In-Network:',
                      copayOrCoinsurancse: '$10 Copay',
                    },
                    {
                      benefitTitle:
                        'Benefit Level 2 Office Visit, PCP In-Network:',
                      copayOrCoinsurancse: '$30 Copay',
                    },
                    {
                      benefitTitle: 'Office Visit, PCP Out-of-Network:',
                      copayOrCoinsurancse:
                        '40$ Coinsurance after you pay deductible',
                    },
                  ],
                },
                {
                  listBenefitDetails: [
                    {
                      benefitTitle:
                        'Benefit Level 1 Office Visit, Specialist In-Network:',
                      copayOrCoinsurancse: '$45 Copay',
                    },
                    {
                      benefitTitle:
                        'Benefit Level 2 Office Visit, Specialist In-Network:',
                      copayOrCoinsurancse: '$45 Copay',
                    },
                    {
                      benefitTitle: 'Office Visit, Specialist Out-of-Network:',
                      copayOrCoinsurancse:
                        '40% Coinsurance after you pay deductible',
                    },
                  ],
                },
                {
                  listBenefitDetails: [
                    {
                      benefitTitle:
                        'Benefit Level 1 Office Surgery, PCP In-Network:',
                      copayOrCoinsurancse: '$10 Copay',
                    },
                    {
                      benefitTitle:
                        'Benefit Level 2 Office Surgery, PCP In-Network:',
                      copayOrCoinsurancse: '$45 Copay',
                    },
                    {
                      benefitTitle: 'Office Surgery, PCP Out-of-Network:',
                      copayOrCoinsurancse:
                        '40% Coinsurance after you pay deductible',
                    },
                  ],
                },
                {
                  listBenefitDetails: [
                    {
                      benefitTitle:
                        'Benefit Level 1 Office Surgery, Specialist In-Network:',
                      copayOrCoinsurancse: '$45 Copay',
                    },
                    {
                      benefitTitle:
                        'Benefit Level 2 Office Surgery, Specialist In-Network:',
                      copayOrCoinsurancse: '$45 Copay',
                    },
                    {
                      benefitTitle:
                        'Office Surgery, Specialist Out-of-Network:',
                      copayOrCoinsurancse:
                        '40% Coinsurance after you pay deductible',
                    },
                  ],
                },
                {
                  listBenefitDetails: [
                    {
                      benefitTitle:
                        'Benefit Level 1 Routine Diagnostic Services, Office In-Network:',
                      copayOrCoinsurancse: '$0 Copay',
                    },
                    {
                      benefitTitle:
                        'Benefit Level 2 Routine Diagnostic Services, Office In-Network:',
                      copayOrCoinsurancse: '$0 Copay',
                    },
                    {
                      benefitTitle:
                        'Routine Diagnostic Services, Office Out-of-Network:',
                      copayOrCoinsurancse:
                        '40% Coinsurance after you pay deductible',
                    },
                  ],
                },
                {
                  listBenefitDetails: [
                    {
                      benefitTitle:
                        'Benefit Level 1 Teladoc Health General Medical In-Network:',
                      copayOrCoinsurancse: '$15 Copay',
                    },
                    {
                      benefitTitle:
                        'Benefit Level 1 Teladoc Health General Medical In-Network:',
                      copayOrCoinsurancse: '$15 Copay',
                    },
                  ],
                },
                {
                  listBenefitDetails: [
                    {
                      benefitTitle:
                        'Benefit Level 1 Teladoc Health Mental Health Care In-Network:',
                      copayOrCoinsurancse: '$15 Copay',
                    },
                    {
                      benefitTitle:
                        'Benefit Level 2 Teladoc Health Mental Health Care In-Network:',
                      copayOrCoinsurancse: '$15 Copay',
                    },
                  ],
                },
                {
                  listBenefitDetails: [
                    {
                      benefitTitle:
                        'Benefit Level 1 Teladoc Health Mental Health Digital Program In-Network:',
                      copayOrCoinsurancse: '$0 Copay',
                    },
                    {
                      benefitTitle:
                        'Benefit Level 2 Teladoc Health Mental Health Digital Program In-Network:',
                      copayOrCoinsurancse: '$0 Copay',
                    },
                  ],
                },
                {
                  listBenefitDetails: [
                    {
                      benefitTitle:
                        'Benefit Level 1 Teladoc Health Dermatology In-Network:',
                      copayOrCoinsurancse: '$15 Copay',
                    },
                    {
                      benefitTitle:
                        'Benefit Level 2 Teladoc Health Dermatology In-Network:',
                      copayOrCoinsurancse: '$15 Copay',
                    },
                  ],
                },
                {
                  listBenefitDetails: [
                    {
                      benefitTitle:
                        'Benefit Level 1 Teladoc Health Back and Joint Care In-Network:',
                      copayOrCoinsurancse: '$0 Copay',
                    },
                    {
                      benefitTitle:
                        'Benefit Level 2 Teladoc Health Back and Joint Care In-Network:',
                      copayOrCoinsurancse: '$0 Copay',
                    },
                  ],
                },
                {
                  listBenefitDetails: [
                    {
                      benefitTitle:
                        'Benefit Level 1 Teladoc Health Nutrition Counseling In-Network:',
                      copayOrCoinsurancse: '$0 Copay',
                    },
                    {
                      benefitTitle:
                        'Benefit Level 2 Teladoc Health Nutrition Counseling In-Network:',
                      copayOrCoinsurancse: '$0 Copay',
                    },
                  ],
                },
                {
                  listBenefitDetails: [
                    {
                      benefitTitle:
                        'Benefit Level 1 Chiropractic Manipulation In-Network:',
                      copayOrCoinsurancse:
                        '20% Coinsurance after you pay the deductible',
                    },
                    {
                      benefitTitle:
                        'Benefit Level 2 Chiropractic Manipulation In-Network:',
                      copayOrCoinsurancse:
                        '20% Coinsurance after you pay the deductible',
                    },
                    {
                      benefitTitle: 'Chiropractic Manipulation Out-of-Network:',
                      copayOrCoinsurancse:
                        '40% Coinsurance after you pay the deductible',
                    },
                  ],
                  note: 'Limited to 60 visits per benefit period.',
                },
                {
                  listBenefitDetails: [
                    {
                      benefitTitle:
                        'Benefit Level 1 Urgent Care, Facility In-Network:',
                      copayOrCoinsurancse: '$50 Copay',
                    },
                    {
                      benefitTitle:
                        'Benefit Level 2 Urgent Care, Facility In-Network:',
                      copayOrCoinsurancse: '$60 Copay',
                    },
                    {
                      benefitTitle: 'Urgent Care, Facility Out-of-Network:',
                      copayOrCoinsurancse:
                        '40% Coinsurance after you pay the deductible',
                    },
                  ],
                },
                {
                  listBenefitDetails: [
                    {
                      benefitTitle:
                        'Benefit Level 1 Urgent Care, Physician In-Network:',
                      copayOrCoinsurancse: '$50 Copay',
                    },
                    {
                      benefitTitle:
                        'Benefit Level 2 Urgent Care, Physician In-Network:',
                      copayOrCoinsurancse: '$60 Copay',
                    },
                    {
                      benefitTitle: 'Urgent Care, Physician Out-of-Network:',
                      copayOrCoinsurancse:
                        '40% Coinsurance after you pay the deductible',
                    },
                  ],
                },
              ]}
            />
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <InfoCard
              label="Estimate Costs"
              body="Plan your upcoming care costs before you make an appointment."
              icon={EstimateCost}
            ></InfoCard>
            <InfoCard
              label="Services Used"
              body="View a list of common services, the maximum amount covered by your plan and how many you've used."
              icon={EstimateCost}
            ></InfoCard>
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
              deductibleLimit={1500}
              deductibleSpent={750}
              onSelectedMemberChange={() => {}}
              onSelectedNetworkChange={() => {}}
              outOfPocketLimit={3750}
              outOfPocketSpent={1875}
              selectedMemberId="43"
              selectedNetworkId="0"
              displayDisclaimerText={false}
            />
            <SpendingAccountSection
              className="large-section"
              fsaBalance={1009.5}
              hsaBalance={349.9}
              linkURL=""
            />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default MedicalBenefitDetail;
