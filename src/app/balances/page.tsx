'use client';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { MedicalBalanceSection } from '../dashboard/components/MedicalBalanceSection';
import { SpendingAccountSummary } from '../dashboard/components/SpendingAccountSummary';
import { DentalBalance } from './components/DentalBalance';
import { SpendingAccountSection } from './components/SpendingAccountsSection';
import { VisionBalance } from './components/VisionBalance';

const Balances = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Spacer size={32} />
      <Column className="app-content app-base-font-color">
        <Header className="m-4 mb-0" text="Balances" />
        <TextBox
          className="body-1 m-4 mb-0 w-2/3"
          text="Your balances show how close you are to meeting your annual plan deductibles and out-of-pocket limits."
        ></TextBox>
        <Spacer size={9} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
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
              selectedNetworkId="1"
              displayDisclaimerText={true}
              disclaimerText="Your policy has separate limits for in- and out-of-network charges. Charges incurred with an in- network provider will apply to your in-network limit; charges incurred with an out-of-network provider will apply toward your out-of-network limit. Please note that individual out of pocket limits only apply if the family limit has not yet been satisfied."
            />
            <DentalBalance
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
              deductibleLimit={null}
              deductibleSpent={null}
              onSelectedMemberChange={() => {}}
              outOfPocketLimit={null}
              outOfPocketSpent={null}
              selectedMemberId="43"
              serviceDetailsUsed={[
                {
                  limitAmount: 2000,
                  spentAmount: 90.0,
                  serviceName: 'Annual Maximum Basic and Major Coverage',
                },
                {
                  limitAmount: 2000,
                  spentAmount: 0.0,
                  serviceName: 'Ortho Lifetime Maximum',
                },
              ]}
              balancesFlag={true}
            />
            <VisionBalance className="large-section" linkURL="" />
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
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

export default Balances;
