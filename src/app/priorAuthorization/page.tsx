'use client';

import { PriorAuthorizationCardSection } from '@/app/priorAuthorization/components/PriorAuthorizationCardSection';
import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { Header } from '@/components/foundation/Header';
import { extrenalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import Image from 'next/image';
import { useEffect } from 'react';
import usePriorAuthStore from './stores/priorAuthStore';

const PriorAuthorization = () => {
  const getData = usePriorAuthStore();

  useEffect(() => {
    getData.execute();
  }, []);
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header
          text="Prior Authorization"
          className="mb-0 !font-light !text-[32px]/[40px]"
        />
        <section className="flex justify-start self-start">
          <RichText
            spans={[
              <Row className="mb-0" key={0}>
                If you need more than two years of prior authorizations, call
                [1-800-000-000]. If your authorization is not fully approved, we
                will send you a letter explaining why and details on how to ask
                for an appeal.
              </Row>,
              <Row className="body-1 flex-grow align-top mt-4" key={1}>
                Looking for a prescription drug pre-approval? Go to your{' '}
                <AppLink
                  label="caremark.com account"
                  className="link !flex pt-0"
                  icon={<Image src={extrenalIcon} alt="external" />}
                />
              </Row>,
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
              filterHeading="Filter Prior Authorizations"
              filterItems={[
                {
                  type: 'dropdown',
                  label: 'Member',
                  value: [
                    {
                      label: 'All Members',
                      value: '1',
                      id: '1',
                    },
                    {
                      label: 'Chris Hall',
                      value: '2',
                      id: '2',
                    },
                    {
                      label: 'Madission Hall',
                      value: '3',
                      id: '3',
                    },
                    {
                      label: 'Forest Hall',
                      value: '4',
                      id: '4',
                    },
                    {
                      label: 'Telly Hall',
                      value: '5',
                      id: '5',
                    },
                    {
                      label: 'Janie Hall',
                      value: '6',
                      id: '6',
                    },
                  ],
                  selectedValue: { label: 'All Members', value: '1', id: '1' },
                },
                {
                  type: 'dropdown',
                  label: 'Date Range',
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
                    {
                      label: 'Last calender Years',
                      value: '5',
                      id: '5',
                    },
                    {
                      label: 'Last two Years',
                      value: '6',
                      id: '6',
                    },
                  ],
                  selectedValue: {
                    label: 'Last two Years',
                    value: '6',
                    id: '6',
                  },
                },
              ]}
            />
          </Column>

          <Column className="flex-grow page-section-63_33 items-stretch">
            {getData.data && (
              <PriorAuthorizationCardSection
                sortBy={[
                  {
                    label: 'Date (Most Recent)',
                    value: '43',
                    id: '1',
                  },
                  {
                    label: 'Status (Denied First)',
                    value: '2',
                    id: '2',
                  },
                ]}
                onSelectedDateChange={() => {}}
                selectedDate={{
                  label: 'Date (Most Recent)',
                  value: '43',
                  id: '1',
                }}
                claims={getData.data}
              />
            )}
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

export default PriorAuthorization;
