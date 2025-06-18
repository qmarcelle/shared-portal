'use client';

import { ChatTrigger } from '@/app/clicktochat/components/ChatTrigger';
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
  AccountYearlyData,
  HealthAccountInfo,
  MyHealthCareResponseDTO,
} from './model/myHealthCareResponseDTO';

export type SpendingAccountProps = {
  contact: string;
  spendAccDTO: MyHealthCareResponseDTO;
  accountInfo: HealthAccountInfo;
  isExternalSpendingAccounts: boolean;
  expensesURL: string;
};

const SpendingAccount = ({
  contact,
  spendAccDTO,
  accountInfo,
  isExternalSpendingAccounts,
  expensesURL,
}: SpendingAccountProps) => {
  const spendBalDetails = useMemo(
    () => filterRecentYears(spendAccDTO?.acctYearlyData || []),
    [spendAccDTO.acctYearlyData],
  );

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
          <ExternalSpendingAccountSSOLink
            accountInfo={
              spendAccDTO?.healthAccountInfo?.length
                ? spendAccDTO.healthAccountInfo[0]
                : accountInfo
            }
          />
        )}

        <Column className="app-content app-base-font-color">
          <section className="flex flex-row items-start app-body">
            {/* this check is temporary until the external accounts integration
            is complete. Would currently display missing information if left in */}

            <Column className="flex-grow page-section-63_33 items-stretch">
              {!isExternalSpendingAccounts &&
                (spendBalDetails.length > 0
                  ? spendBalDetails.map((item, index) => (
                      <SpendingAccountsBalance
                        key={index}
                        className="large-section mb-8 last:mb-0"
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
                    ))}
            </Column>

            <Column className="flex-grow page-section-36_67 items-stretch space-y-8">
              <RelatedLinks expensesURL={expensesURL} />
              <Card className="md:ml-8 p-8">
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
                        <ChatTrigger>start a chat</ChatTrigger>
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

const filterRecentYears = (
  spendingBalanceBean: AccountYearlyData[],
): AccountYearlyData[] => {
  if (!spendingBalanceBean || spendingBalanceBean.length === 0) {
    return [];
  }
  const currentYear = new Date().getFullYear();

  return spendingBalanceBean.reduce<AccountYearlyData[]>((acc, item) => {
    const filteredPlanYears = item.planYears.filter(
      (year) => parseInt(year, 10) >= currentYear - 2,
    );
    const filteredYearData = item.yearData.filter((curItem, index) =>
      filteredPlanYears.includes(item.planYears[index]),
    );
    if (filteredPlanYears.length > 0) {
      acc.push({
        ...item,
        planYears: filteredPlanYears,
        yearData: filteredYearData,
      });
    }
    return acc;
  }, []);
};

export default SpendingAccount;
