import { ClaimItem } from '@/components/composite/ClaimItem';
import { Column } from '@/components/foundation/Column';
import { Pagination } from '@/components/foundation/Pagination';
import {
  RichDropDown,
  RichSelectItem,
} from '@/components/foundation/RichDropDown';
import { Row } from '@/components/foundation/Row';
import SearchField from '@/components/foundation/SearchField';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import { ClaimDetails } from '@/models/claim_details';
import { FilterItem } from '@/models/filter_dropdown_details';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ClaimsSnapshotCardSectionProps extends IComponent {
  claims: ClaimDetails[];
  sortby: RichSelectItem[];
  filter: FilterItem[];
  searchTerm: string;
  updateSearchTerm: (val: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectedDateChange: () => any;
}

export const ClaimsSnapshotCardSection = ({
  claims,
  sortby,
  filter,
  searchTerm,
  updateSearchTerm,
}: ClaimsSnapshotCardSectionProps) => {
  const router = useRouter();

  const [selectedSort, setSelectedSort] = useState(sortby[0]);

  function sortClaimsByMyShareLowToHigh() {
    return claims.sort(
      (a, b) =>
        ((a.columns?.at(2)?.value as number) ?? 0) -
        ((b.columns?.at(2)?.value as number) ?? 0),
    );
  }

  function sortClaimsByMyShareHighToLow() {
    return claims.sort(
      (a, b) =>
        ((b.columns?.at(2)?.value as number) ?? 0) -
        ((a.columns?.at(2)?.value as number) ?? 0),
    );
  }

  function sortClaimsByDateHighToLow() {
    return claims.sort(
      (a, b) =>
        (new Date(b.serviceDate) as unknown as number) -
        (new Date(a.serviceDate) as unknown as number),
    );
  }

  function sortClaimsByStatus() {
    // Rejected First
    return claims.sort((a, b) => b.claimStatusCode - a.claimStatusCode);
  }

  function sortItems(selectedSort: RichSelectItem) {
    // Sort per MyShare Low to High
    if (selectedSort.value == '0') {
      return [...sortClaimsByMyShareLowToHigh()];
    } else if (selectedSort.value == '1') {
      // Sort by Date
      return [...sortClaimsByDateHighToLow()];
    } else if (selectedSort.value == '2') {
      // Sort by Claim Status
      return [...sortClaimsByStatus()];
    } else {
      return [...sortClaimsByMyShareHighToLow()];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = (text: string) => {
    updateSearchTerm(text);
  };

  const navigateToClaimDetails = (claimId: string) => {
    const claimType = claims.find(
      (claim) => claim.encryptedClaimId === claimId,
    )?.type;
    router.push(`/claims/${claimId}?type=${claimType}`);
  };

  return (
    <Column>
      <section className={'card-main max-sm:my-4 md:my-8'} role="search">
        <SearchField
          onSearch={handleSearch}
          hint="Search Claims..."
          aria-label="Search claims by member name, provider name, or claim ID"
        />
      </section>

      <div
        className={'xs:block md:inline-flex max-sm:my-4 md:my-2'}
        role="toolbar"
        aria-label="Claims list controls"
      >
        <Row className="body-1 flex-grow align-top mb-0 ">
          <span id="filter-label">Filter Results:</span>{' '}
          <a
            className="link ml-2 flex"
            href="#"
            aria-label={`Download ${claims.length} claims`}
          >
            {claims.length} Claims
            <Image
              src="/assets/download.svg"
              className="w-[20px] h-[20px] ml-2"
              alt=""
              aria-hidden="true"
            />
          </a>
        </Row>

        <Row className="body-1 items-end">
          <span id="sort-label">Sort by:</span>{' '}
          <div>
            <RichDropDown
              minWidth="min-w-[200px]"
              headBuilder={(val) => (
                <a className="link ml-2 flex" aria-labelledby="sort-label">
                  {val.label}{' '}
                  <Image
                    src="/assets/down.svg"
                    className="w-[20px] h-[20px] ml-2"
                    alt=""
                    aria-hidden="true"
                  />
                </a>
              )}
              itemData={sortby}
              itemsBuilder={(data) => (
                <p className="text-nowrap">{data.label}</p>
              )}
              selected={selectedSort}
              onSelectItem={(val) => {
                setSelectedSort(val);
              }}
              aria-label="Sort claims by"
            />
          </div>
        </Row>

        <Spacer axis="horizontal" size={8} />
      </div>

      <div
        className={'flex flex-col max-sm:my-4'}
        role="region"
        aria-label="Claims list"
      >
        <Spacer size={12} />
        <Pagination<ClaimDetails>
          key={selectedSort.id + JSON.stringify(filter) + searchTerm}
          initialList={sortItems(selectedSort)}
          pageSize={10}
          wrapperBuilder={(items) => <Column>{items}</Column>}
          itemsBuilder={(item) => (
            <ClaimItem
              key={item.id}
              className="mb-4"
              claimInfo={item}
              callBack={navigateToClaimDetails}
            />
          )}
          label="Claims"
          totalCount={claims.length}
        />
        <Spacer size={16} />
      </div>
    </Column>
  );
};
