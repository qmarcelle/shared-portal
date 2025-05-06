/**
 * transactions
 * Transactions
 */
export const metadata = {
  title: 'Transactions | Consumer Portal',
  description: 'Transactions',
};

('use client');

import { TransactionCard } from '@/app/(protected)/(common)/member/transactions/components/TransactionCard';
import { transactionData } from '@/app/(protected)/(common)/member/transactions/mock/transactionData';
import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { Header } from '@/components/foundation/Header';
import { extrenalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import Image from 'next/image';

const Transactions = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header
          text="Transactions"
          className="m-4 mb-0 !font-light !text-[32px]/[40px]"
        />
        <section className="flex justify-start self-start">
          <RichText
            spans={[
              <Row
                className="body-1 flex-grow md:!flex !block align-top mt-4 ml-4"
                key={1}
              >
                To manage your health spending account details
                <AppLink
                  label="Visit Health Equity"
                  className="link caremark !flex pt-0"
                  icon={<Image src={extrenalIcon} alt="external" />}
                />
              </Row>,
            ]}
          />
        </section>
        <section className="ml-4">
          <RichText
            spans={[
              <span key={1}>If you need help,</span>,
              <span className="link" key={2}>
                <a>start a chat,</a>
              </span>,
              <span key={3}>
                {' '}
                call us at [1-800-000-000] or email consumercoach@bcbst.com{' '}
              </span>,
            ]}
          />
        </section>

        <section
          className="flex flex-row items-start app-body mt-8"
          id="Filter"
        >
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <Filter
              className="large-section px-0 m-0"
              filterHeading="Filter Transactions"
              onReset={() => {}}
              showReset={false}
              onSelectCallback={() => {}}
              filterItems={[
                {
                  type: 'dropdown',
                  label: 'Account Type',
                  value: [
                    {
                      label: 'HSA',
                      value: '1',
                      id: '1',
                    },
                    {
                      label: 'RSA',
                      value: '2',
                      id: '2',
                    },
                  ],
                  selectedValue: { label: 'HSA', value: '1', id: '1' },
                },
                {
                  type: 'dropdown',
                  label: 'Account Type',
                  value: [
                    {
                      label: 'Last 30 days',
                      value: '1',
                      id: '1',
                    },
                    {
                      label: 'Last 60 days',
                      value: '2',
                      id: '2',
                    },
                    {
                      label: 'Last 90 days',
                      value: '3',
                      id: '3',
                    },
                    {
                      label: 'Last 120 days',
                      value: '4',
                      id: '4',
                    },
                  ],
                  selectedValue: {
                    label: 'Last two Years',
                    value: '4',
                    id: '4',
                  },
                },
              ]}
            />
          </Column>

          <Column className="flex-grow page-section-63_33 items-stretch">
            <TransactionCard
              sortBy={[
                {
                  label: 'Date (Most Recent)',
                  value: '43',
                },
                {
                  label: 'Status (Denied First)',
                  value: '2',
                },
              ]}
              onSelectedDateChange={() => {}}
              selectedDate="43"
              transactionsInfo={transactionData}
            />

            <section className="flex justify-center self-center">
              <Row className="m-2 mt-0">
                Viewing 5 of 5 Prior Authorizations
              </Row>
            </section>
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default Transactions;
