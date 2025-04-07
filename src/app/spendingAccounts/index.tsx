'use client';

import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { extrenalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import Image from 'next/image';
import RelatedLinks from './components/RelatedLinks';
import { SpendingAccountsBalance } from './components/SpendingAccountsBalance';

export type SpendingAccountProps = {
  contact: string;
};

const SpendingAccount = ({ contact }: SpendingAccountProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header
          text="Spending Accounts"
          className="m-4 mb-0 !font-light !text-[32px]/[40px]"
        />
        <section className="flex justify-start self-start">
          <RichText
            spans={[
              <Column className="m-4 mb-0 md:flex-row block" key={0}>
                To manage your health spending account details
                <AppLink
                  label="visit Health Equity"
                  className="link !flex caremark pt-0"
                  icon={<Image src={extrenalIcon} alt="external" />}
                />
              </Column>,
            ]}
          />
        </section>

        <Spacer size={32}></Spacer>
        <Column className="app-content app-base-font-color">
          <section className="flex flex-row items-start app-body">
            <Column className="flex-grow page-section-63_33 items-stretch">
              <SpendingAccountsBalance
                className="large-section"
                details={[
                  {
                    label: '2023',
                    value: '0',
                  },
                  {
                    label: '2022',
                    value: '1',
                  },
                  {
                    label: '2021',
                    value: '2',
                  },
                ]}
                onSelectedDetailChange={() => {}}
                selectedDetailId="0"
                contributionsAmount={4000.0}
                distributionsAmount={4000.0}
                balanceAmount={0.0}
                transactionsLabel="View HSA Transactions"
                spendingBalanceTitle="Health Saving Account Balance"
              />
              <SpendingAccountsBalance
                className="large-section"
                details={[
                  {
                    label: '2023',
                    value: '0',
                  },
                  {
                    label: '2022',
                    value: '1',
                  },
                  {
                    label: '2021',
                    value: '2',
                  },
                ]}
                onSelectedDetailChange={() => {}}
                selectedDetailId="0"
                contributionsAmount={1200.0}
                distributionsAmount={850.0}
                balanceAmount={0.0}
                transactionsLabel="View FSA Transactions"
                spendingBalanceTitle="Flexible Spending Account Balance"
              />
            </Column>
            <Column className=" flex-grow page-section-36_67 items-stretch mt-4">
              <RelatedLinks />
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
