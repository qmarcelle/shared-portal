import { IComponent } from '@/components/IComponent';
import { ClaimItem } from '@/components/composite/ClaimItem';
import { Column } from '@/components/foundation/Column';
import { SelectItem } from '@/components/foundation/Dropdown';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { ClaimDetails } from '@/models/claim_details';
import Image from 'next/image';
import downIcon from '../../../../../public/assets/down.svg';

interface ClaimsSnapshotCardSectionProps extends IComponent {
  claims: ClaimDetails[];
  sortby: SelectItem[];
  selectedDate: string;
  // TODO: Find the correct model and type it here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectedDateChange: () => any;
}

export const PriorAuthorizationCardSection = ({
  claims,
}: ClaimsSnapshotCardSectionProps) => {
  //const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <Column className="mt-8">
      <div className={'xs:block md:inline-flex max-sm:m-4 md:my-2'}>
        <Row className="body-1 flex-grow align-top mb-0 ">
          Filter Results:{' '}
          <TextBox
            type="body-1"
            className="font-bold ml-2"
            text="5 Prior Authorizations"
          />
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
        <Spacer size={16} />
        {claims.slice(0, 5).map((item) => (
          <ClaimItem key={item.id} className="mb-4" claimInfo={item} />
        ))}
        <Spacer size={16} />
      </div>
    </Column>
  );
};
