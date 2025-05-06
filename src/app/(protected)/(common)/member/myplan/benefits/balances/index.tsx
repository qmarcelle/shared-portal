'use client';
import { SpendingAccountSummary } from '@/app/(protected)/(common)/member/dashboard/components/SpendingAccountSummary';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import {
  isDentalCostEstimator,
  isFindADentist,
  isVisionEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { BalanceSectionWrapper } from './components/BalanceSection';
import { SpendingAccountSection } from './components/SpendingAccountsSection';
import { VisionBalance } from './components/VisionBalance';
import { BalanceData } from './models/app/balancesData';

type BalancePageProps = {
  data: BalanceData | undefined;
};

export const Balances = ({ data }: BalancePageProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Spacer size={32} />
      <Column className="app-content app-base-font-color">
        <Header className="my-4 mb-0" text="Balances" />
        <TextBox
          className="body-1 my-4 mb-0 w-2/3"
          text="Your balances show how close you are to meeting your annual plan deductibles and out-of-pocket limits."
        ></TextBox>
        <Spacer size={9} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <BalanceSectionWrapper
              key="Medical"
              title="Medical & Pharmacy Balance"
              product={data?.medical}
            />
            {isFindADentist(data?.visibilityRules) &&
              isDentalCostEstimator(data?.visibilityRules) && (
                <BalanceSectionWrapper
                  key="Dental"
                  title="Dental Balance"
                  product={data?.dental}
                />
              )}

            {isVisionEligible(data?.visibilityRules) && (
              <VisionBalance
                className="large-section"
                linkURL={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_EYEMED}`}
              />
            )}
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
