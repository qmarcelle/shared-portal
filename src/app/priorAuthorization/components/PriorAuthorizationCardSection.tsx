import { IComponent } from '@/components/IComponent';
import { ClaimItem } from '@/components/composite/ClaimItem';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RichDropDown } from '@/components/foundation/RichDropDown';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import downIcon from 'down.svg';
import { PriorAuthFilterDetails } from '../models/prior_AuthFilterDetails';

interface ClaimsSnapshotCardSectionProps extends IComponent {
  claims: any;
  sortBy: PriorAuthFilterDetails[];
  selectedDate: any;
  onSelectedDateChange: () => any;
}

const PriorAuthFilterTile = ({ user }: { user: PriorAuthFilterDetails }) => {
  return (
    <Column className="border-none flex-grow">
      <TextBox type="body-1" text={`${user.label}`} />
    </Column>
  );
};

const PriorAuthFilterHead = ({ user }: { user: PriorAuthFilterDetails }) => {
  return (
    <div className="body-1 link">
      <Row className="p-1 items-center">
        <PriorAuthFilterTile user={user} />
        <Image
          src={downIcon}
          className="w-[20px] h-[20px] ml-2 items-end"
          alt=""
        />
      </Row>
    </div>
  );
};
export const PriorAuthorizationCardSection = ({
  claims,
  sortBy,
  selectedDate,
}: ClaimsSnapshotCardSectionProps) => {
  const [claimList, setClaimList] = useState([]);
  const [selected, setSelected] = useState(selectedDate);
  useEffect(() => {
    setClaimList(
      claims &&
        claims.sort((a: any, b: any) => {
          return (
            new Date(b.serviceDate).getTime() -
            new Date(a.serviceDate).getTime()
          );
        }),
    );
  }, [claims]);
  const setSortingOption = (option: any) => {
    setSelected(option);
    getData(option.label);
  };

  const getData = (option: any) => {
    const list = [...claimList];

    const sortedData = list.sort((a: any, b: any) => {
      if (option == 'Date (Most Recent)') {
        return (
          new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()
        );
      } else if (option == 'Status (Denied First)') {
        if (a.claimStatus === 'Denied' && b.claimStatus !== 'Denied') {
          return -1;
        } else if (a.claimStatus !== 'Denied' && b.claimStatus === 'Denied') {
          return 1;
        } else {
          return 0;
        }
      }
      return 0;
    });
    setClaimList(sortedData);
  };
  console.log('claimList', claimList);

  function priorAuthErrorMessage() {
    return (
      <Column className="neutral container">
        <Column className="items-center  p-4 m-[65px]">
          <Spacer axis="horizontal" size={8} />
          <TextBox
            className="text-center"
            text="There was a problem loading prior auth details"
          />
        </Column>
      </Column>
    );
  }
  return (
    <Column className="mt-2">
      <div className={'xs:block md:inline-flex max-sm:m-4 md:my-2 relative'}>
        <Row className="body-1 align-top mb-0 flex-grow">
          Filter Results:{' '}
          <TextBox
            type="body-1"
            className="font-bold ml-2"
            text="5 Prior Authorizations"
          />
        </Row>
        <Row className="body-1 items-end">
          <div className="body-1 mb-1">Sort by:</div>
          <div>
            <RichDropDown
              minWidth="min-w-[280px]"
              headBuilder={(val) => <PriorAuthFilterHead user={val} />}
              itemData={sortBy}
              itemsBuilder={(data) => <PriorAuthFilterTile user={data} />}
              selected={selected}
              onSelectItem={(val) => {
                setSortingOption(val);
              }}
            />
          </div>
        </Row>
        <Spacer axis="horizontal" size={8} />
      </div>

      <div className={'flex flex-col max-sm:my-4'}>
        <Spacer size={16} />
        {claimList == null && priorAuthErrorMessage()}
        {claimList &&
          claimList.map((item: any) => (
            <ClaimItem key={item.memberId} className="mb-4" claimInfo={item} />
          ))}
        <Spacer size={16} />
      </div>
    </Column>
  );
};
