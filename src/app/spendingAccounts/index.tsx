'use client';

import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { useMemo, useState } from 'react';
import ExternalSpendingAccountSSOLink from './components/ExternalSpendingAccountSSOLink';
import { RelatedLinks } from './components/RelatedLinks';
import { SpendingAccountsBalance } from './components/SpendingAccountsBalance';
import {
  HealthAccountInfo,
  MyHealthCareResponseDTO,
} from './model/myHealthCareResponseDTO';

export type SpendingAccountProps = {
  contact: string;
  spendAccDTO: MyHealthCareResponseDTO;
  accountInfo: HealthAccountInfo;
  isExternalSpendingAccounts: boolean;
};

const SpendingAccount = ({
  contact,
  spendAccDTO,
  accountInfo,
  isExternalSpendingAccounts,
}: SpendingAccountProps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const spendBalDetails = useMemo(
    () => spendAccDTO.spendingBalanceBean || [],
    [spendAccDTO.spendingBalanceBean],
  ); // internal info

  // Track selected year index for each account
  const [selectedYearIndexes, setSelectedYearIndexes] = useState<number[]>(
    (Array.isArray(spendBalDetails) ? spendBalDetails : []).map(() => 0),
  );

  const handleSelectedDetailChange = (
    accountIdx: number,
    newDetailId: string,
  ) => {
    const newIndexes = [...selectedYearIndexes];
    newIndexes[accountIdx] = parseInt(newDetailId, 10);
    setSelectedYearIndexes(newIndexes);
  };

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header
          text="Spending Accounts"
          className="m-1 mb-0 !font-light !text-[32px]/[40px]"
        />
        {isExternalSpendingAccounts && (
          <ExternalSpendingAccountSSOLink accountInfo={accountInfo} />
        )}
        <Column className="app-content app-base-font-color">
          <section className="flex flex-row items-start app-body">
            <Column className="flex-grow page-section-63_33 items-stretch">
              {spendBalDetails.length > 0
                ? spendBalDetails.map((item, index) => (
                    <SpendingAccountsBalance
                      key={index}
                      className="large-section"
                      details={item.planYears.map((planYear, planIndex) => ({
                        label: planYear,
                        value: planIndex.toString(),
                      }))}
                      yearBalanceInfo={
                        item.yearData[selectedYearIndexes[index]]
                      }
                      onSelectedDetailChange={(detailId: string) =>
                        handleSelectedDetailChange(index, detailId)
                      }
                      selectedDetailId={selectedYearIndexes[index].toString()}
                      transactionsLabel={item.transactionsLabel}
                      spendingBalanceTitle={item.spendingBalanceTitle}
                      accountTypeText={item.accountTypeText}
                    />
                  ))
                : spendAccDTO.isApiError && (
                    <ErrorInfoCard
                      className="mt-4"
                      errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later."
                    />
                  )}
            </Column>
            <Column className="flex-grow page-section-36_67 items-stretch mt-4">
              <RelatedLinks isHealthEquity={spendAccDTO.isHealthEquity!} />
              <Spacer size={52} />
              <Card className="!mt-0 md:ml-8 p-8">
                <Column className="flex flex-col">
                  <Header
                    type="title-2"
                    text="Get Help With Your Spending Accounts"
                  ></Header>
                  <Spacer size={16} />
                  <RichText
                    spans={[
                      <span key={0}>
                        if you need help, please reach out to us.You can{' '}
                      </span>,
                      <span className="link" key={1}>
                        <a>start a chat </a>
                      </span>,
                      <span key={2}>or call us at {contact}.</span>,
                    ]}
                  />
                  <Spacer size={24} />
                </Column>
              </Card>
            </Column>
          </section>
        </Column>
      </Column>
    </main>
  );
};

export default SpendingAccount;
