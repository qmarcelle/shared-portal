'use client';

import { PriorAuthorizationCardSection } from '@/app/priorAuthorization/components/PriorAuthorizationCardSection';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { Header } from '@/components/foundation/Header';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { FilterItem } from '@/models/filter_dropdown_details';
import Image from 'next/image';
import { useState } from 'react';
import { PriorAuthData } from './models/app/priorAuthAppData';

export type PriorAuthorizationProps = {
  data: PriorAuthData;
  initialFilters: FilterItem[];
};
const PriorAuthorization = ({
  data,
  initialFilters,
}: PriorAuthorizationProps) => {
  const [filters, setFilters] = useState(initialFilters);

  function onFilterSelect(index: number, filter: FilterItem[]) {
    setFilters(filter);
  }

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
              <Row
                className="body-1 flex-grow align-top mt-4 ml-4 md:!flex !block"
                key={1}
              >
                Need more than two years of prior authorizations?{' '}
                <AppLink
                  label="Start a chat"
                  className="link !flex caremark pt-0"
                />
                or call us at [{data.phoneNumber}].
              </Row>,
              <Row
                className="body-1 flex-grow align-top mt-4 ml-4 md:!flex !block"
                key={2}
              >
                Looking for a prescription drug pre-approval? Go to your{' '}
                <AppLink
                  label="caremark.com account"
                  className="link !flex caremark pt-0"
                  icon={<Image src={externalIcon} alt="external" />}
                />
              </Row>,
            ]}
          />
        </section>
        {data.claimDetails == null && (
          <>
            <Column>
              <section className="flex justify-start self-start p-4">
                <ErrorInfoCard errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later." />
              </section>
            </Column>
          </>
        )}
        {data.claimDetails && (
          <section
            className="flex flex-row items-start app-body mt-2"
            id="Filter"
          >
            <Column className=" flex-grow page-section-36_67 items-stretch">
              <Filter
                className="large-section px-0 m-0"
                filterHeading="Filter Prior Authorizations"
                onReset={() => {}}
                showReset={true}
                onSelectCallback={onFilterSelect}
                filterItems={filters}
              />
            </Column>

            <Column className="flex-grow page-section-63_33 items-stretch">
              {data && (
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
                  claims={data.claimDetails}
                />
              )}
              <section className="flex justify-center self-center">
                <Row className="m-2 mt-0">
                  Viewing 5 of 5 Prior Authorizations
                </Row>
              </section>
            </Column>
          </section>
        )}
      </Column>
    </main>
  );
};

export default PriorAuthorization;
