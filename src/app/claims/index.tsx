'use client';

import { ClaimsSnapshotCardSection } from '@/app/claims/components/ClaimsSnapshotCardSection';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { ClaimDetails } from '@/models/claim_details';
import { FilterItem } from '@/models/filter_dropdown_details';
import { getDifferenceInDays } from '@/utils/date_formatter';
import Link from 'next/link';
import { useMemo, useState } from 'react';

/* eslint-disable */
type ClaimsPageProps = {
  filters: FilterItem[] | null;
  claimsList: ClaimDetails[] | undefined;
};

const ClaimsSnapshot = ({ filters, claimsList }: ClaimsPageProps) => {
  const initialFilter = useMemo(() => {
    return filters ?? [];
  }, [filters]);
  const [searchText, setSearchText] = useState('');
  const initialClaims = useMemo(() => claimsList ?? [], [claimsList]);
  const [filter, setFilter] = useState<FilterItem[]>(initialFilter);
  const [claims, setClaims] = useState(filterClaims(initialFilter));

  function onFilterSelect(index: number, filter: FilterItem[]) {
    setFilter(filter);
    const filteredClaims = filterClaims(filter);
    setClaims(filteredClaims);
  }

  function filterClaims(selectedFilter: FilterItem[]) {
    return initialClaims.filter((item) => {
      // Member Filter
      if (selectedFilter[0].selectedValue?.value != '0') {
        if (selectedFilter[0].selectedValue?.value != item.memberId) {
          return false;
        }
      }

      // Claim Type Filter
      if (selectedFilter[1].selectedValue?.value != '0') {
        if (selectedFilter[1].selectedValue?.value !== item.claimType) {
          return false;
        }
      }

      // Date Filter
      const currentDate = new Date();
      const claimDate = new Date(item.serviceDate);
      const diffInDays = getDifferenceInDays(currentDate, claimDate);
      if (selectedFilter[2].selectedValue?.label == 'Last 30 Days') {
        // Check for within 30 days
        if (diffInDays >= 30) {
          return false;
        }
      }

      if (selectedFilter[2].selectedValue?.label == 'Last 60 Days') {
        // Check for within 60 days
        if (diffInDays >= 60) {
          return false;
        }
      }

      if (selectedFilter[2].selectedValue?.label == 'Last 90 Days') {
        // Check for within 90 days
        if (diffInDays >= 60) {
          return false;
        }
      }

      if (selectedFilter[2].selectedValue?.label == 'Last 120 Days') {
        // Check for within 120 days
        if (diffInDays >= 120) {
          return false;
        }
      }

      if (selectedFilter[2].selectedValue?.label == 'Last Calendar Year') {
        // Check for within 365 days
        if (diffInDays >= 365) {
          return false;
        }
      }

      return true;
    });
  }

  function resetFilter() {
    setFilter(initialFilter);
    setClaims(initialClaims);
  }

  function refineClaimsWithSearch() {
    if (searchText.length <= 3) {
      return claims;
    }

    const searchTerm = searchText.toLowerCase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredItems = claims.filter(
      (claim) =>
        claim.memberName.toLowerCase().includes(searchTerm) ||
        claim.issuer.toLowerCase().includes(searchTerm) ||
        claim.id.toLowerCase().includes(searchTerm),
    );

    return filteredItems;
  }

  function updateSearchTerm(text: string) {
    setSearchText(text);
  }

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header
          text="Claims"
          type="title-2"
          className="mb-0 !font-light !text-[32px]/[40px]"
        />
        <Spacer size={16} />
        <section className="flex justify-start self-start">
          <Column>
            <RichText
              className="mb-4"
              spans={[
                <span key={0}>
                  If you need more than two years of claims,{' '}
                </span>,
                <span className="link font-bold" key={1}>
                  start a chat
                </span>,
                <span key={2}> or call us at [1-800-000-000].</span>,
              ]}
            />

            <RichText
              spans={[
                <span key={0}>Need to submit a claim? </span>,
                <span className="link font-bold" key={1}>
                  <Link href="/claims/submitAClaim">Get the form you need</Link>
                </span>,
                <span key={2}>.</span>,
              ]}
            />
          </Column>
        </section>

        {claimsList ? (
          <section className="flex flex-row items-start app-body" id="Filter">
            <Column className=" flex-grow page-section-36_67 items-stretch">
              <Spacer size={16} />
              <Filter
                className="large-section px-0 m-0"
                filterHeading="Filter Claims"
                onSelectCallback={(index, data) => onFilterSelect(index, data)}
                filterItems={filter}
                onReset={resetFilter}
                showReset={filter != initialFilter}
              />
            </Column>

            <Column className="flex-grow page-section-63_33 items-stretch">
              <ClaimsSnapshotCardSection
                filter={filter}
                sortby={[
                  {
                    id: '1',
                    label: 'Date (Most Recent)',
                    value: '1',
                  },
                  {
                    id: '2',
                    label: 'Status (Denied First)',
                    value: '2',
                  },
                  {
                    id: '3',
                    label: 'MyShare (High to Low)',
                    value: '3',
                  },
                  {
                    id: '0',
                    label: 'MyShare (Low to High)',
                    value: '0',
                  },
                ]}
                updateSearchTerm={updateSearchTerm}
                onSelectedDateChange={() => {}}
                searchTerm={searchText}
                claims={refineClaimsWithSearch()}
              />
            </Column>
          </section>
        ) : (
          <ErrorInfoCard
            className="mt-4"
            errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later."
          />
        )}
      </Column>
    </main>
  );
};

export default ClaimsSnapshot;
