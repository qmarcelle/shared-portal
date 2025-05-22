'use client';

import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { extrenalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { RelatedLinks } from './components/RelatedLinks';
import { SpendingAccountsBalance } from './components/SpendingAccountsBalance';
import { MyHealthCareResponseDTO } from './model/myHealthCareResponseDTO';

export type SpendingAccountProps = {
  contact: string;
  spendAccDTO: MyHealthCareResponseDTO;
};

const SpendingAccount = ({ contact, spendAccDTO }: SpendingAccountProps) => {
  const spendBalDetails = spendAccDTO.spendingBalanceBean || [];
  const healthCareAccs = spendAccDTO.healthAccountInfo || [];
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header
          text="Spending Accounts"
          className="m-1 mb-0 !font-light !text-[32px]/[40px]"
        />
        <section className="flex justify-start self-start">
          {healthCareAccs.length > 0 &&
            healthCareAccs.map((item, index) => (
              <RichText
                key={index}
                spans={[
                  <Column className="m-4 mb-0 md:flex-row block" key={0}>
                    <TextBox
                      className="inline"
                      text="To manage your health spending account details"
                      display="inline"
                    />
                    <AppLink
                      label={item.linkName}
                      url={item.linkUrl}
                      target="_blank"
                      className="link !flex caremark pt-0"
                      displayStyle="inline-flex"
                      icon={<Image src={extrenalIcon} alt="" />}
                    />
                  </Column>,
                ]}
              />
            ))}
        </section>
        <Column className="app-content app-base-font-color">
          <section className="flex flex-row items-start app-body">
            <Column className="flex-grow page-section-63_33 items-stretch">
              {spendBalDetails.length > 0
                ? spendBalDetails.map((item, index) => (
                    <SpendingAccountsBalance
                      key={index}
                      className="large-section"
                      details={[
                        {
                          label: item.planYear,
                          value: '0',
                        },
                      ]}
                      onSelectedDetailChange={() => {}}
                      selectedDetailId="0"
                      contributionsAmount={item.contributionsAmount}
                      distributionsAmount={item.distributionsAmount}
                      balanceAmount={item.balanceAmount}
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
                      <span key={2}>or call us at [{contact}].</span>,
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
