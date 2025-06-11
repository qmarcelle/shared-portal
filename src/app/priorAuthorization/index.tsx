'use client';

import { PriorAuthorizationCardSection } from '@/app/priorAuthorization/components/PriorAuthorizationCardSection';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { Header } from '@/components/foundation/Header';
import { externalIcon } from '@/components/foundation/Icons';
import { Loader } from '@/components/foundation/Loader';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { FilterItem } from '@/models/filter_dropdown_details';
import { DateFilterValues, getDateRange } from '@/utils/filterUtils';
import { isBlueCareEligible } from '@/visibilityEngine/computeVisibilityRules';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPriorAuthsFromES } from './actions/getPriorAuthsFromES';
import { PriorAuthData } from './models/app/priorAuthAppData';
import { MemberPriorAuthDetail } from './models/priorAuthData';
import { usePriorAuthStore } from './store/priorAuthStore';
import {
  sortByDateHighToLow,
  sortByStatusWithCompleteLast,
} from './utils/priorAuthSorts';

export type PriorAuthorizationProps = {
  data: PriorAuthData;
};
const onClickCallBack = (url: string) => {
  window.open(url, '_blank');
};
const PriorAuthorization = ({ data }: PriorAuthorizationProps) => {
  const priorAuthStore = usePriorAuthStore();
  const [priorAuths, setPriorAuths] = useState<MemberPriorAuthDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize the filter list in the store if it's empty
    if (!priorAuthStore.filters || priorAuthStore.filters.length === 0) {
      priorAuthStore.setFilters(data.filterList);
    }
  }, [priorAuthStore, data.filterList]);

  const fetchData = useCallback(async () => {
    console.log('Fetching prior authorization data...');
    setLoading(true); // Start loading
    try {
      let memberCks: string[] = [priorAuthStore.selectedMember];
      if (priorAuthStore.selectedMember === '1') {
        if (Array.isArray(data.filterList[0]?.value)) {
          memberCks = data.filterList[0]?.value.map((item) => item.value) ?? [];
        }
      }
      const dates = getDateRange(priorAuthStore.selectedDateRange);
      console.log(`Dates from fetchData: ${dates.fromDate} to ${dates.toDate}`);

      const auths = await getPriorAuthsFromES(
        memberCks,
        dates.fromDate,
        dates.toDate,
      );

      console.log('Server response:', auths);
      setPriorAuths([...auths]); // Create a new array reference to ensure re-render
    } catch (error) {
      console.error('Error fetching prior authorization data:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  }, [
    priorAuthStore.selectedMember,
    priorAuthStore.selectedDateRange,
    data.filterList,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onFilterSelect = (index: number, data: FilterItem[]) => {
    if (data[index]) {
      console.log(`Filter selected at index ${index}:`, data[index]);
      if (index === 0) {
        priorAuthStore.setSelectedMember(
          data[index].selectedValue?.value ?? priorAuthStore.selectedMember,
        );
      } else if (index === 1) {
        priorAuthStore.setSelectedDateRange(
          (data[index].selectedValue?.value as `${DateFilterValues}`) ??
            priorAuthStore.selectedDateRange,
        );
      }
      priorAuthStore.setFilters(data);
    }
  };

  const getAuthorizationLanguageForBlueCare = useMemo(() => {
    return (
      <Column
        className="body-1 flex-grow align-top mt-4 md:!flex !block"
        key={2}
      >
        We&apos;ve put together a list of how and when to get referrals and
        authorizations for specific
        <Row>
          services.
          <AppLink
            label="See what we cover"
            className="link !flex caremark pt-0"
            callback={() => {
              onClickCallBack(
                process.env.NEXT_PUBLIC_BLUECARE_LANGUAGE_URL ?? '',
              );
            }}
            icon={<Image src={externalIcon} alt="external" />}
          />
        </Row>
      </Column>
    );
  }, []);

  const getAuthorizationLanguage = useMemo(() => {
    return (
      <Row className="body-1 flex-grow align-top mt-4 md:!flex !block" key={2}>
        Looking for a prescription drug pre-approval? Go to your
        <AppLink
          label="caremark.com account"
          className="link !flex caremark pt-0"
          icon={<Image src={externalIcon} alt="external" />}
          url={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}`}
        />
      </Row>
    );
  }, []);

  function setFilters(filterList: FilterItem[]) {
    priorAuthStore.setFilters(filterList);
  }

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header text="Prior Authorization" type="title-1" />
        <section className="flex justify-start self-start">
          <RichText
            spans={[
              <Row
                className="body-1 flex-grow align-top mt-4 md:!flex !block"
                key={1}
              >
                Need more than two years of prior authorizations?{' '}
                <AppLink
                  label="Start a chat"
                  className="link !flex caremark pt-0"
                />
                or call us at {data.phoneNumber}.
              </Row>,
              isBlueCareEligible(data.visibilityRules)
                ? getAuthorizationLanguageForBlueCare
                : getAuthorizationLanguage,
            ]}
          />
        </section>
        {priorAuths == null && !loading && (
          <>
            <Column>
              <section className="flex justify-start self-start p-4">
                <ErrorInfoCard errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later." />
              </section>
            </Column>
          </>
        )}
        {priorAuths && (
          <section
            className="flex flex-row items-start app-body mt-2"
            id="Filter"
          >
            {' '}
            <Column className=" flex-grow page-section-36_67 items-stretch">
              <Filter
                className="large-section px-0 m-0"
                filterHeading="Filter Transactions"
                onReset={async () => {
                  setFilters(data.filterList);

                  priorAuthStore.setSelectedMember(
                    data.filterList[0]?.selectedValue?.value ?? '',
                  );

                  priorAuthStore.setSelectedDateRange(
                    (data.filterList[1]?.selectedValue
                      ?.value as `${DateFilterValues}`) ?? '',
                  );
                }}
                showReset={true}
                onSelectCallback={(index, data) => onFilterSelect(index, data)}
                filterItems={priorAuthStore.filters}
              />
            </Column>
            <Column className="flex-grow page-section-63_33 items-stretch">
              {loading && (
                <div data-testid="loading-spinner">
                  <Loader />
                </div>
              )}
              {data && !loading && (
                <PriorAuthorizationCardSection
                  sortBy={[
                    {
                      label: 'Date (Most Recent)',
                      value: '43',
                      id: '1',
                      sortFn: sortByDateHighToLow,
                    },
                    {
                      label: 'Status (Denied First)',
                      value: '2',
                      id: '2',
                      sortFn: sortByStatusWithCompleteLast,
                    },
                  ]}
                  priorAuthDetails={priorAuths}
                />
              )}
            </Column>
          </section>
        )}
      </Column>
    </main>
  );
};

export default PriorAuthorization;
