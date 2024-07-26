import { Column } from '@/components/foundation/Column';
import { SelectItem } from '@/components/foundation/Dropdown';
import { Row } from '@/components/foundation/Row';
import SearchField from '@/components/foundation/SearchField';
import { Spacer } from '@/components/foundation/Spacer';
import { ClaimDetails } from '@/models/claim_details';
import Image from 'next/image';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import downIcon from '../../../../../public/assets/down.svg';
import DownloadIcon from '../../../../../public/assets/Download.svg';
import { ClaimItem } from '../../../../components/composite/ClaimItem';
import { IComponent } from '../../../../components/IComponent';

interface ClaimsSnapshotCardSectionProps extends IComponent {
  claims: ClaimDetails[];
  sortby: SelectItem[];
  selectedDate: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectedDateChange: () => any;
}

export const ClaimsSnapshotCardSection = ({
  claims,
}: ClaimsSnapshotCardSectionProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isMobile = useMediaQuery({ maxWidth: 768 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchItem, setSearchItem] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filteredUsers, setFilteredUsers] = useState(claims);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = (searchTerm: any) => {
    const searchTerm1 = searchTerm;
    setSearchItem(searchTerm1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredItems = claims.filter((claims: any) =>
      claims.memberName.toLowerCase().includes(searchTerm1.toLowerCase()),
    );

    setFilteredUsers(filteredItems);
  };

  return (
    <Column>
      <section className={'card-main max-sm:m-4 md:my-8'}>
        <SearchField onSearch={handleSearch} hint="Search Claims..." />
      </section>

      <div className={'xs:block md:inline-flex max-sm:m-4 md:my-2'}>
        <Row className="body-1 flex-grow align-top mb-0 ">
          Filter Results:{' '}
          <a className="link ml-2 flex">
            20 Claims{' '}
            <Image
              src={DownloadIcon}
              className="w-[20px] h-[20px] ml-2"
              alt=""
            />
          </a>
        </Row>

        <Row className="body-1 items-end">
          Sort by:{' '}
          <a className="link ml-2 flex">
            Date (Most Recent)
            <Image src={downIcon} className="w-[20px] h-[20px] ml-2" alt="" />
          </a>
        </Row>

        <Spacer axis="horizontal" size={8} />
      </div>

      <div className={'flex flex-col max-sm:m-4'}>
        <Spacer size={12} />
        {claims.slice(0, 10).map((item) => (
          <ClaimItem key={item.id} className="mb-4" claimInfo={item} />
        ))}
        <Spacer size={16} />
      </div>
    </Column>
  );
};
