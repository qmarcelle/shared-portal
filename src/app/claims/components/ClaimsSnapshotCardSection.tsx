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
import downIcon from '/assets/down.svg';
import DownloadIcon from '/assets/download.svg';

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
      <section className={'card-main max-sm:my-4 md:my-8'}>
        <SearchField onSearch={handleSearch} hint="Search Claims..." />
      </section>

      <div className={'xs:block md:inline-flex max-sm:my-4 md:my-2'}>
        <Row className="body-1 flex-grow align-top mb-0 ">
          Filter Results:{' '}
          <a className="link ml-2 flex">
            {claims.length} Claims
            <Image
              src={DownloadIcon}
              className="w-[20px] h-[20px] ml-2"
              alt=""
            />
          </a>
        </Row>

        <Row className="body-1 items-end">
          Sort by:{' '}
          <div>
            <RichDropDown
              minWidth="min-w-[200px]"
              headBuilder={(val) => (
                <a className="link ml-2 flex">
                  {val.label}{' '}
                  <Image
                    src={downIcon}
                    className="w-[20px] h-[20px] ml-2"
                    alt=""
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
            />
          </div>
        </Row>

        <Spacer axis="horizontal" size={8} />
      </div>

      <div className={'flex flex-col max-sm:my-4'}>
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
