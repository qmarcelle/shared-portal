'use client';

import { PriorAuthorizationCardSection } from '@/app/priorAuthorization/components/PriorAuthorizationCardSection';
import { priorAuthorizationData } from '@/app/priorAuthorization/models/priorAuthorizationData';
import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { Header } from '@/components/foundation/Header';
import { extrenalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import Image from 'next/image';

const PriorAuthorization = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header
          text="Prior Authorization"
          className="m-4 mb-0 !font-light !text-[32px]/[40px]"
        />
        <section className="flex justify-start self-start">
          <RichText
            spans={[
              <Row className="m-4 mb-0" key={0}>
                If you need more than two years of prior authorizations, call
                [1-800-000-000]. If your authorization is not fully approved, we
                will send you a letter explaining why and details on how to ask
                for an appeal.
              </Row>,
              <Row className="body-1 flex-grow align-top mt-4 ml-4" key={1}>
                Looking for a prescription drug pre-approval? Go to your{' '}
                <AppLink
                  label="caremark.com account"
                  className="link flex caremark"
                  icon={<Image src={extrenalIcon} alt="external" />}
                />
              </Row>,
            ]}
          />
        </section>

        <section className="flex flex-row items-start app-body" id="Filter">
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <Filter
              className="large-section px-0 m-0"
              filterHeading="Filter Prior Authorizations"
              dropDown={[
                {
                  dropNownName: 'Connected Plans',
                  dropDownval: [
                    {
                      label: 'All Plans',
                      value: '1',
                      id: '1',
                    },
                    {
                      label: 'Plans',
                      value: '2',
                      id: '2',
                    },
                  ],
                  selectedValue: { label: 'All Plans', value: '1', id: '1' },
                },
                {
                  dropNownName: 'Member',
                  dropDownval: [
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
                  dropNownName: 'Date Range',
                  dropDownval: [
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
            <PriorAuthorizationCardSection
              sortby={[
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
              claims={priorAuthorizationData}
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

export default PriorAuthorization;
